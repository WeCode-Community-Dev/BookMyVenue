"""add payment gateway fields for razorpay

Revision ID: 012_add_payment_gateway_fields
Revises: 011_ensure_booking_idempotency
Create Date: 2026-07-21

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "012_add_payment_gateway_fields"
down_revision: Union[str, None] = "011_ensure_booking_idempotency"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("payments", sa.Column("gateway_order_id", sa.String(length=64), nullable=True))
    op.add_column("payments", sa.Column("gateway_payment_id", sa.String(length=64), nullable=True))
    op.add_column("payments", sa.Column("gateway_signature", sa.String(length=256), nullable=True))
    op.add_column("payments", sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_payments_gateway_order_id", "payments", ["gateway_order_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_payments_gateway_order_id", table_name="payments")
    op.drop_column("payments", "expires_at")
    op.drop_column("payments", "gateway_signature")
    op.drop_column("payments", "gateway_payment_id")
    op.drop_column("payments", "gateway_order_id")
