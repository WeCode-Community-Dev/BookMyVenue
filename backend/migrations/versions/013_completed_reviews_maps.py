"""add completed booking status, google maps url, unique review per booking

Revision ID: 013_completed_reviews_maps
Revises: 012_add_payment_gateway_fields
Create Date: 2026-07-21

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "013_completed_reviews_maps"
down_revision: Union[str, None] = "012_add_payment_gateway_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # allow completed status after check-out date passes
    op.drop_constraint("ck_booking_status", "bookings", type_="check")
    op.create_check_constraint(
        "ck_booking_status",
        "bookings",
        "status IN ('pending_payment', 'booked', 'cancelled', 'completed')",
    )

    # owner pastes Google Maps share link for customers
    op.add_column(
        "venues",
        sa.Column("google_maps_url", sa.String(length=500), nullable=True),
    )

    # one review per booking only
    op.create_unique_constraint("uq_review_booking_id", "reviews", ["booking_id"])


def downgrade() -> None:
    op.drop_constraint("uq_review_booking_id", "reviews", type_="unique")
    op.drop_column("venues", "google_maps_url")

    op.drop_constraint("ck_booking_status", "bookings", type_="check")
    op.create_check_constraint(
        "ck_booking_status",
        "bookings",
        "status IN ('pending_payment', 'booked', 'cancelled')",
    )
