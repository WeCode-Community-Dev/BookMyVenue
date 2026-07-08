"""add_formatted_address_to_external_leads

Revision ID: a2b3c4d5e6f7
Revises: 9530e5e46835
Create Date: 2026-07-06 11:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'a2b3c4d5e6f7'
down_revision: Union[str, None] = '9530e5e46835'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('external_venue_leads', sa.Column('formatted_address', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('external_venue_leads', 'formatted_address')
