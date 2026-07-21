"""restore booking_mode default

Revision ID: 2088da544ef2
Revises: 75699ec24359
Create Date: 2026-07-07 23:06:32.632259

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '2088da544ef2'
down_revision: Union[str, None] = '75699ec24359'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # A prior migration (75699ec24359) changed venues.booking_mode from an
    # enum to text but dropped its DEFAULT 'MANUAL' in the process — Alembic's
    # autogenerate doesn't reliably diff server_default, so this is manual.
    op.alter_column('venues', 'booking_mode', server_default='MANUAL')


def downgrade() -> None:
    op.alter_column('venues', 'booking_mode', server_default=None)
