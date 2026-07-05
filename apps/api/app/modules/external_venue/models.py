"""

Staging area for venues sourced from Google Places API. These are NOT
internal venues — they live here until (if ever) an admin manually
converts one into a real listed venue.
"""
import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    DateTime,
    JSON,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ExternalVenueStatus(str, enum.Enum):
    CANDIDATE = "candidate"       # returned in a search, nothing more
    RESERVED = "reserved"         # at least one user reserved it
    CONTACTED = "contacted"       # admin has manually reached out
    CONVERTED = "converted"       # admin agreed to list it
    LISTED = "listed"             # now exists as a real internal venue
    REJECTED = "rejected"         # admin decided not to pursue


class ExternalVenueStaging(Base):
    __tablename__ = "external_venue_staging"
    __table_args__ = (
        UniqueConstraint("place_id", name="uq_external_venue_place_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Google's own identifier — this is the dedup anchor against re-fetches
    # AND the signal the internal/external combine-layer dedup will key on
    # alongside name + geo.
    place_id: Mapped[str] = mapped_column(String, nullable=False, index=True)

    name: Mapped[str] = mapped_column(String, nullable=False)
    formatted_address: Mapped[str] = mapped_column(String, nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)

    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    website: Mapped[str | None] = mapped_column(String, nullable=True)

    rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    user_ratings_total: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # raw Places "types" array, e.g. ["banquet_hall", "point_of_interest"]
    raw_types: Mapped[list | None] = mapped_column(JSON, nullable=True)

    # the normalized query string that surfaced this venue, kept for
    # debugging / re-ranking analysis later
    source_query: Mapped[str] = mapped_column(String, nullable=False)

    status: Mapped[ExternalVenueStatus] = mapped_column(
        Enum(ExternalVenueStatus, name="external_venue_status"),
        nullable=False,
        default=ExternalVenueStatus.CANDIDATE,
    )

    # whether Place Details has been fetched (vs. only Text Search summary)
    details_enriched: Mapped[bool] = mapped_column(default=False)

    first_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    reservations: Mapped[list["ExternalVenueReservation"]] = relationship(
        back_populates="venue", cascade="all, delete-orphan"
    )


class ExternalVenueReservation(Base):
    """
    A user expressing interest in / reserving an external venue.
    Multiple users can reserve the same staging venue before admin acts —
    this is what admin sees in their manual-outreach queue.
    """
    __tablename__ = "external_venue_reservations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("external_venue_staging.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    venue: Mapped["ExternalVenueStaging"] = relationship(back_populates="reservations")