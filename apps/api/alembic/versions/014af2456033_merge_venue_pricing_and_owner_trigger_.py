"""merge venue pricing and owner trigger branches

Revision ID: 014af2456033
Revises: 0006, 1ce66f7c8bf4
Create Date: 2026-06-07 16:05:52.804469

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '014af2456033'
down_revision: Union[str, None] = ('0006', '1ce66f7c8bf4')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
