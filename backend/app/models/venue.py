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
    google_maps_url = Column(String(500), nullable=True)

    price_per_day = Column(Numeric(10, 2), nullable=False)

    capacity = Column(Integer, nullable=True)

    image_url = Column(String(500), nullable=True)

    description = Column(Text, nullable=True)

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

    amenities = relationship(
        "Amenity",
        secondary="venue_amenities",
        back_populates="venues",
    )

    venue_type = relationship("VenueType", back_populates="venues")

    images = relationship(
        "VenueImage",
        back_populates="venue",
        cascade="all, delete-orphan",
        order_by="VenueImage.sort_order",
    )

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
