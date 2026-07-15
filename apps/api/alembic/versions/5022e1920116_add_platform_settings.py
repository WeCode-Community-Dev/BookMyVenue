"""add platform_settings

Revision ID: 5022e1920116
Revises: 75dfe5da9eea
Create Date: 2026-07-15 02:17:13.440072

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '5022e1920116'
down_revision: Union[str, None] = '75dfe5da9eea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # NOTE: autogenerate also proposed `op.drop_table('chat_messages')` here —
    # that table has no corresponding model in this codebase but holds real
    # columns (booking_id, sender_id, message, timestamps). Left untouched;
    # deleting it is out of scope for this migration and would be destructive.
    op.create_table('platform_settings',
    sa.Column('key', sa.String(), nullable=False),
    sa.Column('value', sa.JSON(), nullable=False),
    sa.Column('updated_by', sa.UUID(), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['updated_by'], ['profiles.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('key')
    )


def downgrade() -> None:
    op.drop_table('platform_settings')
