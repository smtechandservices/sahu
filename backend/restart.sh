#!/usr/bin/env bash
# Restart the Django backend under gunicorn.
#   ./restart.sh            install deps, migrate, collectstatic, restart
#   ./restart.sh --quick    restart only
#   ./restart.sh --stop     stop only
# Env overrides: PORT (8000), HOST (127.0.0.1), WORKERS (3)
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-8000}"
HOST="${HOST:-127.0.0.1}"
WORKERS="${WORKERS:-3}"
VENV=".venv"
PIDFILE="gunicorn.pid"
LOGDIR="logs"

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
  stop
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

"$PY" manage.py check --deploy --fail-level ERROR -v 0 >/dev/null

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
