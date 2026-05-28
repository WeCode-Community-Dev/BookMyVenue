#!/usr/bin/env bash
set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

[ -f "$REPO_ROOT/.env" ] && source "$REPO_ROOT/.env"

export GONOSUMDB="${GONOSUMDB:-bookmyvenue.com}"

docker compose -f "$REPO_ROOT/booking-service/compose.yaml" up -d

echo "Waiting for Postgres..."
until nc -z localhost 5433 2>/dev/null; do sleep 1; done

echo "Waiting for Redis..."
until nc -z localhost 6379 2>/dev/null; do sleep 1; done

cleanup() {
  kill "$AUTH_PID" "$BOOKING_PID" 2>/dev/null
  wait
}
trap cleanup SIGINT SIGTERM

cd "$REPO_ROOT/auth-service"
DATABASE_URL="${DATABASE_URL_AUTH:-postgres://postgres:secret@localhost:5432/wecode_auth?sslmode=disable}" \
JWT_SECRET="${JWT_SECRET:-secret}" \
PORT="${PORT_AUTH:-:8080}" \
go run ./cmd/main.go &
AUTH_PID=$!

cd "$REPO_ROOT/booking-service"
DATABASE_URL="${DATABASE_URL:-postgres://postgres:secret@localhost:5433/bookmyvenue_bookings?sslmode=disable}" \
REDIS_ADDR="${REDIS_ADDR:-localhost:6379}" \
JWT_SECRET="${JWT_SECRET:-secret}" \
PORT="${PORT_BOOKING:-:8081}" \
go run ./cmd/main.go &
BOOKING_PID=$!

echo "auth-service   → http://localhost:${PORT_AUTH:-8080}"
echo "booking-service → http://localhost:${PORT_BOOKING:-8081}"
echo "Press Ctrl+C to stop."

wait
