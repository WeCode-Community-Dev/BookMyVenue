import enum
import uuid
from datetime import date, datetime, time
from typing import Any

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    BigInteger,
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    Text,
    Time,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, TSVECTOR, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class VenueStatus(enum.StrEnum):
    draft = "draft"
    pending_approval = "pending_approval"
    approved = "approved"
    rejected = "rejected"
    suspended = "suspended"


class BookingMode(enum.StrEnum):
    MANUAL = "MANUAL"
    INSTANT = "INSTANT"


class VenueCategory(Base):
    __tablename__ = "venue_categories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(Text, nullable=False)
    label: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str | None] = mapped_column(Text, nullable=True)
    banner_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    search_boost_group: Mapped[str | None] = mapped_column(Text, nullable=True)
    search_keywords: Mapped[str | None] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index(
            "uq_venue_categories_slug_active",
            "slug",
            unique=True,
            postgresql_where=text("deleted_at IS NULL"),
        ),
    )

    venues: Mapped[list["Venue"]] = relationship(back_populates="category")


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False
    )

    name: Mapped[str] = mapped_column(Text, nullable=False)
    slug: Mapped[str | None] = mapped_column(Text, unique=True, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("venue_categories.id"), nullable=False
    )

    address_line1: Mapped[str] = mapped_column(Text, nullable=False)
    address_line2: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str] = mapped_column(Text, nullable=False)
    state: Mapped[str] = mapped_column(Text, nullable=False)
    country: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'India'"))
    postal_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    latitude: Mapped[float | None] = mapped_column(Numeric(10, 7), nullable=True)
    longitude: Mapped[float | None] = mapped_column(Numeric(10, 7), nullable=True)
    timezone: Mapped[str] = mapped_column(
        Text, nullable=False, server_default=text("'Asia/Kolkata'")
    )

    min_capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    max_capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    open_time: Mapped[time] = mapped_column(Time, nullable=False)
    close_time: Mapped[time] = mapped_column(Time, nullable=False)
    spans_next_day: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")

    allowed_booking_types: Mapped[list[str]] = mapped_column(
        ARRAY(Text),
        nullable=False,
        default=lambda: ["full_day", "time_slot"],
        server_default=text("ARRAY['full_day','time_slot']"),
    )
    min_booking_duration_minutes: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="60"
    )
    max_booking_duration_minutes: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="1440"
    )
    slot_interval_minutes: Mapped[int] = mapped_column(Integer, nullable=False, server_default="30")

    pre_buffer_minutes: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    post_buffer_minutes: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")

    pricing_mode: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'flat'"))
    starting_price_paise: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    hourly_rate_paise: Mapped[int | None] = mapped_column(BigInteger, nullable=True)

    platform_commission_pct: Mapped[float] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="10.00"
    )
    advance_pct: Mapped[float] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="30.00"
    )

    min_price_pct: Mapped[float] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="50.00"
    )
    max_price_pct: Mapped[float] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="200.00"
    )
    display_price_min_paise: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    display_price_max_paise: Mapped[int | None] = mapped_column(BigInteger, nullable=True)

    balance_due_days_before_event: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="7"
    )
    owner_action_window_hours: Mapped[int] = mapped_column(
        Integer, nullable=False, server_default="48"
    )
    overdue_advance_refund_pct: Mapped[float] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="0.00"
    )

    status: Mapped[VenueStatus] = mapped_column(
        Enum(VenueStatus, name="venue_status"), nullable=False, server_default=text("'draft'")
    )
    booking_mode: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'MANUAL'"))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    last_completed_step: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")

    search_vector: Mapped[Any | None] = mapped_column(TSVECTOR, nullable=True)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1024), nullable=True)
    embedding_updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    category: Mapped["VenueCategory"] = relationship(back_populates="venues")
    photos: Mapped[list["VenuePhoto"]] = relationship(
        back_populates="venue",
        cascade="all, delete-orphan",
        primaryjoin="and_(Venue.id==VenuePhoto.venue_id, VenuePhoto.deleted_at.is_(None))",
        order_by="VenuePhoto.sort_order",
    )
    amenities: Mapped[list["Amenity"]] = relationship(
        secondary="venue_amenities",
        back_populates="venues",
        secondaryjoin="and_(VenueAmenity.amenity_id==Amenity.id, Amenity.deleted_at.is_(None))",
    )
    availability: Mapped[list["VenueAvailability"]] = relationship(
        back_populates="venue",
        cascade="all, delete-orphan",
        primaryjoin=(
            "and_(Venue.id==VenueAvailability.venue_id, "
            "VenueAvailability.deleted_at.is_(None))"
        ),
    )
    blocked_dates: Mapped[list["VenueBlockedDate"]] = relationship(
        back_populates="venue",
        cascade="all, delete-orphan",
        primaryjoin=(
            "and_(Venue.id==VenueBlockedDate.venue_id, "
            "VenueBlockedDate.deleted_at.is_(None))"
        ),
    )
    cancellation_policy: Mapped["VenueCancellationPolicy"] = relationship(
        back_populates="venue", uselist=False, cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            "min_capacity IS NULL OR min_capacity <= max_capacity", name="ck_venues_capacity"
        ),
        CheckConstraint("min_capacity > 0", name="ck_venues_min_capacity"),
        CheckConstraint("max_capacity > 0", name="ck_venues_max_capacity"),
        CheckConstraint("min_booking_duration_minutes > 0", name="ck_venues_min_duration"),
        CheckConstraint("max_booking_duration_minutes > 0", name="ck_venues_max_duration"),
        CheckConstraint("slot_interval_minutes > 0", name="ck_venues_slot_interval"),
        CheckConstraint(
            "min_booking_duration_minutes <= max_booking_duration_minutes",
            name="ck_venues_duration_range",
        ),
        CheckConstraint("pre_buffer_minutes >= 0", name="ck_venues_pre_buffer"),
        CheckConstraint("post_buffer_minutes >= 0", name="ck_venues_post_buffer"),
        CheckConstraint(
            "pricing_mode IN ('flat', 'hourly', 'mixed')", name="ck_venues_pricing_mode"
        ),
        CheckConstraint("starting_price_paise >= 0", name="ck_venues_base_price"),
        CheckConstraint("hourly_rate_paise >= 0", name="ck_venues_hourly_rate"),
        CheckConstraint(
            "platform_commission_pct >= 0 AND platform_commission_pct <= 100",
            name="ck_venues_commission",
        ),
        CheckConstraint("advance_pct > 0 AND advance_pct <= 100", name="ck_venues_advance_pct"),
        CheckConstraint("balance_due_days_before_event > 0", name="ck_venues_balance_days"),
        CheckConstraint(
            "owner_action_window_hours BETWEEN 24 AND 72", name="ck_venues_action_window"
        ),
        CheckConstraint(
            "overdue_advance_refund_pct BETWEEN 0 AND 100", name="ck_venues_overdue_refund_pct"
        ),
        CheckConstraint(
            "min_price_pct > 0 AND min_price_pct <= 100", name="ck_venues_min_price_pct"
        ),
        CheckConstraint(
            "max_price_pct >= 100 AND max_price_pct <= 500", name="ck_venues_max_price_pct"
        ),
        CheckConstraint("min_price_pct <= max_price_pct", name="ck_venues_price_pct_range"),
        Index(
            "idx_venues_search",
            "city",
            "category_id",
            "status",
            "is_active",
            postgresql_where=text("deleted_at IS NULL"),
        ),
        Index("idx_venues_owner_id", "owner_id"),
    )

    bookings = relationship(
        "Booking",
        back_populates="venue",
    )

    # "VenueReview" resolved via SQLAlchemy registry, see app/models.py
    reviews: Mapped[list["VenueReview"]] = relationship(  # noqa: F821
        back_populates="venue",
    )

    pricing_rules: Mapped[list["VenuePricingRule"]] = relationship(
        back_populates="venue",
        cascade="all, delete-orphan",
        primaryjoin=(
            "and_(Venue.id==VenuePricingRule.venue_id, VenuePricingRule.deleted_at.is_(None))"
        ),
        order_by="VenuePricingRule.priority.desc()",
    )


