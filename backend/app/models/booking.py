from sqlalchemy import (
    Column, Integer, String, Date, Time, Numeric, Text, DateTime,
    ForeignKey, UniqueConstraint, CheckConstraint,
)
from datetime import datetime, timezone
from app.db.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    venue_id = Column(Integer, ForeignKey("venues.id", ondelete="CASCADE"), nullable=False)
    booking_date = Column(Date, nullable=False)
    time_slot = Column(Time, nullable=False)
    notes = Column(Text, nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), nullable=False, default="pending_payment")
    cancellation_reason = Column(Text, nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
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