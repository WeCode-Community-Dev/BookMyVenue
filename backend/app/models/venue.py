from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    CheckConstraint,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)

    owner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    name = Column(String(150), nullable=False)
    location = Column(String(255), nullable=False)
    # owner pastes Google Maps share link so customers can open directions
    google_maps_url = Column(String(500), nullable=True)

    price_per_day = Column(Numeric(10, 2), nullable=False)
    
    
    # --- NEW: needed for the "500 Guests" line on venue cards and to
    # validate that a booking's guest_count doesn't exceed the venue.
    # Nullable so existing rows (created before this column existed)
    # don't break — they'll just show capacity as unknown until edited.
    
    capacity = Column(Integer, nullable=True)
    
    
    # --- NEW: a single hero image URL for the venue card thumbnail.
    # Kept as one plain string column rather than a separate "venue_images"
    # table — the dashboard only ever shows one image per venue card, and
    # a full gallery feature can be added later as its own table without
    # touching this one.
    image_url = Column(String(500), nullable=True)

    description = Column(Text, nullable=True)
    
    
     # --- NEW: category of venue (Wedding Hall, Conference Hall, etc).
    # Backed by a VenueType lookup table (see app/models/venue_type.py)
    # rather than a CheckConstraint, so new types can be added later with
    # a simple INSERT instead of a schema migration. Required — every venue
    # needs a type — so this column is non-nullable, which means the
    # `venues` table must be dropped and recreated once this is added
    # (create_all() cannot add a NOT NULL column to an existing table).
    
    venue_type_id = Column(
        Integer,
        ForeignKey("venue_types.id"),
        nullable=False,
    )

    approval_status = Column(
        String(20),
        nullable=False,
        default="pending",
    )

    rejection_reason = Column(Text, nullable=True)

    average_rating = Column(
        Numeric(3, 2),
        default=0.00,
    )

    total_reviews = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # Days before check-in for tiered cancellation refunds (all three set or all null).
    refund_50_days_before = Column(Integer, nullable=True)
    refund_25_days_before = Column(Integer, nullable=True)
    cancel_cutoff_days_before = Column(Integer, nullable=True)

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationship
    amenities = relationship(
        "Amenity",
        secondary="venue_amenities",
        back_populates="venues",
    )
    
    venue_type = relationship("VenueType", back_populates="venues")

    __table_args__ = (
        CheckConstraint(
            "price_per_day >= 0",
            name="ck_venue_price_non_negative",
        ),
        CheckConstraint(
            "approval_status IN ('pending', 'approved', 'rejected')",
            name="ck_venue_approval_status",
        ),
        CheckConstraint(
            "average_rating >= 0 AND average_rating <= 5",
            name="ck_venue_average_rating",
        ),
    )