class VenuePhoto(Base):
    __tablename__ = "venue_photos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False
    )
    image_url: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    is_cover: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    # Relationships
    venue: Mapped["Venue"] = relationship(back_populates="photos")

    __table_args__ = (
        Index(
            "venue_photos_one_cover",
            "venue_id",
            unique=True,
            postgresql_where=text("is_cover = true AND deleted_at IS NULL"),
        ),
    )


class Amenity(Base):
    __tablename__ = "amenities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str | None] = mapped_column(Text, nullable=True)

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (
        Index(
            "uq_amenities_name_active",
            "name",
            unique=True,
            postgresql_where=text("deleted_at IS NULL"),
        ),
    )

    # Relationships
    venues: Mapped[list["Venue"]] = relationship(
        secondary="venue_amenities", back_populates="amenities"
    )


class VenueAmenity(Base):
    __tablename__ = "venue_amenities"

    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("venues.id"), primary_key=True
    )
    amenity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("amenities.id"), primary_key=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class VenueAvailability(Base):
    __tablename__ = "venue_availability"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False
    )
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)

    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")
    opens_at: Mapped[time | None] = mapped_column(Time, nullable=True)
    closes_at: Mapped[time | None] = mapped_column(Time, nullable=True)
    spans_next_day: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="false")

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    venue: Mapped["Venue"] = relationship(back_populates="availability")

    __table_args__ = (
        CheckConstraint("day_of_week BETWEEN 0 AND 6", name="ck_venue_availability_day"),
        CheckConstraint(
            "is_available = false OR (opens_at IS NOT NULL AND closes_at IS NOT NULL)",
            name="ck_venue_availability_times",
        ),
        Index(
            "venue_availability_unique_day",
            "venue_id",
            "day_of_week",
            unique=True,
            postgresql_where=text("deleted_at IS NULL"),
        ),
    )


