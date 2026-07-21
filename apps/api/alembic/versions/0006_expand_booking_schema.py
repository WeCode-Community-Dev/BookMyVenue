"""expand_booking_schema

Revision ID: 1679aa81b5b3
Revises: 0c70837a672c
Create Date: 2026-06-06 13:10:37.968362
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "1679aa81b5b3"
down_revision: Union[str, None] = "0c70837a672c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    booking_status_enum = postgresql.ENUM(
        "requested",
        "owner_accepted",
        "confirmed",
        "completed",
        "hold_expired",
        "request_expired",
        "conflict_cancelled",
        "user_cancelled",
        "admin_cancelled",
        "owner_rejected",
        "balance_overdue_cancelled",
        name="booking_status",
        create_type=False,
    )
    op.create_table(
        "booking_slots",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("booking_id", sa.UUID(), nullable=False),
        sa.Column("venue_id", sa.UUID(), nullable=False),
        sa.Column("starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ends_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("effective_starts_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("effective_ends_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_blocking", sa.Boolean(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "effective_ends_at >= ends_at",
            name="ck_booking_slots_effective_end",
        ),
        sa.CheckConstraint(
            "effective_starts_at <= starts_at",
            name="ck_booking_slots_effective_start",
        ),
        sa.CheckConstraint(
            "ends_at > starts_at",
            name="ck_booking_slots_time_order",
        ),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.ForeignKeyConstraint(["venue_id"], ["venues.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "booking_status_history",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("booking_id", sa.UUID(), nullable=False),
        sa.Column(
            "old_status",
            booking_status_enum,
            nullable=True,
        ),
        sa.Column(
            "new_status",
            booking_status_enum,
            nullable=False,
        ),
        sa.Column("changed_by", sa.UUID(), nullable=True),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column(
            "metadata",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.ForeignKeyConstraint(["changed_by"], ["profiles.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.add_column(
        "bookings",
        sa.Column("event_type", sa.Text(), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "guest_count",
            sa.Integer(),
            nullable=False,
            server_default="1",
        ),
    )

    op.add_column("bookings", sa.Column("user_notes", sa.Text(), nullable=True))
    op.add_column("bookings", sa.Column("owner_notes", sa.Text(), nullable=True))

    op.add_column(
        "bookings",
        sa.Column(
            "requested_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )

    op.add_column(
        "bookings",
        sa.Column("owner_responded_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("hold_expires_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("confirmed_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("balance_due_date", sa.Date(), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("balance_overdue_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("owner_action_deadline", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("cancelled_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("expired_at", sa.DateTime(timezone=True), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "deadline_extension_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column("pricing_mode", sa.String(), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "quoted_price_paise",
            sa.BigInteger(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "platform_commission_pct",
            sa.Numeric(5, 2),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "platform_fee_paise",
            sa.BigInteger(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "owner_payout_paise",
            sa.BigInteger(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "advance_pct",
            sa.Numeric(5, 2),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "advance_due_paise",
            sa.BigInteger(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "balance_due_paise",
            sa.BigInteger(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "overdue_advance_refund_pct",
            sa.Numeric(5, 2),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "amount_paid_paise",
            sa.BigInteger(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column(
            "refund_amount_paise",
            sa.BigInteger(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "bookings",
        sa.Column("stripe_advance_payment_intent_id", sa.Text(), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("stripe_balance_payment_intent_id", sa.Text(), nullable=True),
    )

    op.add_column(
        "bookings",
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("bookings", "deleted_at")
    op.drop_column("bookings", "stripe_balance_payment_intent_id")
    op.drop_column("bookings", "stripe_advance_payment_intent_id")
    op.drop_column("bookings", "refund_amount_paise")
    op.drop_column("bookings", "amount_paid_paise")
    op.drop_column("bookings", "overdue_advance_refund_pct")
    op.drop_column("bookings", "balance_due_paise")
    op.drop_column("bookings", "advance_due_paise")
    op.drop_column("bookings", "advance_pct")
    op.drop_column("bookings", "owner_payout_paise")
    op.drop_column("bookings", "platform_fee_paise")
    op.drop_column("bookings", "platform_commission_pct")
    op.drop_column("bookings", "quoted_price_paise")
    op.drop_column("bookings", "pricing_mode")
    op.drop_column("bookings", "deadline_extension_count")
    op.drop_column("bookings", "expired_at")
    op.drop_column("bookings", "cancelled_at")
    op.drop_column("bookings", "completed_at")
    op.drop_column("bookings", "owner_action_deadline")
    op.drop_column("bookings", "balance_overdue_at")
    op.drop_column("bookings", "balance_due_date")
    op.drop_column("bookings", "confirmed_at")
    op.drop_column("bookings", "hold_expires_at")
    op.drop_column("bookings", "owner_responded_at")
    op.drop_column("bookings", "requested_at")
    op.drop_column("bookings", "owner_notes")
    op.drop_column("bookings", "user_notes")
    op.drop_column("bookings", "guest_count")
    op.drop_column("bookings", "event_type")

    op.drop_table("booking_status_history")
    op.drop_table("booking_slots")
