#!/usr/bin/env bash
# Restart the Django backend under gunicorn.
#   ./restart.sh            install deps, migrate, collectstatic, restart
#   ./restart.sh --quick    restart only
#   ./restart.sh --stop     stop only
# On the server, if the sahu-backend systemd service is installed, this restarts
# that service; otherwise it runs gunicorn in the background itself.
# Env overrides for the non-systemd mode: PORT (8000), HOST (127.0.0.1), WORKERS (3)
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-8000}"
HOST="${HOST:-127.0.0.1}"
WORKERS="${WORKERS:-3}"
VENV=".venv"
PIDFILE="gunicorn.pid"
LOGDIR="logs"
SERVICE="sahu-backend"

has_service() {
  command -v systemctl >/dev/null 2>&1 && [[ -f "/etc/systemd/system/$SERVICE.service" ]]
}

stop() {
  if [[ -f "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
    local pid
    pid="$(cat "$PIDFILE")"
    echo "Stopping gunicorn (pid $pid)..."
    kill -TERM "$pid"
    for _ in {1..30}; do
      kill -0 "$pid" 2>/dev/null || break
      sleep 1
    done
    if kill -0 "$pid" 2>/dev/null; then
      echo "Still running after 30s, killing."
      kill -KILL "$pid"
    fi
  else
    echo "gunicorn not running."
  fi
  rm -f "$PIDFILE"
}

if [[ "${1:-}" == "--stop" ]]; then
  if has_service; then systemctl stop "$SERVICE"; echo "Stopped $SERVICE."; else stop; fi
  exit 0
fi

if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Creating virtualenv..."
  python3 -m venv "$VENV"
fi
PY="$VENV/bin/python"

if [[ "${1:-}" != "--quick" ]]; then
  echo "Installing requirements..."
  "$PY" -m pip install -q -r requirements.txt
  echo "Running migrations..."
  "$PY" manage.py migrate --noinput
  echo "Collecting static files..."
  "$PY" manage.py collectstatic --noinput -v 0
fi

"$PY" manage.py check -v 0

if has_service; then
  echo "Restarting $SERVICE..."
  systemctl restart "$SERVICE"
  sleep 2
  if systemctl is-active --quiet "$SERVICE"; then
    echo "Running. Logs: journalctl -u $SERVICE -f"
    exit 0
  fi
  echo "$SERVICE failed to start:"
  journalctl -u "$SERVICE" -n 30 --no-pager
  exit 1
fi

stop

mkdir -p "$LOGDIR"
echo "Starting gunicorn on $HOST:$PORT with $WORKERS workers..."
"$VENV/bin/gunicorn" core.wsgi:application \
  --bind "$HOST:$PORT" \
  --workers "$WORKERS" \
  --timeout 120 \
  --daemon \
  --pid "$PIDFILE" \
  --access-logfile "$LOGDIR/access.log" \
  --error-logfile "$LOGDIR/error.log"

for _ in {1..10}; do
  if [[ -f "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
    echo "Running (pid $(cat "$PIDFILE")). Logs: $LOGDIR/error.log"
    exit 0
  fi
  sleep 1
done

echo "gunicorn failed to start. Last lines of $LOGDIR/error.log:"
tail -n 30 "$LOGDIR/error.log" 2>/dev/null || true
exit 1
