from __future__ import annotations

from datetime import datetime, UTC
from sqlalchemy import DateTime, Integer, String, ForeignKey, Float, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum

from database import Base
from .user import User
from .venue import Venue


class BookingTypeEnum(str, Enum):
    HOURLY = "hourly"
    DAILY = "daily"


class BookingStatusEnum(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class PaymentEnum(str, Enum):
    UNPAID = "unpaid"
    PAID = "paid"


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True)
    venue_id: Mapped[int] = mapped_column(
        ForeignKey(Venue.id), nullable=False, index=True)
    booker_id: Mapped[int] = mapped_column(
        ForeignKey(User.id), nullable=False, index=True)
    booking_type: Mapped[BookingTypeEnum] = mapped_column(
        SqlEnum(BookingTypeEnum), nullable=False, default=None
    )
    base_price: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    tax_amount: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    platform_fee: Mapped[float] = mapped_column(
        Float, nullable=False, default=0)
    total_amount: Mapped[float] = mapped_column(
        Float, nullable=False, default=0)
    status: Mapped[BookingStatusEnum] = mapped_column(
        SqlEnum(BookingStatusEnum), nullable=False, default=BookingStatusEnum.PENDING)
    payment_status: Mapped[PaymentEnum] = mapped_column(
        SqlEnum(PaymentEnum), nullable=False, default=PaymentEnum.UNPAID)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC))

    venue = relationship("Venue", back_populates="bookings")
    booker = relationship("User", back_populates="bookings")
    slots = relationship("BookingSlot", back_populates="booking")
