"""fix owner trigger - ensure enum values exist, revert trigger to simple form

Revision ID: 0006
Revises: 0005
Create Date: 2026-06-06

ALTER TYPE ADD VALUE cannot run inside a transaction. We commit the current
transaction, do the DDL, then start a new one. enum values from 0005 may
already exist, so we check pg_enum first and only add what's missing.
Trigger is reverted to simple form — owner role/status is set by the
POST /api/auth/register-owner backend endpoint instead.
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0006"
down_revision: Union[str, None] = "0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()

    # Check which values already exist — 0005 may have partially added them.
    result = bind.execute(sa.text("""
        SELECT enumlabel FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'profile_status'
    """))
    existing = {row[0] for row in result}

    needs_pending = "pending" not in existing
    needs_rejected = "rejected" not in existing

    if needs_pending or needs_rejected:
        # ALTER TYPE ADD VALUE must run outside a transaction.
        # Commit the Alembic-managed transaction, do the DDL, restart it.
        bind.execute(sa.text("COMMIT"))
        if needs_pending:
            bind.execute(sa.text("ALTER TYPE profile_status ADD VALUE 'pending'"))
        if needs_rejected:
            bind.execute(sa.text("ALTER TYPE profile_status ADD VALUE 'rejected'"))
        bind.execute(sa.text("BEGIN"))

    # Revert trigger to simple form — owner logic moved to backend endpoint.
    op.execute("""
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER SET search_path = public
        AS $$
        BEGIN
            INSERT INTO public.profiles (id, full_name, phone, status, created_at, updated_at)
            VALUES (
                NEW.id,
                NEW.raw_user_meta_data ->> 'full_name',
                NEW.raw_user_meta_data ->> 'phone',
                'active',
                now(),
                now()
            )
            ON CONFLICT (id) DO NOTHING;

            INSERT INTO public.user_roles (id, user_id, role, created_at)
            VALUES (gen_random_uuid(), NEW.id, 'customer', now())
            ON CONFLICT (user_id, role) DO NOTHING;

            RETURN NEW;
        END;
        $$;
    """)


def downgrade() -> None:
    op.execute("""
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER SET search_path = public
        AS $$
        DECLARE
            v_is_owner boolean;
        BEGIN
            v_is_owner := (NEW.raw_user_meta_data ->> 'is_owner')::boolean;

            INSERT INTO public.profiles (id, full_name, phone, status, created_at, updated_at)
            VALUES (
                NEW.id,
                NEW.raw_user_meta_data ->> 'full_name',
                NEW.raw_user_meta_data ->> 'phone',
                CASE WHEN v_is_owner THEN 'pending' ELSE 'active' END,
                now(),
                now()
            )
            ON CONFLICT (id) DO NOTHING;

            INSERT INTO public.user_roles (id, user_id, role, created_at)
            VALUES (gen_random_uuid(), NEW.id, 'customer', now())
            ON CONFLICT (user_id, role) DO NOTHING;

            IF v_is_owner THEN
                INSERT INTO public.user_roles (id, user_id, role, created_at)
                VALUES (gen_random_uuid(), NEW.id, 'venue_owner', now())
                ON CONFLICT (user_id, role) DO NOTHING;
            END IF;

            RETURN NEW;
        END;
        $$;
    """)
