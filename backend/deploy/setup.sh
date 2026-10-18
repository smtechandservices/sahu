#!/usr/bin/env bash
# One-time server setup for the backend: venv, gunicorn (systemd), nginx, HTTPS.
# Run as root from anywhere:  bash deploy/setup.sh
# Safe to re-run.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="api.bihartailiksahusabha.com"
STATIC_DIR="/var/www/sahu/static"
SERVICE="sahu-backend"

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  echo "Missing $APP_DIR/.env — create it first (see .env.example)." >&2
  exit 1
fi

echo "==> Installing system packages"
apt-get update -q
apt-get install -y -q python3 python3-venv python3-pip nginx certbot python3-certbot-nginx

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
sed "s#__APP_DIR__#$APP_DIR#g" deploy/sahu-backend.service > "/etc/systemd/system/$SERVICE.service"
systemctl daemon-reload
systemctl enable --now "$SERVICE"
systemctl restart "$SERVICE"

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

echo
systemctl --no-pager --lines=0 status "$SERVICE" || true
echo "Done. Check: curl -I https://$DOMAIN/api/media/"
