"""rename_venues_base_price_paise

Revision ID: 75dfe5da9eea
Revises: eb87b53b5d01
Create Date: 2026-07-11 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op


revision: str = '75dfe5da9eea'
down_revision: Union[str, None] = 'eb87b53b5d01'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # The ORM model was renamed (base_price_paise -> starting_price_paise) at
    # some point without a matching migration ever being committed. Production
    # already has the column renamed (done manually, outside Alembic), but a
    # fresh CI/local database built from this migration chain never did — so
    # every query touching Venue.starting_price_paise there fails with
    # "column does not exist". Guarded so it's a no-op against production
    # (and safe to re-run anywhere): only rename if the old name still exists
    # and the new one doesn't. Postgres updates ck_venues_base_price's
    # definition automatically on column rename, no separate action needed.
    op.execute("""
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'venues' AND column_name = 'base_price_paise'
            ) AND NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'venues' AND column_name = 'starting_price_paise'
            ) THEN
                ALTER TABLE venues RENAME COLUMN base_price_paise TO starting_price_paise;
            END IF;
        END $$;
    """)


def downgrade() -> None:
    # Never rename back on a real (already-correct) database; only reverses
    # what upgrade() actually did (i.e. a no-op against production).
    op.execute("""
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'venues' AND column_name = 'starting_price_paise'
            ) AND NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_name = 'venues' AND column_name = 'base_price_paise'
            ) THEN
                ALTER TABLE venues RENAME COLUMN starting_price_paise TO base_price_paise;
            END IF;
        END $$;
    """)
