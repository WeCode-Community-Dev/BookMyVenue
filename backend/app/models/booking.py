from decimal import Decimal
from datetime import date, datetime, time, timezone
from typing import Optional
from sqlalchemy import (
    Integer, String, Date, Time, Numeric, Text, DateTime,
    ForeignKey, UniqueConstraint, CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column
from app.db.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    venue_id: Mapped[int] = mapped_column(Integer, ForeignKey("venues.id", ondelete="CASCADE"), nullable=False)
    booking_date: Mapped[date] = mapped_column(Date, nullable=False)
    time_slot: Mapped[time] = mapped_column(Time, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending_payment")
    cancellation_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    owner_status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    event_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    guest_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        # one venue cannot be booked twice for the same date + time
        UniqueConstraint("venue_id", "booking_date", "time_slot", name="uq_booking_slot"),
        CheckConstraint(
            "status IN ('pending_payment', 'booked', 'cancelled')",
            name="ck_booking_status",
        ),
    )