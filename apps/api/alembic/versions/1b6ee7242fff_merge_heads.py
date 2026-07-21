"""merge_heads

Revision ID: 1b6ee7242fff
Revises: 523613d60f75, da3ff47ffce8
Create Date: 2026-06-25 00:13:34.563503

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '1b6ee7242fff'
down_revision: Union[str, None] = ('523613d60f75', 'da3ff47ffce8')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
