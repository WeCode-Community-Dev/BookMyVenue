import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, Boolean, String, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.venue.models import Venue
    from app.modules.booking.models import Booking
    from app.modules.profile.models import Profile


class VenueReview(Base):
    __tablename__ = "venue_reviews"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("venues.id"),
        nullable=False,
        index=True,
    )

    booking_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id"),
        nullable=False,
        unique=True,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id"),
        nullable=False,
        index=True,
    )

    rating: Mapped[int] = mapped_column(Integer, nullable=False)

    title: Mapped[str | None] = mapped_column(String(255), nullable=True)

    comment: Mapped[str] = mapped_column(Text, nullable=False)

    is_hidden: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    hidden_reason: Mapped[str | None] = mapped_column(String(255), nullable=True)

    hidden_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id"),
        nullable=True,
    )

    hidden_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, index=True
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True, index=True
    )

    # Relationships
    venue: Mapped["Venue"] = relationship(back_populates="reviews")
    booking: Mapped["Booking"] = relationship()
    author: Mapped["Profile"] = relationship(foreign_keys=[user_id])
    hidden_by_user: Mapped["Profile | None"] = relationship(foreign_keys=[hidden_by])
