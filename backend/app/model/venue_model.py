from datetime import datetime, time
from enum import Enum
from uuid import uuid4

from sqlalchemy import (
    String,
    Text,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    Index,
    Enum as SqlEnum,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.config.database import Base


class VerificationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class Venue(Base):
    __tablename__ = "venues"

    __table_args__ = (
        Index("idx_venue_city", "city"),
        Index("idx_venue_category", "category"),
        Index("idx_venue_status", "status"),
        Index("idx_venue_featured", "is_featured"),
        Index("idx_venue_rating", "average_rating"),
    )

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    owner_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    venue_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Location
    address: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="India",
    )

    pincode: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    latitude: Mapped[float | None]
    longitude: Mapped[float | None]

    min_capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    max_capacity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    cover_image_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    virtual_tour_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    instant_booking: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="draft",
        nullable=False,
        index=True,
    )

    verification_status: Mapped[VerificationStatus] = mapped_column(
        # SqlEnum(ApprovalStatus, name="approval_status"),
        SqlEnum(
            VerificationStatus,
            name="approval_status",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
        default=VerificationStatus.PENDING,
        server_default=VerificationStatus.PENDING.value,
    )

    average_rating: Mapped[float] = mapped_column(
        Numeric(3, 2),
        default=0,
    )

    total_reviews: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    view_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    booking_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    approved_by: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    rejection_reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    images = relationship(
        "VenueImage",
        back_populates="venue",
        cascade="all, delete-orphan",
    )

    slots = relationship(
        "VenueSlot",
        back_populates="venue",
        cascade="all, delete-orphan",
    )

    services = relationship(
        "VenueServiceSchema",
        back_populates="venue",
        cascade="all, delete-orphan",
    )

    amenities = relationship(
        "VenueAmenity",
        back_populates="venue",
        cascade="all, delete-orphan",
    )


class VenueImage(Base):
    __tablename__ = "venue_images"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    venue_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("venues.id", ondelete="CASCADE"),
    )

    image_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    sort_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
    )

    venue = relationship(
        "Venue",
        back_populates="images",
    )


class Amenity(Base):
    __tablename__ = "amenities"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )


class VenueAmenity(Base):
    __tablename__ = "venue_amenities"

    venue_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("venues.id", ondelete="CASCADE"),
        primary_key=True,
    )

    amenity_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("amenities.id"),
        primary_key=True,
    )

    venue = relationship(
        "Venue",
        back_populates="amenities",
    )

    amenity = relationship("Amenity")


class VenueSlot(Base):
    __tablename__ = "venue_slots"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    venue_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("venues.id", ondelete="CASCADE"),
    )

    slot_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    start_time: Mapped[time]

    end_time: Mapped[time]

    capacity: Mapped[int | None]

    price: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    venue = relationship(
        "Venue",
        back_populates="slots",
    )


class VenueServiceSchema(Base):
    __tablename__ = "venue_services"

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    venue_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("venues.id", ondelete="CASCADE"),
    )

    service_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    price: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    venue = relationship(
        "Venue",
        back_populates="services",
    )
