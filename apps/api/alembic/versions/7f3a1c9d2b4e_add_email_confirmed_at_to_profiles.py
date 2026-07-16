"""add email_confirmed_at to profiles

Revision ID: 7f3a1c9d2b4e
Revises: 5022e1920116
Create Date: 2026-07-15 12:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = '7f3a1c9d2b4e'
down_revision: Union[str, None] = '5022e1920116'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Real Supabase (and a local `supabase start` instance) already has this
    # column, and its auth.users table is owned by supabase_auth_admin — this
    # app's migrating role has no ALTER privilege on it there, so the ALTER
    # below must never even be attempted in that case. Only the bare-bones
    # local/CI stub (1de56a630d60), which this app's own role created and
    # owns, is missing the column and needs it added.
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'auth' AND table_name = 'users'
                AND column_name = 'email_confirmed_at'
            ) THEN
                ALTER TABLE auth.users ADD COLUMN email_confirmed_at TIMESTAMPTZ;
            END IF;
        END $$;
    """)

    op.add_column(
        "profiles",
        sa.Column("email_confirmed_at", sa.DateTime(timezone=True), nullable=True),
    )

    # Grandfather every account that already exists: accounts created before
    # this backend check shipped never had a confirmation link to click if
    # Supabase's "Confirm email" setting was off at signup time. Prefer the
    # real auth.users value when Supabase does have it (i.e. they already
    # confirmed), otherwise stamp them confirmed as of their own created_at
    # so existing users aren't locked out by a check that didn't exist yet.
    op.execute("""
        UPDATE profiles p
        SET email_confirmed_at = COALESCE(au.email_confirmed_at, p.created_at)
        FROM auth.users au
        WHERE au.id = p.id AND p.email_confirmed_at IS NULL;
    """)

    # New signups from here on get the real (possibly NULL) value — no
    # grandfathering for accounts created after this point.
    op.execute("""
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER SET search_path = public
        AS $$
        BEGIN
            INSERT INTO public.profiles (id, full_name, phone, status, email_confirmed_at, created_at, updated_at)
            VALUES (
                NEW.id,
                NEW.raw_user_meta_data ->> 'full_name',
                NEW.raw_user_meta_data ->> 'phone',
                'active',
                NEW.email_confirmed_at,
                now(),
                now()
            )
            ON CONFLICT (id) DO NOTHING;

            INSERT INTO public.user_roles (id, user_id, role, created_at)
            VALUES (
                gen_random_uuid(),
                NEW.id,
                'customer',
                now()
            )
            ON CONFLICT (user_id, role) DO NOTHING;

            RETURN NEW;
        END;
        $$;
    """)

    # Keeps profiles.email_confirmed_at in sync when Supabase marks the
    # account confirmed (user clicks the link in the confirmation email).
    op.execute("""
        CREATE OR REPLACE FUNCTION public.handle_user_confirmed()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER SET search_path = public
        AS $$
        BEGIN
            UPDATE public.profiles
            SET email_confirmed_at = NEW.email_confirmed_at
            WHERE id = NEW.id;
            RETURN NEW;
        END;
        $$;
    """)

    op.execute("""
        CREATE OR REPLACE TRIGGER on_auth_user_confirmed
            AFTER UPDATE OF email_confirmed_at ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_user_confirmed();
    """)


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;")
    op.execute("DROP FUNCTION IF EXISTS public.handle_user_confirmed();")

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
            VALUES (
                gen_random_uuid(),
                NEW.id,
                'customer',
                now()
            )
            ON CONFLICT (user_id, role) DO NOTHING;

            RETURN NEW;
        END;
        $$;
    """)

    op.drop_column("profiles", "email_confirmed_at")
