from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Any

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import VenueStatus

if TYPE_CHECKING:
    from app.models.category import VenueCategory
    from app.models.location import City
    from app.models.schedule import (
        VenueScheduleGroup,
        VenueScheduleOverride,
    )


class Venue(Base):
    __tablename__ = "venues"

    __table_args__ = (
        CheckConstraint("capacity > 0", name="ck_venues_capacity_positive"),
        CheckConstraint(
            "average_rating >= 0 AND average_rating <= 5",
            name="ck_venues_average_rating_range",
        ),
        Index("ix_venues_slug", "slug"),
        Index("ix_venues_owner_id", "owner_id"),
        Index("ix_venues_category_id", "category_id"),
        Index("ix_venues_city_id", "city_id"),
        Index("ix_venues_status", "status"),
        Index("ix_venues_category_status", "category_id", "status"),
        Index("ix_venues_city_status", "city_id", "status"),
        Index(
            "ix_venues_name_trgm",
            "name",
            postgresql_using="gin",
            postgresql_ops={"name": "gin_trgm_ops"},
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    owner_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        doc="Owner user id from the auth/backend service (no cross-DB FK).",
    )

    category_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("venue_categories.id", ondelete="RESTRICT"),
        nullable=False,
    )

    city_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("cities.id", ondelete="RESTRICT"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(String(200), nullable=False)

    slug: Mapped[str] = mapped_column(String(220), unique=True, nullable=False)

    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    address: Mapped[str] = mapped_column(Text, nullable=False)

    google_maps_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        doc="Google Maps URL for venue directions.",
    )

    capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    contact_name: Mapped[str] = mapped_column(String(100), nullable=False)

    contact_phone: Mapped[str] = mapped_column(String(20), nullable=False)

    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)

    status: Mapped[str] = mapped_column(
        String(20),
        default=VenueStatus.PENDING_APPROVAL.value,
        nullable=False,
    )

    amenities: Mapped[list[Any]] = mapped_column(
        JSONB,
        default=list,
        nullable=False,
    )

    booking_type: Mapped[str] = mapped_column(String(20), nullable=False)

    average_rating: Mapped[Decimal] = mapped_column(
        Numeric(2, 1),
        default=Decimal("0.0"),
        nullable=False,
        doc="Cached average rating from reviews (0.0–5.0).",
    )

    review_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        doc="Cached count of reviews for this venue.",
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    category: Mapped[VenueCategory] = relationship(
        "VenueCategory",
        back_populates="venues",
    )

    city: Mapped[City] = relationship(
        "City",
        back_populates="venues",
    )

    images: Mapped[list[VenueImage]] = relationship(
        "VenueImage",
        back_populates="venue",
        cascade="all, delete-orphan",
    )

    schedule_groups: Mapped[list[VenueScheduleGroup]] = relationship(
        "VenueScheduleGroup",
        back_populates="venue",
        cascade="all, delete-orphan",
    )

    schedule_overrides: Mapped[list[VenueScheduleOverride]] = relationship(
        "VenueScheduleOverride",
        back_populates="venue",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Venue id={self.id} name={self.name!r}>"


class VenueImage(Base):
    __tablename__ = "venue_images"

    __table_args__ = (
        Index("ix_venue_images_venue_id", "venue_id"),
        Index("ix_venue_images_venue_sort", "venue_id", "sort_order"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    venue_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
    )

    image_url: Mapped[str] = mapped_column(Text, nullable=False)

    is_cover: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    sort_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    venue: Mapped[Venue] = relationship(
        "Venue",
        back_populates="images",
    )

    def __repr__(self) -> str:
        return f"<VenueImage id={self.id} venue_id={self.venue_id}>"