class VenueBlockedDate(Base):
    __tablename__ = "venue_blocked_dates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False
    )
    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    blocked_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False
    )

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    # Relationships
    venue: Mapped["Venue"] = relationship(back_populates="blocked_dates")

    __table_args__ = (
        CheckConstraint("ends_at > starts_at", name="ck_venue_blocked_dates_order"),
        Index(
            "idx_venue_blocked_dates_venue", "venue_id", postgresql_where=text("deleted_at IS NULL")
        ),
    )


class VenuePricingRule(Base):
    __tablename__ = "venue_pricing_rules"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("venues.id", ondelete="CASCADE"), nullable=False
    )

    name: Mapped[str] = mapped_column(Text, nullable=False)

    days_of_week: Mapped[list[int] | None] = mapped_column(ARRAY(Integer), nullable=True)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    start_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    end_time: Mapped[time | None] = mapped_column(Time, nullable=True)

    adjustment_type: Mapped[str] = mapped_column(Text, nullable=False)
    multiplier: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    amount_paise: Mapped[int | None] = mapped_column(BigInteger, nullable=True)

    applies_to: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'both'"))
    priority: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    source: Mapped[str] = mapped_column(Text, nullable=False, server_default=text("'owner'"))
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="true")

    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    venue: Mapped["Venue"] = relationship(back_populates="pricing_rules")

    __table_args__ = (
        CheckConstraint(
            "adjustment_type IN ('multiplier', 'fixed_delta', 'override')",
            name="ck_venue_pricing_rules_adjustment_type",
        ),
        CheckConstraint(
            "(adjustment_type = 'multiplier' AND multiplier IS NOT NULL "
            "AND multiplier > 0 AND amount_paise IS NULL) OR "
            "(adjustment_type = 'fixed_delta' AND amount_paise IS NOT NULL "
            "AND multiplier IS NULL) OR "
            "(adjustment_type = 'override' AND amount_paise IS NOT NULL "
            "AND amount_paise >= 0 AND multiplier IS NULL)",
            name="ck_venue_pricing_rules_adjustment_payload",
        ),
        CheckConstraint(
            "applies_to IN ('full_day', 'time_slot', 'both')",
            name="ck_venue_pricing_rules_applies_to",
        ),
        CheckConstraint("source IN ('owner', 'system')", name="ck_venue_pricing_rules_source"),
        CheckConstraint(
            "start_date IS NULL OR end_date IS NULL OR start_date <= end_date",
            name="ck_venue_pricing_rules_date_range",
        ),
        Index(
            "idx_venue_pricing_rules_priority",
            "venue_id",
            "priority",
            postgresql_where=text("deleted_at IS NULL AND is_active = true"),
        ),
    )


class VenueCancellationPolicy(Base):
    __tablename__ = "venue_cancellation_policies"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("venues.id"), nullable=False, unique=True
    )

    tier_1_hours: Mapped[int | None] = mapped_column(Integer, nullable=True)
    tier_1_refund_pct: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    tier_2_hours: Mapped[int | None] = mapped_column(Integer, nullable=True)
    tier_2_refund_pct: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    tier_3_hours: Mapped[int | None] = mapped_column(Integer, nullable=True)
    tier_3_refund_pct: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)

    no_show_refund_pct: Mapped[float] = mapped_column(
        Numeric(5, 2), nullable=False, server_default="0"
    )
    platform_fee_refundable: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default="false"
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    venue: Mapped["Venue"] = relationship(back_populates="cancellation_policy")

    __table_args__ = (
        CheckConstraint("tier_1_hours > 0", name="ck_vcp_tier_1_hours"),
        CheckConstraint("tier_1_refund_pct BETWEEN 0 AND 100", name="ck_vcp_tier_1_pct"),
        CheckConstraint("tier_2_hours > 0", name="ck_vcp_tier_2_hours"),
        CheckConstraint("tier_2_refund_pct BETWEEN 0 AND 100", name="ck_vcp_tier_2_pct"),
        CheckConstraint("tier_3_hours > 0", name="ck_vcp_tier_3_hours"),
        CheckConstraint("tier_3_refund_pct BETWEEN 0 AND 100", name="ck_vcp_tier_3_pct"),
        CheckConstraint("no_show_refund_pct BETWEEN 0 AND 100", name="ck_vcp_no_show_pct"),
        CheckConstraint(
            "(tier_1_hours IS NULL OR tier_2_hours IS NULL OR tier_1_hours > tier_2_hours) AND "
            "(tier_2_hours IS NULL OR tier_3_hours IS NULL OR tier_2_hours > tier_3_hours)",
            name="tiers_descending",
        ),
        CheckConstraint(
            "(tier_1_hours IS NULL) = (tier_1_refund_pct IS NULL)", name="tier_1_paired"
        ),
        CheckConstraint(
            "(tier_2_hours IS NULL) = (tier_2_refund_pct IS NULL)", name="tier_2_paired"
        ),
        CheckConstraint(
            "(tier_3_hours IS NULL) = (tier_3_refund_pct IS NULL)", name="tier_3_paired"
        ),
    )


class VenueLike(Base):
    __tablename__ = "venue_likes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False
    )
    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("venues.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    __table_args__ = (Index("uq_venue_likes_user_venue", "user_id", "venue_id", unique=True),)
