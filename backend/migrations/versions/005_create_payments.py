from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "005_create_payments"
down_revision: Union[str, None] = "004_create_bookings"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "payments",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("payment_id", sa.String(length=50), nullable=False),
        sa.Column("booking_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("amount", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column(
            "currency",
            sa.String(length=3),
            server_default="INR",
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.String(length=20),
            server_default="created",
            nullable=False,
        ),
        sa.Column(
            "gateway",
            sa.String(length=30),
            server_default="razorpay",
            nullable=False,
        ),
        sa.Column("failure_reason", sa.Text(), nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "status IN ('created', 'paid', 'failed', 'refunded', 'refund_pending')",
            name="ck_payment_status",
        ),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("payment_id"),
    )
    op.create_index(op.f("ix_payments_id"), "payments", ["id"], unique=False)
    op.create_index(
        op.f("ix_payments_payment_id"), "payments", ["payment_id"], unique=True
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_payments_payment_id"), table_name="payments")
    op.drop_index(op.f("ix_payments_id"), table_name="payments")
    op.drop_table("payments")
