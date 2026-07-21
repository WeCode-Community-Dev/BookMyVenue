"""ci_local_auth_users_stub

Revision ID: 1de56a630d60
Revises:
Create Date: 2026-07-11 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op


revision: str = '1de56a630d60'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Real Supabase projects auto-provision `auth.users` — this app's
    # migrations (starting with 0001) assume it already exists and only
    # add a FK + a signup trigger on top of it. A plain local/CI Postgres
    # has no such table, so `alembic upgrade head` fails at 0001 before
    # ever reaching app migrations. This stub creates just enough of
    # `auth.users` for those migrations to succeed (id + the JSON column
    # the signup trigger reads). Guarded with IF NOT EXISTS so it's a
    # no-op against a real Supabase database, which already has the
    # real, fuller table.
    op.execute("CREATE SCHEMA IF NOT EXISTS auth;")
    op.execute("""
        CREATE TABLE IF NOT EXISTS auth.users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR,
            raw_user_meta_data JSONB NOT NULL DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
    """)


def downgrade() -> None:
    # Never drop auth.users on downgrade — against real Supabase this
    # would destroy the actual auth table, and downgrading the stub
    # locally is harmless to leave in place.
    pass
