"""merge_heads

Revision ID: 7730c1497963
Revises: 009_merge_branches, 0458cf9b08b6
Create Date: 2026-07-24 10:31:23.764968

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7730c1497963'
down_revision: Union[str, None] = ('009_merge_branches', '0458cf9b08b6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
