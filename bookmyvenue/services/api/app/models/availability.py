from __future__ import annotations

from datetime import UTC, datetime
from sqlalchemy import DateTime, Integer, ForeignKey, Date, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column
import enum

from database import Base
from .venue import Venue


class StatusEnum(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class Availability(Base):
    __tablename__ = "availabilities"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, nullable=False, autoincrement=True, index=True)
    venue_id: Mapped[int] = mapped_column(
        ForeignKey(Venue.id), nullable=False, index=True)
    date: Mapped[datetime] = mapped_column(
        Date, nullable=False, default=lambda: datetime.now(UTC).date())
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))
    end_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True)
    is_booked: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False)
    status: Mapped[StatusEnum] = mapped_column(
        Enum(StatusEnum), nullable=False, default=StatusEnum.PENDING)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC))
