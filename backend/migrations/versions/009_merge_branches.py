"""merge migration branches

Revision ID: 009_merge_branches
Revises: 008_add_booking_idempotency, 578c5c4483ac
Create Date: 2026-07-08

"""
from typing import Sequence, Union

from alembic import op

revision: str = "009_merge_branches"
down_revision: Union[str, tuple[str, ...], None] = (
    "008_add_booking_idempotency",
    "578c5c4483ac",
)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
