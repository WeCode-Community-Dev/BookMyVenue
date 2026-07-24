"""payment options: advance and pay-at-venue

Revision ID: 016_payment_options
Revises: 015_venue_cancellation_policy
Create Date: 2026-07-25

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect

revision: str = "016_payment_options"
down_revision: Union[str, None] = "015_venue_cancellation_policy"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    venue_cols = {c["name"] for c in inspect(bind).get_columns("venues")}
    booking_cols = {c["name"] for c in inspect(bind).get_columns("bookings")}
    payment_cols = {c["name"] for c in inspect(bind).get_columns("payments")}

    if "advance_percent" not in venue_cols:
        op.add_column(
            "venues",
            sa.Column("advance_percent", sa.Integer(), nullable=False, server_default="30"),
        )
    if "allow_pay_at_venue" not in venue_cols:
        op.add_column(
            "venues",
            sa.Column("allow_pay_at_venue", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        )

    if "payment_option" not in booking_cols:
        op.add_column(
            "bookings",
            sa.Column("payment_option", sa.String(length=20), nullable=True),
        )
    if "amount_paid" not in booking_cols:
        op.add_column(
            "bookings",
            sa.Column(
                "amount_paid",
                sa.Numeric(precision=10, scale=2),
                nullable=False,
                server_default="0",
            ),
        )
    if "balance_due" not in booking_cols:
        op.add_column(
            "bookings",
            sa.Column("balance_due", sa.Numeric(precision=10, scale=2), nullable=True),
        )
        op.execute("UPDATE bookings SET balance_due = amount WHERE balance_due IS NULL")
        op.alter_column(
            "bookings",
            "balance_due",
            existing_type=sa.Numeric(precision=10, scale=2),
            nullable=False,
        )

    op.execute(
        """
        DO $$ BEGIN
            ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ck_booking_payment_option;
            ALTER TABLE bookings ADD CONSTRAINT ck_booking_payment_option
                CHECK (
                    payment_option IS NULL
                    OR payment_option IN ('full', 'advance', 'pay_at_venue')
                );
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
        """
    )

    if "payment_type" not in payment_cols:
        op.add_column(
            "payments",
            sa.Column(
                "payment_type",
                sa.String(length=20),
                nullable=False,
                server_default="full",
            ),
        )

    op.execute(
        """
        DO $$ BEGIN
            ALTER TABLE payments DROP CONSTRAINT IF EXISTS ck_payment_type;
            ALTER TABLE payments ADD CONSTRAINT ck_payment_type
                CHECK (payment_type IN ('full', 'advance', 'balance', 'pay_at_venue'));
        EXCEPTION WHEN duplicate_object THEN NULL;
        END $$;
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE payments DROP CONSTRAINT IF EXISTS ck_payment_type")
    op.drop_column("payments", "payment_type")

    op.execute("ALTER TABLE bookings DROP CONSTRAINT IF EXISTS ck_booking_payment_option")
    op.drop_column("bookings", "balance_due")
    op.drop_column("bookings", "amount_paid")
    op.drop_column("bookings", "payment_option")

    op.drop_column("venues", "allow_pay_at_venue")
    op.drop_column("venues", "advance_percent")
