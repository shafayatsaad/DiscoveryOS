#!/bin/sh
set -eu

mkdir -p "${DISCOVERYOS_LOG_DIR:-/app/logs}" /app/storage
touch \
  "${DISCOVERYOS_LOG_DIR:-/app/logs}/planner.log" \
  "${DISCOVERYOS_LOG_DIR:-/app/logs}/retriever.log" \
  "${DISCOVERYOS_LOG_DIR:-/app/logs}/orchestrator.log" \
  "${DISCOVERYOS_LOG_DIR:-/app/logs}/mcp.log" \
  "${DISCOVERYOS_LOG_DIR:-/app/logs}/openai.log"

python - <<'PY'
import os
import socket
import time
from urllib.parse import urlparse


def wait_for_url(name: str, url: str | None) -> None:
    if not url:
        return
    parsed = urlparse(url)
    host = parsed.hostname
    port = parsed.port
    if not host or not port:
        return
    deadline = time.time() + 60
    while time.time() < deadline:
        try:
            with socket.create_connection((host, port), timeout=2):
                print(f"{name} is reachable at {host}:{port}")
                return
        except OSError:
            time.sleep(1)
    raise SystemExit(f"Timed out waiting for {name} at {host}:{port}")


wait_for_url("database", os.getenv("DISCOVERYOS_DATABASE_URL"))
wait_for_url("redis", os.getenv("DISCOVERYOS_REDIS_URL"))
PY

alembic upgrade head

if [ "${DISCOVERYOS_SEED_DEMO:-false}" = "true" ]; then
  python /app/scripts/seed_demo.py
fi

exec "$@"
