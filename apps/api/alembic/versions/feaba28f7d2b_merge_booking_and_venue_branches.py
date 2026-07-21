"""Merge booking and venue branches - no schema changes needed

Revision ID: feaba28f7d2b
Revises: 1679aa81b5b3, 014af2456033
Create Date: 2026-06-08 23:22:56.136502

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'feaba28f7d2b'
down_revision: Union[str, None] = ('1679aa81b5b3', '014af2456033')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
