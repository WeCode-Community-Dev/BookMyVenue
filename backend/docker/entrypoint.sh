#!/bin/sh
set -e

cd /app/core

# Only the web server runs migrations; Celery reuses this image.
if [ "$1" != "celery" ]; then
  case "${DATABASE_URL:-}" in
    postgres://*|postgresql://*)
      python manage.py shell -c "
from django.db import connection
with connection.cursor() as cursor:
    cursor.execute('CREATE EXTENSION IF NOT EXISTS postgis')
"
      ;;
  esac
  python manage.py migrate --noinput
fi

exec "$@"
