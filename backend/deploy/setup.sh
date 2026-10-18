#!/usr/bin/env bash
# One-time server setup for the backend: venv, gunicorn (systemd), web proxy.
# Run as root:  bash deploy/setup.sh
# Safe to re-run.
#
# Proxy mode is picked automatically:
#   - port 80 free          -> install nginx + certbot (HTTPS) in front of gunicorn
#   - port 80 already taken -> (e.g. the Caddy container) gunicorn listens on the
#                              docker bridge IP; add the printed block to that proxy
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="api.bihartailiksahusabha.com"
STATIC_DIR="/var/www/sahu/static"
SERVICE="sahu-backend"
PORT=8000

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  echo "Missing $APP_DIR/.env — create it first (see .env.example)." >&2
  exit 1
fi

port80_owner="$(ss -tlnpH 'sport = :80' 2>/dev/null | grep -o 'users:(("[^"]*' | head -1 | cut -d'"' -f2 || true)"
if [[ -n "$port80_owner" && "$port80_owner" != "nginx" ]]; then
  MODE="external"
  BIND_IP="$(ip -4 -o addr show docker0 2>/dev/null | awk '{print $4}' | cut -d/ -f1)"
  BIND_IP="${BIND_IP:-172.17.0.1}"
else
  MODE="nginx"
  BIND_IP="127.0.0.1"
fi
echo "==> Proxy mode: $MODE (port 80 owner: ${port80_owner:-none}); gunicorn on $BIND_IP:$PORT"

echo "==> Installing system packages"
apt-get update -q
apt-get install -y -q python3 python3-venv python3-pip
if [[ "$MODE" == "nginx" ]]; then
  apt-get install -y -q nginx certbot python3-certbot-nginx
fi

echo "==> Python virtualenv"
[[ -x .venv/bin/python ]] || python3 -m venv .venv
.venv/bin/pip install -q --upgrade pip
.venv/bin/pip install -q -r requirements.txt

echo "==> Django: migrate + collectstatic"
mkdir -p "$STATIC_DIR"
grep -q '^STATIC_ROOT=' .env || echo "STATIC_ROOT=$STATIC_DIR" >> .env
.venv/bin/python manage.py migrate --noinput
.venv/bin/python manage.py collectstatic --noinput -v 0
.venv/bin/python manage.py check

echo "==> gunicorn systemd service"
sed -e "s#__APP_DIR__#$APP_DIR#g" -e "s#__BIND__#$BIND_IP:$PORT#g" \
  deploy/sahu-backend.service > "/etc/systemd/system/$SERVICE.service"
systemctl daemon-reload
systemctl enable "$SERVICE"
systemctl restart "$SERVICE"
sleep 2
systemctl is-active --quiet "$SERVICE" || { journalctl -u "$SERVICE" -n 30 --no-pager; exit 1; }
curl -fsS -o /dev/null -H "Host: $DOMAIN" "http://$BIND_IP:$PORT/api/media/" && echo "gunicorn answering on $BIND_IP:$PORT"

if [[ "$MODE" == "external" ]]; then
  # A failed nginx install from an earlier run would keep retrying on boot
  if systemctl list-unit-files nginx.service >/dev/null 2>&1; then
    systemctl disable --now nginx 2>/dev/null || true
  fi
  if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
    ufw allow from 172.16.0.0/12 to any port "$PORT" proto tcp comment 'docker -> sahu-backend'
  fi
  cat <<EOF

Done. Now add this site block to your existing proxy ($port80_owner), e.g. Caddy:

$DOMAIN {
    reverse_proxy $BIND_IP:$PORT
}

then reload it. Caddy issues the HTTPS certificate automatically.
EOF
  exit 0
fi

echo "==> nginx"
cp deploy/nginx-api.conf "/etc/nginx/sites-available/$SERVICE"
ln -sf "/etc/nginx/sites-available/$SERVICE" "/etc/nginx/sites-enabled/$SERVICE"
nginx -t
systemctl enable --now nginx
systemctl reload nginx

echo "==> HTTPS certificate"
if [[ -d "/etc/letsencrypt/live/$DOMAIN" ]]; then
  certbot --nginx -d "$DOMAIN" --non-interactive --reinstall --redirect
else
  echo "Requesting certificate for $DOMAIN (DNS must already point here)."
  certbot --nginx -d "$DOMAIN" --redirect
fi

echo "Done. Check: curl -I https://$DOMAIN/api/media/"
