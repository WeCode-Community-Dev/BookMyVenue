from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    func,
    Boolean,
)
from sqlalchemy.orm import relationship
from app.db.database import Base

class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    venue_name = Column(String(100), nullable=False)
    venue_description = Column(Text)
    location = Column(String(255), nullable=False)
    capacity = Column(Integer, nullable=False)

    is_available = Column(Boolean, nullable=False, default=False)
    not_available_reason = Column(Text, nullable=True, default="")
    is_approved = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    user = relationship("User", back_populates="venues")
    venue_amenities = relationship("VenueAmenities", back_populates="venue", cascade="all, delete-orphan")
    venue_images = relationship("VenueImages", back_populates="venue", cascade="all, delete-orphan")
    venue_availability = relationship("VenueAvailability", back_populates="venue", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="venue", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="venue", cascade="all, delete-orphan")

