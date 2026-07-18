#!/usr/bin/env bash
# Run the full local quality gate: API (ruff, alembic, pytest) then frontend (lint, typecheck, build).
#
# Usage (from repo root):
#   ./scripts/check-all.sh
#   ./scripts/check-all.sh --skip-migrations
#   ./scripts/check-all.sh --skip-frontend
#   ./scripts/check-all.sh --skip-api
set -euo pipefail

SKIP_MIGRATIONS=0
SKIP_FRONTEND=0
SKIP_API=0

for arg in "$@"; do
  case "$arg" in
    --skip-migrations) SKIP_MIGRATIONS=1 ;;
    --skip-frontend) SKIP_FRONTEND=1 ;;
    --skip-api) SKIP_API=1 ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_DIR="$ROOT/apps/api"

step() {
  echo ""
  echo "==> $*"
}

if [[ "$SKIP_API" -eq 0 ]]; then
  if [[ ! -f "$API_DIR/.venv/Scripts/activate" && ! -f "$API_DIR/.venv/bin/activate" ]]; then
    echo "API venv not found under $API_DIR/.venv" >&2
    echo "Create it with: cd apps/api && uv sync --all-extras" >&2
    exit 1
  fi

  cd "$API_DIR"
  # Windows Git Bash uses Scripts/; Unix uses bin/
  if [[ -f .venv/Scripts/activate ]]; then
    # shellcheck disable=SC1091
    source .venv/Scripts/activate
  else
    # shellcheck disable=SC1091
    source .venv/bin/activate
  fi

  step "ruff check ."
  ruff check .

  step "ruff check . --fix"
  ruff check . --fix

  step "ruff format ."
  ruff format .

  step "ruff format . --check"
  ruff format . --check

  if [[ "$SKIP_MIGRATIONS" -eq 0 ]]; then
    step "alembic upgrade head"
    alembic upgrade head
  else
    step "Skipping alembic upgrade head"
  fi

  step "pytest"
  pytest
fi

if [[ "$SKIP_FRONTEND" -eq 0 ]]; then
  cd "$ROOT"

  step "pnpm lint"
  pnpm lint

  step "pnpm typecheck"
  pnpm typecheck

  step "pnpm build"
  pnpm build
fi

echo ""
echo "All checks passed."
