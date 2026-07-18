from datetime import datetime, date
from enum import Enum
from uuid import uuid4

from sqlalchemy import (
    String,
    DateTime,
    Date,
    ForeignKey,
    Numeric,
    Enum as SqlEnum,
    Column,
    Table,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config.database import Base

# Association table for Booking and VenueSlot
booking_slots = Table(
    "booking_slots",
    Base.metadata,
    Column(
        "booking_id",
        UUID(as_uuid=True),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "slot_id",
        UUID(as_uuid=True),
        ForeignKey("venue_slots.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    venue_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    booking_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    status: Mapped[BookingStatus] = mapped_column(
        SqlEnum(
            BookingStatus,
            name="booking_status",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
        default=BookingStatus.PENDING,
        server_default=BookingStatus.PENDING.value,
        index=True,
    )

    amount: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    venue_amount: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0.0,
        server_default="0.0",
    )

    cleaning_fee: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0.0,
        server_default="0.0",
    )

    commission_percent: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=2.0,
        server_default="2.0",
    )

    commission_amount: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0.0,
        server_default="0.0",
    )

    security_amount: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=1000.0,
        server_default="1000.0",
    )

    lock_expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    razorpay_order_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    razorpay_payment_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    razorpay_signature: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # Relationships
    user = relationship("User")
    venue = relationship("Venue")
    slots = relationship("VenueSlot", secondary=booking_slots)
