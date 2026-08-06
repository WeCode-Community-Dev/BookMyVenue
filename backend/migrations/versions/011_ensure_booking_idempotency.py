"""ensure booking idempotency key on all branches

Revision ID: 011_ensure_booking_idempotency
Revises: 010_add_booking_checkin_checkout
Create Date: 2026-07-21

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "011_ensure_booking_idempotency"
down_revision: Union[str, None] = "010_add_booking_checkin_checkout"
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

    indexes = {idx["name"] for idx in inspector.get_indexes("bookings")}
    if "ix_bookings_idempotency_key" not in indexes:
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


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    columns = {col["name"] for col in inspector.get_columns("bookings")}

    if "idempotency_key" in columns:
        constraints = {c["name"] for c in inspector.get_unique_constraints("bookings")}
        if "uq_booking_user_idempotency" in constraints:
            op.drop_constraint("uq_booking_user_idempotency", "bookings", type_="unique")

        indexes = {idx["name"] for idx in inspector.get_indexes("bookings")}
        if "ix_bookings_idempotency_key" in indexes:
            op.drop_index("ix_bookings_idempotency_key", table_name="bookings")

        op.drop_column("bookings", "idempotency_key")
