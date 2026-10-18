#!/usr/bin/env bash
# Show backend logs.
#   ./logs.sh          follow live (Ctrl+C to stop)
#   ./logs.sh 200      print the last 200 lines and exit
#   ./logs.sh errors   follow, only errors / tracebacks
set -euo pipefail

cd "$(dirname "$0")"

SERVICE="sahu-backend"
ARG="${1:-}"

if command -v journalctl >/dev/null 2>&1 && [[ -f "/etc/systemd/system/$SERVICE.service" ]]; then
  case "$ARG" in
    "")      exec journalctl -u "$SERVICE" -n 50 -f --no-hostname -o short-iso ;;
    errors)  exec journalctl -u "$SERVICE" -n 50 -f --no-hostname -o short-iso \
               --grep 'error|exception|traceback|critical| 5[0-9]{2} ' --case-sensitive=false ;;
    *)       exec journalctl -u "$SERVICE" -n "$ARG" --no-pager --no-hostname -o short-iso ;;
  esac
fi

# Not under systemd: gunicorn was started by restart.sh and logs to logs/
FILES=(logs/error.log logs/access.log)
case "$ARG" in
  "")      exec tail -n 50 -F "${FILES[@]}" ;;
  errors)  exec tail -n 50 -F logs/error.log ;;
  *)       exec tail -n "$ARG" "${FILES[@]}" ;;
esac
