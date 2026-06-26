from __future__ import annotations

from datetime import datetime, UTC
from sqlalchemy import DateTime, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from database import Base
from .user import User
from .venue import Venue
from .availability import Availability



class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True)
    venu_id: Mapped[int] = mapped_column(
        ForeignKey(Venue.id), nullable=False, index=True)
    booker_id: Mapped[int] = mapped_column(
        ForeignKey(User.id), nullable=False, index=True)
    availability_id: Mapped[int] = mapped_column(
        ForeignKey(Availability.id), nullable=False, index=True)
