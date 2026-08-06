"""venue cancellation policy and refunds table

Revision ID: 015_venue_cancellation_policy
Revises: 014_booking_check_in_qr
Create Date: 2026-07-22

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect

revision: str = "015_venue_cancellation_policy"
down_revision: Union[str, None] = "014_booking_check_in_qr"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    venue_columns = {column["name"] for column in inspect(bind).get_columns("venues")}

    if "refund_50_days_before" not in venue_columns:
        op.add_column(
            "venues",
            sa.Column("refund_50_days_before", sa.Integer(), nullable=True),
        )
    if "refund_25_days_before" not in venue_columns:
        op.add_column(
            "venues",
            sa.Column("refund_25_days_before", sa.Integer(), nullable=True),
        )
    if "cancel_cutoff_days_before" not in venue_columns:
        op.add_column(
            "venues",
            sa.Column("cancel_cutoff_days_before", sa.Integer(), nullable=True),
        )

    if not inspect(bind).has_table("refunds"):
        op.create_table(
            "refunds",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("refund_id", sa.String(length=50), nullable=False),
            sa.Column("payment_id", sa.Integer(), nullable=False),
            sa.Column("amount", sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column("reason", sa.Text(), nullable=False),
            sa.Column("status", sa.String(length=20), nullable=False, server_default="refund_pending"),
            sa.Column("gateway_refund_id", sa.String(length=100), nullable=True),
            sa.Column("initiated_by", sa.Integer(), nullable=True),
            sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
            sa.CheckConstraint("amount > 0", name="ck_refund_amount_positive"),
            sa.CheckConstraint(
                "status IN ('refund_pending', 'refunded', 'failed')",
                name="ck_refund_status",
            ),
            sa.ForeignKeyConstraint(["payment_id"], ["payments.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["initiated_by"], ["users.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_refunds_refund_id", "refunds", ["refund_id"], unique=True)
        op.create_index("ix_refunds_payment_id", "refunds", ["payment_id"])


def downgrade() -> None:
    op.drop_index("ix_refunds_payment_id", table_name="refunds")
    op.drop_index("ix_refunds_refund_id", table_name="refunds")
    op.drop_table("refunds")
    op.drop_column("venues", "cancel_cutoff_days_before")
    op.drop_column("venues", "refund_25_days_before")
    op.drop_column("venues", "refund_50_days_before")
