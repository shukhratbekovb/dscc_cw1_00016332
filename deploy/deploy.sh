#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/opt/dscc_cw1_00016332}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

cd "$APP_DIR"

echo "Starting deploy in: $APP_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker not installed"
  exit 1
fi

echo "Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull

echo "Starting postgres..."
docker compose -f "$COMPOSE_FILE" up -d postgres

echo "Waiting for postgres to become healthy..."

for i in {1..30}; do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' postgres 2>/dev/null || echo "starting")

  if [ "$STATUS" = "healthy" ]; then
    echo "Postgres is ready"
    break
  fi

  echo "Waiting for postgres... ($i)"
  sleep 2
done

echo "Updating backend..."
docker compose -f "$COMPOSE_FILE" up -d --no-deps web

echo "Running migrations..."
docker compose -f "$COMPOSE_FILE" exec -T web python manage.py migrate --noinput

echo "Collecting static..."
docker compose -f "$COMPOSE_FILE" exec -T web python manage.py collectstatic --noinput

echo "Updating frontend..."
docker compose -f "$COMPOSE_FILE" up -d --no-deps frontend

echo "Ensuring all services running..."
docker compose -f "$COMPOSE_FILE" up -d nginx

echo "Reloading nginx..."
docker exec nginx nginx -s reload >/dev/null 2>&1 || true

echo "Cleaning unused images..."
docker image prune -f

echo "Deploy finished successfully 🚀"