import math
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.modules.booking.helpers import (
    TERMINAL_STATUSES,
    _assert_booking_owner,
    _assert_booking_user,
    _booking_or_404,
    _booking_out,
    _format_inr,
    _history,
    _load_policy,
    _now,
    _slot_for_update,
)
from app.modules.booking.models import (
    Booking,
    BookingStatus,
    PaymentStatus,
)
from app.modules.booking.schemas import (
    BookingOut,
    CancellationDisplay,
    CancellationPreviewOut,
)
from app.modules.notification import service as notifications
from app.modules.notification.types import NotificationType
from app.modules.payment import service as payment_service
from app.modules.venue.models import VenueCancellationPolicy


@dataclass
class RefundComputation:
    refund_amount_paise: int
    penalty_amount_paise: int
    refund_pct_applied: float
    tier_matched: str | None


def _compute_refund(
    booking: Booking,
    policy: VenueCancellationPolicy | None,
    cancelled_at: datetime | None = None,
) -> RefundComputation:
    cancelled_at = cancelled_at or _now()
    starts_at = booking.slot.starts_at
    paid_amount = booking.amount_paid_paise

    if paid_amount <= 0:
        return RefundComputation(0, 0, 0.0, None)

    hours_notice = (starts_at - cancelled_at).total_seconds() / 3600
    refund_pct = 0.0
    tier = "no_show"

    if policy:
        tiers = [
            ("tier_1", policy.tier_1_hours, policy.tier_1_refund_pct),
            ("tier_2", policy.tier_2_hours, policy.tier_2_refund_pct),
            ("tier_3", policy.tier_3_hours, policy.tier_3_refund_pct),
        ]
        for tier_name, hours, pct in tiers:
            if hours is not None and pct is not None and hours_notice >= hours:
                tier = tier_name
                refund_pct = float(pct)
                break
        else:
            refund_pct = float(policy.no_show_refund_pct)
    else:
        tier = None

    if policy and not policy.platform_fee_refundable:
        # Calculate refund on the portion excluding platform fee
        base_refundable = max(0, paid_amount - booking.platform_fee_paise)
        refund_amount = round(base_refundable * refund_pct / 100)
    else:
        refund_amount = round(paid_amount * refund_pct / 100)

    penalty_amount = max(0, paid_amount - refund_amount)
    return RefundComputation(
        refund_amount_paise=refund_amount,
        penalty_amount_paise=penalty_amount,
        refund_pct_applied=refund_pct,
        tier_matched=tier,
    )


def get_cancellation_preview(
    db: Session,
    booking_id: UUID,
    user_id: UUID,
) -> CancellationPreviewOut:
    booking = _booking_or_404(db, booking_id)
    _assert_booking_user(booking, user_id)

    if booking.status not in (
        BookingStatus.requested,
        BookingStatus.owner_accepted,
        BookingStatus.confirmed,
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Booking cannot be cancelled at this stage",
        )

    if booking.status == BookingStatus.requested or booking.status == BookingStatus.owner_accepted:
        # No refund for pre-payment
        return CancellationPreviewOut(
            refund_amount_paise=0,
            penalty_amount_paise=0,
            refund_pct_applied=0.0,
            tier_matched=None,
            display=CancellationDisplay(refund_amount="₹0", penalty_amount="₹0"),
        )

    refund = _compute_refund(booking, _load_policy(db, booking.venue_id))
    return CancellationPreviewOut(
        refund_amount_paise=refund.refund_amount_paise,
        penalty_amount_paise=refund.penalty_amount_paise,
        refund_pct_applied=refund.refund_pct_applied,
        tier_matched=refund.tier_matched,
        display=CancellationDisplay(
            refund_amount=_format_inr(refund.refund_amount_paise),
            penalty_amount=_format_inr(refund.penalty_amount_paise),
        ),
    )


