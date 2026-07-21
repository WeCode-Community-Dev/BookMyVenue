import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


def generate_refund_id() -> str:
    return "rfnd_" + uuid.uuid4().hex[:12]


class Refund(Base):
    __tablename__ = "refunds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    refund_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    payment_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("payments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="refund_pending")
    gateway_refund_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    initiated_by: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        CheckConstraint("amount > 0", name="ck_refund_amount_positive"),
        CheckConstraint(
            "status IN ('refund_pending', 'refunded', 'failed')",
            name="ck_refund_status",
        ),
    )
