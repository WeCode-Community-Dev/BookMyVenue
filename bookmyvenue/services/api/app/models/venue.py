from __future__ import annotations

from datetime import UTC, datetime
from sqlalchemy import DateTime, Integer, String, ForeignKey, Boolean, Float, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base
from .user import User
from .venue_category import VenueCategory
import enum




class StatusEnum(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, index=True)
    owner_id: Mapped[int] = mapped_column(
        ForeignKey(User.id), nullable=False, index=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey(VenueCategory.id), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    address_line: Mapped[str] = mapped_column(String, nullable=False)
    city: Mapped[str] = mapped_column(String, nullable=False)
    pincode: Mapped[str] = mapped_column(String, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    supports_hourly: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False)
    supports_daily: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False)
    hourly_price: Mapped[float] = mapped_column(Float, nullable=True)
    daily_price: Mapped[float] = mapped_column(Float, nullable=True)
    amenities: Mapped[str] = mapped_column(String(500), nullable=True)
    cancellation_policy: Mapped[str | None] = mapped_column(
        String(1000), nullable=True)
    status: Mapped[StatusEnum] = mapped_column(
        Enum(StatusEnum), nullable=False, default=StatusEnum.ACTIVE)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC))

    owner = relationship("User", back_populates="venues")
    category = relationship("VenueCategory", back_populates="venues")
    images = relationship("VenueImage", back_populates="venue")
