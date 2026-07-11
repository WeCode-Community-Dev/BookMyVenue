"""add_missing_fk_indexes

Revision ID: eb87b53b5d01
Revises: dfe745817ac5
Create Date: 2026-07-10 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'eb87b53b5d01'
down_revision: Union[str, None] = 'dfe745817ac5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Postgres does not auto-index foreign key columns. These are the exact
    # columns filtered/joined on by every owner/admin dashboard and booking
    # listing, so missing indexes here mean full table scans on every request.
    op.create_index('idx_bookings_venue_id', 'bookings', ['venue_id'])
    op.create_index('idx_bookings_user_id', 'bookings', ['user_id'])
    op.create_index('idx_venues_owner_id', 'venues', ['owner_id'])


def downgrade() -> None:
    op.drop_index('idx_venues_owner_id', table_name='venues')
    op.drop_index('idx_bookings_user_id', table_name='bookings')
    op.drop_index('idx_bookings_venue_id', table_name='bookings')
