#!/usr/bin/env bash
set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

[ -f "$REPO_ROOT/.env" ] && source "$REPO_ROOT/.env"

AUTH_DB="${DATABASE_URL_AUTH:-postgres://postgres:secret@localhost:5432/wecode_auth?sslmode=disable}"
BOOKING_DB="${DATABASE_URL:-postgres://postgres:secret@localhost:5433/bookmyvenue_bookings?sslmode=disable}"

run() {
  local label="$1" db="$2" dir="$3"
  echo "Migrating $label..."
  for f in "$REPO_ROOT/$dir/migrations"/*.up.sql; do
    echo "  $(basename "$f")"
    psql "$db" -f "$f" -q
  done
}

run "auth-service"    "$AUTH_DB"    "auth-service"
run "booking-service" "$BOOKING_DB" "booking-service"
echo "Done."
