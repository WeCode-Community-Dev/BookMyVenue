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

    price_per_day = Column(Numeric(10, 2), nullable=False)

    description = Column(Text, nullable=True)

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