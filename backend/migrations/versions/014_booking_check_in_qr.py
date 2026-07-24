"""add booking check-in qr token fields

Revision ID: 014_booking_check_in_qr
Revises: 013_completed_reviews_maps
Create Date: 2026-07-21

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "014_booking_check_in_qr"
down_revision: Union[str, None] = "013_completed_reviews_maps"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("bookings", sa.Column("check_in_token", sa.String(length=64), nullable=True))
    op.add_column("bookings", sa.Column("checked_in_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_bookings_check_in_token", "bookings", ["check_in_token"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_bookings_check_in_token", table_name="bookings")
    op.drop_column("bookings", "checked_in_at")
    op.drop_column("bookings", "check_in_token")
