from decimal import Decimal
from datetime import date, datetime, time, timezone
from typing import Optional
from sqlalchemy import (
    Integer, String, Date, Time, Numeric, Text, DateTime,
    ForeignKey, UniqueConstraint, CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
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

    # describes the event itself, shown on the owner's dashboard
    event_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    guest_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # tracks payment lifecycle only
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending_payment")

    # tracks whether the venue owner has accepted/rejected this request
    owner_status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")

    cancellation_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Check-in / check-out ──────────────────────────────────────────────────
    check_in_date: Mapped[date] = mapped_column(Date, nullable=False)
    check_in_time: Mapped[time] = mapped_column(Time, nullable=False)
    check_out_date: Mapped[date] = mapped_column(Date, nullable=False)
    check_out_time: Mapped[time] = mapped_column(Time, nullable=False)
    num_days: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    # ── Check-in token (for QR / link based check-in) ────────────────────────
    check_in_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    checked_in_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    idempotency_key: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)

    venue = relationship("Venue")
    user = relationship("User")

    __table_args__ = (
        UniqueConstraint("user_id", "idempotency_key", name="uq_booking_user_idempotency"),
        CheckConstraint(
            "status IN ('pending_payment', 'booked', 'cancelled')",
            name="ck_booking_status",
        ),
        CheckConstraint(
            "owner_status IN ('pending', 'accepted', 'rejected')",
            name="ck_booking_owner_status",
        ),
    )