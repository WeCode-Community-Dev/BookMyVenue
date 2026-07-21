"""signup trigger - auto-create profile and customer role on auth.users insert

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-02

"""
from typing import Sequence, Union
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
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

    op.execute("""
        CREATE OR REPLACE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    """)


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;")
    op.execute("DROP FUNCTION IF EXISTS public.handle_new_user();")
