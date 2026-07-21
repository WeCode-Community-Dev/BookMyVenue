"""merge_deep_research_branches

Revision ID: d1e2f3a4b5c6
Revises: b3c4d5e6f7a8, c7ff94364ee8
Create Date: 2026-07-06 12:54:00.000000

"""
from typing import Sequence, Union
from alembic import op


revision: str = 'd1e2f3a4b5c6'
down_revision: Union[str, Sequence[str], None] = ('b3c4d5e6f7a8', 'c7ff94364ee8')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass  # Merge only — no schema changes


def downgrade() -> None:
    pass
