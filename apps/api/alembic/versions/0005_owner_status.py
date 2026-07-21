"""owner status - add pending/rejected to profile_status enum, update signup trigger for is_owner

Revision ID: 0005
Revises: 0004
Create Date: 2026-06-06

"""
from typing import Sequence, Union
from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "9170dab48e33"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ALTER TYPE ADD VALUE cannot run inside a transaction in PostgreSQL
    op.execute("COMMIT")
    op.execute("ALTER TYPE profile_status ADD VALUE IF NOT EXISTS 'pending'")
    op.execute("ALTER TYPE profile_status ADD VALUE IF NOT EXISTS 'rejected'")

    # Update signup trigger: if is_owner=true in metadata, assign venue_owner role
    # and set status=pending; otherwise behave as before (customer + active)
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


def downgrade() -> None:
    # Restore original trigger (no is_owner handling)
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
    # Note: removing enum values in PostgreSQL requires a full type rebuild;
    # downgrade leaves 'pending' and 'rejected' in the enum to avoid data loss.
