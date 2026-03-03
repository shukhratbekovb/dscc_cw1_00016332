#!/bin/sh

echo "Waiting for database..."

while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 1
done

echo "Database started"

echo "Applying migrations..."
python manage.py migrate --noinput

echo "Starting server..."
exec "$@"