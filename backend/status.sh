#!/usr/bin/env bash
# Show whether the backend is up: process, local health check, public URL.
#   ./status.sh
set -uo pipefail

cd "$(dirname "$0")"

SERVICE="sahu-backend"
PIDFILE="gunicorn.pid"
DOMAIN="api.bihartailiksahusabha.com"
CHECK_PATH="/api/media/"

if [[ -t 1 ]]; then G=$'\033[32m' R=$'\033[31m' N=$'\033[0m'; else G='' R='' N=''; fi
ok()   { printf '  %s✔%s %s\n' "$G" "$N" "$1"; }
bad()  { printf '  %s✘%s %s\n' "$R" "$N" "$1"; }

check_url() {  # label url [curl args...]
  local label="$1" url="$2"; shift 2
  local out
  out="$(curl -s -o /dev/null -w '%{http_code} %{time_total}' --max-time 15 "$@" "$url")"
  local code="${out%% *}" secs="${out##* }"
  if [[ "$code" =~ ^2 ]]; then
    ok "$label → HTTP $code in ${secs}s"
  else
    bad "$label → HTTP ${code:-000} (${url})"
  fi
}

echo "Process"
if command -v systemctl >/dev/null 2>&1 && [[ -f "/etc/systemd/system/$SERVICE.service" ]]; then
  if systemctl is-active --quiet "$SERVICE"; then
    since="$(systemctl show -p ActiveEnterTimestamp --value "$SERVICE")"
    pid="$(systemctl show -p MainPID --value "$SERVICE")"
    workers="$(pgrep -P "$pid" 2>/dev/null | wc -l | tr -d ' ')"
    ok "$SERVICE running (pid $pid, $workers workers) since $since"
  else
    bad "$SERVICE is $(systemctl is-active "$SERVICE")"
  fi
  BIND="$(systemctl cat "$SERVICE" 2>/dev/null | grep -o -- '--bind [^ ]*' | awk '{print $2}')"
elif [[ -f "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  ok "gunicorn running (pid $(cat "$PIDFILE"))"
  BIND="${HOST:-127.0.0.1}:${PORT:-8000}"
else
  bad "gunicorn not running"
  BIND="${HOST:-127.0.0.1}:${PORT:-8000}"
fi

echo "Health"
check_url "local  http://$BIND" "http://$BIND$CHECK_PATH" -H "Host: $DOMAIN"
check_url "public https://$DOMAIN" "https://$DOMAIN$CHECK_PATH"
