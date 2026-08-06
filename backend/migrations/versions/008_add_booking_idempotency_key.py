"""add booking idempotency key

Revision ID: 008_add_booking_idempotency
Revises: 578c5c4483ac
Create Date: 2026-07-08

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "008_add_booking_idempotency"
down_revision: Union[str, None] = "007_create_owner_profiles"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "bookings",
        sa.Column("idempotency_key", sa.String(length=128), nullable=True),
    )
    op.create_index(
        "ix_bookings_idempotency_key",
        "bookings",
        ["idempotency_key"],
        unique=False,
    )
    op.create_unique_constraint(
        "uq_booking_user_idempotency",
        "bookings",
        ["user_id", "idempotency_key"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_booking_user_idempotency", "bookings", type_="unique")
    op.drop_index("ix_bookings_idempotency_key", table_name="bookings")
    op.drop_column("bookings", "idempotency_key")
