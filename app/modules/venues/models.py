from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    String,
    Text,
    DateTime,
    ForeignKey,
    Boolean,
    Numeric,
    func
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.db.base import Base


# venue 
class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    location: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    price_per_day: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    is_approved: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

    # Relationships
    owner = relationship(
        "User",
        back_populates="venues"
    )

    images = relationship(
        "VenueImage",
        back_populates="venue",
        cascade="all, delete-orphan"
    )

    amenities = relationship(
        "VenueAmenity",
        back_populates="venue",
        cascade="all, delete-orphan"
    )


# Venue Images
class VenueImage(Base):
    __tablename__ = "venue_images"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    venue_id: Mapped[int] = mapped_column(
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False
    )

    image_url: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    venue = relationship(
        "Venue",
        back_populates="images"
    )

# Amenities
class Amenity(Base):
    __tablename__ = "amenities"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    venues = relationship(
        "VenueAmenity",
        back_populates="amenity",
        cascade="all, delete-orphan"
    )


# Venue Amenities this is the table for adding the id of venues and amenty for better retrival 
class VenueAmenity(Base):
    __tablename__ = "venue_amenities"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    venue_id: Mapped[int] = mapped_column(
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False
    )

    amenity_id: Mapped[int] = mapped_column(
        ForeignKey("amenities.id", ondelete="CASCADE"),
        nullable=False
    )

    venue = relationship(
        "Venue",
        back_populates="amenities"
    )

    amenity = relationship(
        "Amenity",
        back_populates="venues"
    )

# venue owners profile
class OwnerProfile(Base):
    __tablename__ = "owner_profiles"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False
    )

    business_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="owner_profile"
    )