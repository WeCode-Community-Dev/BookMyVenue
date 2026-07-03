import enum
import uuid
from datetime import datetime, date

from sqlalchemy import (
    CheckConstraint,
    Enum,
    DateTime,
    Date,
    ForeignKey,
    func,
    Integer,
    BigInteger,
    Numeric,
    Text,
    String,
    Boolean,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from typing import TYPE_CHECKING

from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.profile.models import Profile
    from app.modules.venue.models import Venue


class BookingType(str, enum.Enum):
    full_day = "full_day"
    time_slot = "time_slot"


class BookingStatus(str, enum.Enum):
    requested = "requested"
    owner_accepted = "owner_accepted"
    confirmed = "confirmed"
    completed = "completed"
    hold_expired = "hold_expired"
    request_expired = "request_expired"
    conflict_cancelled = "conflict_cancelled"
    user_cancelled = "user_cancelled"
    admin_cancelled = "admin_cancelled"
    owner_rejected = "owner_rejected"
    balance_overdue_cancelled = "balance_overdue_cancelled"


class PaymentStatus(str, enum.Enum):
    unpaid = "unpaid"
    advance_paid = "advance_paid"
    fully_paid = "fully_paid"
    refunded = "refunded"
    partially_refunded = "partially_refunded"

class Booking(Base):
    __tablename__ = "bookings"

    __table_args__ = (
        CheckConstraint(
            "guest_count > 0",
            name="ck_bookings_guest_count",
        ),
        CheckConstraint(
            "deadline_extension_count <= 2",
            name="ck_bookings_deadline_extensions",
        ),
        CheckConstraint(
            "advance_due_paise + balance_due_paise = quoted_price_paise",
            name="ck_bookings_price_split",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("venues.id"),
        nullable=False,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id"),
        nullable=False,
    )

    booking_type: Mapped[BookingType] = mapped_column(
        Enum(BookingType, name="booking_type"),
        nullable=False,
    )

    event_type: Mapped[str | None] = mapped_column(Text, nullable=True)

    guest_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    user_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    owner_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"),
        nullable=False,
        default=BookingStatus.requested,
    )

    requested_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    owner_responded_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    hold_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    confirmed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    balance_due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    balance_overdue_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    owner_action_deadline: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    cancelled_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    expired_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    deadline_extension_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    pricing_mode: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    quoted_price_paise: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
    )

    pricing_breakdown: Mapped[list[dict] | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    platform_commission_pct: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=0,
    )

    platform_fee_paise: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
    )

    owner_payout_paise: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
    )

    advance_pct: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=0,
    )

    advance_due_paise: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
    )

    balance_due_paise: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
    )

    overdue_advance_refund_pct: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=0,
    )

    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"),
        nullable=False,
        default=PaymentStatus.unpaid,
    )

    amount_paid_paise: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
    )

    refund_amount_paise: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0,
    )

    stripe_advance_payment_intent_id: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    stripe_balance_payment_intent_id: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    slot: Mapped["BookingSlot"] = relationship(
        back_populates="booking",
        uselist=False,
    )

    status_history: Mapped[list["BookingStatusHistory"]] = relationship(
        back_populates="booking",
        cascade="all, delete-orphan",
    )
    
    venue: Mapped["Venue"] = relationship(
        back_populates="bookings",
    )

    user: Mapped["Profile"] = relationship(
        back_populates="bookings",
    )


class BookingSlot(Base):
    __tablename__ = "booking_slots"

    __table_args__ = (
        CheckConstraint(
            "ends_at > starts_at",
            name="ck_booking_slots_time_order",
        ),
        CheckConstraint(
            "effective_starts_at <= starts_at",
            name="ck_booking_slots_effective_start",
        ),
        CheckConstraint(
            "effective_ends_at >= ends_at",
            name="ck_booking_slots_effective_end",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    booking_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id"),
        nullable=False,
    )

    venue_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("venues.id"),
        nullable=False,
    )

    starts_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    ends_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    effective_starts_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    effective_ends_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    is_blocking: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    booking: Mapped["Booking"] = relationship(
        back_populates="slot",
    )

class BookingStatusHistory(Base):
    __tablename__ = "booking_status_history"

    __table_args__ = (
        # Update or expand the CHECK constraint to match spec
        CheckConstraint(
            """
            (old_status IS NULL) OR
            (old_status = 'requested' AND new_status IN ('owner_accepted', 'owner_rejected', 'user_cancelled', 'conflict_cancelled', 'request_expired')) OR
            (old_status = 'owner_accepted' AND new_status IN ('confirmed', 'hold_expired', 'user_cancelled')) OR
            (old_status = 'confirmed' AND new_status IN ('completed', 'user_cancelled', 'admin_cancelled', 'balance_overdue_cancelled')) OR
            (old_status = 'hold_expired' AND new_status = 'owner_accepted')
            """,
            name="ck_booking_status_history_transition",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    booking_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id"),
        nullable=False,
    )

    old_status: Mapped[BookingStatus | None] = mapped_column(
        Enum(BookingStatus, name="booking_status"),
        nullable=True,
    )

    new_status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"),
        nullable=False,
    )

    changed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id"),
        nullable=True,
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    change_metadata: Mapped[dict | None] = mapped_column(
        "metadata",
        JSONB,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    booking: Mapped["Booking"] = relationship(
        back_populates="status_history",
    )

    changed_by_user: Mapped["Profile"] = relationship(
        "Profile",
        foreign_keys=[changed_by],
        primaryjoin="BookingStatusHistory.changed_by == Profile.id",
    )