def user_cancel_booking(db: Session, booking_id: UUID, user_id: UUID) -> BookingOut:
    booking = _booking_or_404(db, booking_id, for_update=True)
    _assert_booking_user(booking, user_id)

    if booking.status in TERMINAL_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot cancel a terminal booking",
        )

    # Per spec: allowed on requested, owner_accepted, confirmed
    if booking.status not in (
        BookingStatus.requested,
        BookingStatus.owner_accepted,
        BookingStatus.confirmed,
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Booking cannot be cancelled at this stage",
        )

    old_status = booking.status
    slot = _slot_for_update(db, booking.id) if hasattr(booking, "slot") and booking.slot else None
    if slot:
        slot.is_blocking = False

    booking.status = BookingStatus.user_cancelled
    booking.cancelled_at = _now()

    metadata = None
    if old_status == BookingStatus.requested:
        # Simple cancel - no payment
        pass
    elif old_status == BookingStatus.owner_accepted:
        # Cancel pending PaymentIntent
        if booking.stripe_advance_payment_intent_id:
            payment_service.cancel_payment_intent(booking.stripe_advance_payment_intent_id)
    else:  # confirmed
        refund = _compute_refund(booking, _load_policy(db, booking.venue_id), booking.cancelled_at)
        if refund.refund_amount_paise > 0:
            payment_service.refund_for_cancellation(
                db, booking, refund.refund_amount_paise, "user_cancellation"
            )
        booking.refund_amount_paise = refund.refund_amount_paise

        if refund.refund_amount_paise == 0:
            pass  # keep existing payment_status
        elif refund.refund_amount_paise >= booking.amount_paid_paise:
            booking.payment_status = PaymentStatus.refunded
        else:
            booking.payment_status = PaymentStatus.partially_refunded

        metadata = {
            "refund_amount_paise": refund.refund_amount_paise,
            "penalty_amount_paise": refund.penalty_amount_paise,
            "refund_pct_applied": refund.refund_pct_applied,
            "tier_matched": refund.tier_matched,
        }

    db.add(
        _history(
            booking,
            old_status,
            BookingStatus.user_cancelled,
            changed_by=user_id,
            metadata=metadata,
        )
    )
    db.flush()
    db.refresh(booking)

    # Notifications (spec: notify owner)
    notifications.notify(
        db,
        booking.venue.owner_id,
        NotificationType.BOOKING_CANCELED,
        context={"venue_name": booking.venue.name},
        booking_id=booking.id,
    )
    return _booking_out(booking)


def owner_cancel_forfeit(db: Session, booking_id: UUID, owner_id: UUID) -> BookingOut:
    booking = _booking_or_404(db, booking_id, for_update=True)
    _assert_booking_owner(booking, owner_id)
    if booking.status != BookingStatus.confirmed or booking.balance_overdue_at is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Booking is not balance overdue"
        )

    _slot_for_update(db, booking.id).is_blocking = False
    old_status = booking.status
    booking.status = BookingStatus.balance_overdue_cancelled
    booking.cancelled_at = _now()
    booking.refund_amount_paise = 0
    booking.payment_status = PaymentStatus.refunded
    db.add(
        _history(
            booking,
            old_status,
            BookingStatus.balance_overdue_cancelled,
            changed_by=owner_id,
            metadata={"refund_amount_paise": 0},
        )
    )
    db.flush()
    db.refresh(booking)
    notifications.notify(
        db,
        booking.user_id,
        NotificationType.BOOKING_CANCELED,
        context={"venue_name": booking.venue.name},
        booking_id=booking.id,
    )
    return _booking_out(booking)


def owner_cancel_goodwill(db: Session, booking_id: UUID, owner_id: UUID) -> BookingOut:
    booking = _booking_or_404(db, booking_id, for_update=True)
    _assert_booking_owner(booking, owner_id)
    if booking.status != BookingStatus.confirmed or booking.balance_overdue_at is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Booking is not balance overdue"
        )

    _slot_for_update(db, booking.id).is_blocking = False
    old_status = booking.status
    refund_amount = math.floor(
        booking.amount_paid_paise * (float(booking.overdue_advance_refund_pct) / 100)
    )
    if refund_amount > 0:
        payment_service.refund_for_cancellation(db, booking, refund_amount, "owner_goodwill")

    booking.status = BookingStatus.user_cancelled
    booking.cancelled_at = _now()
    booking.refund_amount_paise = refund_amount
    booking.payment_status = (
        PaymentStatus.partially_refunded if refund_amount > 0 else booking.payment_status
    )
    db.add(
        _history(
            booking,
            old_status,
            BookingStatus.user_cancelled,
            changed_by=owner_id,
            metadata={"refund_amount_paise": refund_amount, "goodwill": True},
        )
    )
    db.flush()
    db.refresh(booking)
    notifications.notify(
        db,
        booking.user_id,
        NotificationType.BOOKING_CANCELED,
        context={"venue_name": booking.venue.name},
        booking_id=booking.id,
    )
    return _booking_out(booking)


def admin_force_cancel(
    db: Session,
    booking_id: UUID,
    admin_id: UUID,
    reason: str,
) -> BookingOut:
    booking = _booking_or_404(db, booking_id, for_update=True)
    if booking.status in TERMINAL_STATUSES:
        return _booking_out(booking)

    old_status = booking.status
    if booking.slot:
        booking.slot.is_blocking = False
    booking.status = BookingStatus.admin_cancelled
    booking.cancelled_at = _now()
    db.add(
        _history(
            booking, old_status, BookingStatus.admin_cancelled, changed_by=admin_id, reason=reason
        )
    )
    db.flush()
    db.refresh(booking)
    return _booking_out(booking)
