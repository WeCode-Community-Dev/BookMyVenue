"""add booking check-in/check-out columns

Revision ID: 010_add_booking_checkin_checkout
Revises: 009_merge_branches, 0458cf9b08b6
Create Date: 2026-07-21

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "010_add_booking_checkin_checkout"
down_revision: Union[str, tuple[str, ...], None] = (
    "009_merge_branches",
    "0458cf9b08b6",
)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {col["name"] for col in inspector.get_columns("bookings")}

    if "idempotency_key" not in columns:
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
        constraints = {c["name"] for c in inspector.get_unique_constraints("bookings")}
        if "uq_booking_user_idempotency" not in constraints:
            op.create_unique_constraint(
                "uq_booking_user_idempotency",
                "bookings",
                ["user_id", "idempotency_key"],
            )

    op.add_column("bookings", sa.Column("check_in_date", sa.Date(), nullable=True))
    op.add_column("bookings", sa.Column("check_in_time", sa.Time(), nullable=True))
    op.add_column("bookings", sa.Column("check_out_date", sa.Date(), nullable=True))
    op.add_column("bookings", sa.Column("check_out_time", sa.Time(), nullable=True))
    op.add_column("bookings", sa.Column("num_days", sa.Integer(), nullable=True))

    op.execute(
        """
        UPDATE bookings
        SET check_in_date = booking_date,
            check_out_date = booking_date,
            check_in_time = time_slot,
            check_out_time = '23:59:59'::time,
            num_days = 1
        """
    )

    op.alter_column("bookings", "check_in_date", nullable=False)
    op.alter_column("bookings", "check_in_time", nullable=False)
    op.alter_column("bookings", "check_out_date", nullable=False)
    op.alter_column("bookings", "check_out_time", nullable=False)
    op.alter_column("bookings", "num_days", nullable=False)

    op.drop_constraint("uq_booking_slot", "bookings", type_="unique")


def downgrade() -> None:
    op.create_unique_constraint(
        "uq_booking_slot",
        "bookings",
        ["venue_id", "booking_date", "time_slot"],
    )
    op.drop_column("bookings", "num_days")
    op.drop_column("bookings", "check_out_time")
    op.drop_column("bookings", "check_out_date")
    op.drop_column("bookings", "check_in_time")
    op.drop_column("bookings", "check_in_date")
