from __future__ import annotations

from datetime import UTC, datetime, time
from sqlalchemy import DateTime, Integer, ForeignKey, Date, Time, Boolean, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum

from models.booking import BookingTypeEnum

from database import Base
from .venue import Venue


class Availability(Base):
    __tablename__ = "availabilities"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, nullable=False, autoincrement=True, index=True)
    venue_id: Mapped[int] = mapped_column(
        ForeignKey(Venue.id), nullable=False, index=True)
    date: Mapped[datetime] = mapped_column(
        Date, nullable=False, default=lambda: datetime.now(UTC).date())
    start_time: Mapped[time | None] = mapped_column(
        Time, nullable=False, default=lambda: datetime.now(UTC))
    end_time: Mapped[time | None] = mapped_column(
        Time, nullable=True)
    booking_type: Mapped[BookingTypeEnum] = mapped_column(
        SqlEnum(BookingTypeEnum), nullable=False)
    is_booked: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False)

    venue = relationship("Venue", back_populates="availabilities")
    booking_slot = relationship("BookingSlot", back_populates="availability")
