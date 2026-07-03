import uuid
import logging
from datetime import datetime, timezone, date
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.modules.booking.models import (
    Booking,
    BookingSlot,
    BookingStatus,
    BookingStatusHistory,
    PaymentStatus,
)
from app.modules.booking.schemas import BookingOut, BookingDisplay
from app.modules.venue.models import Venue, VenueCancellationPolicy

logger = logging.getLogger(__name__)

MAX_DEADLINE_EXTENSIONS = 2
USER_PAYMENT_HOLD_HOURS = 24
REQUEST_EXPIRY_DAYS = 7

TERMINAL_STATUSES = {
    BookingStatus.completed,
    BookingStatus.hold_expired,
    BookingStatus.request_expired,
    BookingStatus.conflict_cancelled,
    BookingStatus.user_cancelled,
    BookingStatus.admin_cancelled,
    BookingStatus.owner_rejected,
    BookingStatus.balance_overdue_cancelled,
}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _format_inr(paise: int) -> str:
    rupees = paise / 100
    return f"INR {rupees:,.0f}"


def _enum_value(value) -> str:
    return value.value if hasattr(value, "value") else str(value)


def _history(
    booking: Booking,
    old_status: BookingStatus | None,
    new_status: BookingStatus,
    changed_by: UUID | None = None,
    reason: str | None = None,
    metadata: dict | None = None,
) -> BookingStatusHistory:
    return BookingStatusHistory(
        id=uuid.uuid4(),
        booking_id=booking.id,
        old_status=old_status,
        new_status=new_status,
        changed_by=changed_by,
        reason=reason,
        change_metadata=metadata,
    )


def _booking_or_404(
    db: Session,
    booking_id: UUID,
    for_update: bool = False,
) -> Booking:
    query = db.query(Booking).options(
        selectinload(Booking.slot),
        selectinload(Booking.venue).selectinload(Venue.photos),
        selectinload(Booking.user),
    ).filter(
        Booking.id == booking_id,
        Booking.deleted_at.is_(None),
    )
    if for_update:
        query = query.with_for_update()

    booking = query.first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    return booking


def _assert_booking_user(booking: Booking, user_id: UUID) -> None:
    if booking.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Booking access denied")


def _assert_booking_owner(booking: Booking, owner_id: UUID) -> None:
    if booking.venue.owner_id != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Booking owner access denied")


def _slot_for_update(db: Session, booking_id: UUID) -> BookingSlot:
    slot = (
        db.query(BookingSlot)
        .filter(
            BookingSlot.booking_id == booking_id,
            BookingSlot.deleted_at.is_(None),
        )
        .with_for_update()
        .first()
    )
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking slot not found")

    return slot


def _booking_out(booking: Booking) -> BookingOut:
    slot = booking.slot

    cover_photo = next(
        (
            photo.image_url
            for photo in booking.venue.photos
            if photo.is_cover and photo.deleted_at is None
        ),
        None,
    )

    return BookingOut(
        id=booking.id,
        venue_id=booking.venue_id,
        venue_name=booking.venue.name,
        venue_city=booking.venue.city,
        venue_cover_photo_url=cover_photo,
        user_id=booking.user_id,
        user_full_name=booking.user.full_name if booking.user else None,
        user_email=booking.user.email if booking.user else None,
        user_phone=booking.user.phone if booking.user else None,
        booking_type=_enum_value(booking.booking_type),
        status=_enum_value(booking.status),
        payment_status=_enum_value(booking.payment_status),
        starts_at=slot.starts_at,
        ends_at=slot.ends_at,
        effective_starts_at=slot.effective_starts_at,
        effective_ends_at=slot.effective_ends_at,
        guest_count=booking.guest_count,
        event_type=booking.event_type,
        user_notes=booking.user_notes,
        owner_notes=booking.owner_notes,
        quoted_price_paise=booking.quoted_price_paise,
        platform_commission_pct=float(booking.platform_commission_pct),
        platform_fee_paise=booking.platform_fee_paise,
        owner_payout_paise=booking.owner_payout_paise,
        advance_pct=float(booking.advance_pct),
        advance_due_paise=booking.advance_due_paise,
        balance_due_paise=booking.balance_due_paise,
        balance_due_date=booking.balance_due_date,
        hold_expires_at=booking.hold_expires_at,
        confirmed_at=booking.confirmed_at,
        cancelled_at=booking.cancelled_at,
        expired_at=booking.expired_at,
        amount_paid_paise=booking.amount_paid_paise,
        refund_amount_paise=booking.refund_amount_paise,
        stripe_advance_payment_intent_id=booking.stripe_advance_payment_intent_id,
        stripe_balance_payment_intent_id=booking.stripe_balance_payment_intent_id,
        deadline_extension_count=booking.deadline_extension_count,
        balance_overdue_at=booking.balance_overdue_at,
        owner_action_deadline=booking.owner_action_deadline,
        created_at=booking.created_at,
        display=BookingDisplay(
            quoted_price=_format_inr(booking.quoted_price_paise),
            advance_due=_format_inr(booking.advance_due_paise),
            balance_due=_format_inr(booking.balance_due_paise),
            platform_fee=_format_inr(booking.platform_fee_paise),
            owner_payout=_format_inr(booking.owner_payout_paise),
        ),
    )


def _load_policy(db: Session, venue_id: UUID) -> VenueCancellationPolicy | None:
    return (
        db.query(VenueCancellationPolicy)
        .filter(VenueCancellationPolicy.venue_id == venue_id)
        .first()
    )
