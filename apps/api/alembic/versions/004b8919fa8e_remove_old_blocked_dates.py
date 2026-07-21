"""remove_old_blocked_dates

Revision ID: 004b8919fa8e
Revises: 1b6ee7242fff
Create Date: 2026-06-25 00:13:58.128310

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '004b8919fa8e'
down_revision: Union[str, None] = '1b6ee7242fff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table('blocked_dates')


def downgrade() -> None:
    op.create_table(
        'blocked_dates',
        sa.Column('id', sa.UUID(), primary_key=True),
        sa.Column('venue_id', sa.UUID(), sa.ForeignKey('venues.id', ondelete='CASCADE'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now())
    )
