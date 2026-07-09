"""merge heads

Revision ID: 511aedccb502
Revises: bf4731fd3ac6, d5464ac6f73e
Create Date: 2026-07-07 17:23:05.391334

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '511aedccb502'
down_revision: Union[str, None] = ('bf4731fd3ac6', 'd5464ac6f73e')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
