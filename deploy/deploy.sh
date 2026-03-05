#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/todoapp}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

cd "$APP_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found on server"
  exit 1
fi

echo "Deploying in: $APP_DIR"

# Pull latest images referenced by compose
docker compose -f "$COMPOSE_FILE" pull

# Update backend first (nginx can keep serving frontend/static)
docker compose -f "$COMPOSE_FILE" up -d --no-deps --remove-orphans web

echo "Running migrations..."
docker compose -f "$COMPOSE_FILE" exec -T web python manage.py migrate --noinput

echo "Collecting static..."
docker compose -f "$COMPOSE_FILE" exec -T web python manage.py collectstatic --noinput

# Update frontend next
docker compose -f "$COMPOSE_FILE" up -d --no-deps --remove-orphans frontend

# Ensure all services are up (postgres/nginx)
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

# Reload nginx without restarting container (best-effort)
docker exec nginx nginx -s reload >/dev/null 2>&1 || true

echo "Done."
