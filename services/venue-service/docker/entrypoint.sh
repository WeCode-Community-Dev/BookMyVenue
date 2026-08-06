#!/bin/sh
set -e

cd /app

alembic upgrade head

exec "$@"
