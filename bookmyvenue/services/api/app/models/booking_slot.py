from __future__ import annotations

from datetime import datetime, UTC
from sqlalchemy import Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
from .availability import Availability
from .booking import Booking


class BookingSlot(Base):

    __tablename__ = "bookingslots"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, nullable=False, autoincrement=True, index=True)
    booking_id: Mapped[int] = mapped_column(
        ForeignKey(Booking.id), nullable=False, index=True)
    availability_id: Mapped[int] = mapped_column(
        ForeignKey(Availability.id), nullable=False, index=True)

    booking = relationship("Booking", back_populates="slots")
    availability = relationship("Availability", back_populates="booking_slot")

