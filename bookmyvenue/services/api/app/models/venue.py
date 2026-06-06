from __future__ import annotations

from datetime import UTC, datetime
from sqlalchemy import DateTime, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .user import User
from enum import Enum

from database import Base


class StatusEnum(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey(User.id), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    price_per_hour: Mapped[int] = mapped_column(Integer, nullable=False)
    amenities: Mapped[str] = mapped_column(String(500), nullable=True)
    status: Mapped[StatusEnum] = mapped_column(
        String(20), nullable=False, default=StatusEnum.ACTIVE)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC))
