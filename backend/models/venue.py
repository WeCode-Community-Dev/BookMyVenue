import enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
from core.database import Base


class InventoryType(str, enum.Enum):
    CAPACITY_BASED = "capacity_based"
    ENTIRE_VENUE = "entire_venue"


class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False, index=True)
    capacity = Column(Integer, nullable=False)
    price_per_hour = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    geom = Column(Geometry(geometry_type='POINT', srid=4326), nullable=True)
    photos = Column(JSON, nullable=True)
    features = Column(JSON, nullable=True, default={})
    inventory_type = Column(String, default=InventoryType.CAPACITY_BASED.value, index=True)
    status = Column(String, default="PENDING", index=True) # PENDING, APPROVED, REJECTED
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    version = Column(Integer, default=1, nullable=False)

    owner = relationship("User", back_populates="venues")
    bookings = relationship(
        "Booking", back_populates="venue", cascade="all, delete-orphan"
    )


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        Index("idx_venue_dates", "venue_id", "status", "start_time", "end_time"),
    )

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(
        Integer, ForeignKey("venues.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status = Column(String, default="PENDING", index=True)  # PENDING, CONFIRMED, CANCELLED

    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    tickets_count = Column(Integer, default=1)

    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    venue = relationship("Venue", back_populates="bookings")
    user = relationship("User", back_populates="bookings")
