"""Payment service — Stripe charge/refund logic with race-safe confirmation.

Invariants enforced (see CLAUDE.md):
  * money is integer paise, never float
  * confirmation is transactional with row locks; the booking_slots GIST
    exclusion guarantees only one confirmed booking per slot
  * losing payers are auto-refunded
  * every money movement writes an append-only ledger entry

Commit policy: create_payment_intent / refund_booking are called from request
handlers and commit themselves. confirm_payment / fail_payment are called from
the webhook handler, which owns the commit.

Refund safety: Stripe refund calls are wrapped (a failure records a `failed`
Refund row and never aborts the surrounding confirmation) and are idempotent
(a payment already past `succeeded` is not refunded twice).
"""

import logging
from datetime import UTC, datetime

from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import BadRequestError, ForbiddenError, NotFoundError
from app.core.stripe_client import get_stripe
from app.modules.admin import settings_store
from app.modules.auth.dependencies import AuthContext
from app.modules.booking.models import (
    Booking,
    BookingSlot,
    BookingStatus,
    BookingStatusHistory,
    PaymentStatus,
)
from app.modules.booking.state_machine import can_transition
from app.modules.notification import service as notifications
from app.modules.payment.models import (
    LedgerEntry,
    Payment,
    PaymentAttemptStatus,
    Refund,
    RefundStatus,
)
from app.modules.payment.schemas import (
    LedgerEntryResponse,
    LedgerListResponse,
    OwnerLedgerStatsResponse,
    PaymentIntentResponse,
    PaymentResponse,
    PlatformLedgerEntryResponse,
    PlatformLedgerListResponse,
    PlatformLedgerStatsResponse,
    RefundResponse,
)
from app.modules.profile.models import Profile
from app.modules.venue.models import Venue

logger = logging.getLogger(__name__)

ADVANCE = "advance"
BALANCE = "balance"


# --------------------------------------------------------------------------- #
# Request-path: create a payment intent (advance or balance)
# --------------------------------------------------------------------------- #
def create_payment_intent(
    db: Session, current_user_id, booking_id: str, payment_type: str = ADVANCE
) -> PaymentIntentResponse:
    booking = db.query(Booking).filter(Booking.id == booking_id).with_for_update().first()
    if not booking:
        raise NotFoundError("Booking not found")
    if str(booking.user_id) != str(current_user_id):
        raise ForbiddenError("You do not own this booking")

    venue = db.get(Venue, booking.venue_id)
    if not venue:
        raise NotFoundError("Venue not found")

    if payment_type == ADVANCE:
        if booking.status not in (BookingStatus.owner_accepted, BookingStatus.payment_pending):
            raise BadRequestError("Booking is not awaiting payment")
        now = datetime.now(UTC)
        if booking.status == BookingStatus.owner_accepted:
            if not booking.hold_expires_at or booking.hold_expires_at < now:
                raise BadRequestError("Payment hold has expired")
        elif booking.status == BookingStatus.payment_pending:
            if not booking.payment_expires_at or booking.payment_expires_at < now:
                raise BadRequestError("Payment hold has expired")
        amount_paise = booking.advance_due_paise
        if amount_paise <= 0:
            raise BadRequestError("Booking has no advance amount due")
        idempotency_key = f"booking-{booking.id}-advance"
    elif payment_type == BALANCE:
        if (
            booking.status != BookingStatus.confirmed
            or booking.payment_status != PaymentStatus.advance_paid
        ):
            raise BadRequestError("Booking is not awaiting a balance payment")
        amount_paise = booking.balance_due_paise
        if amount_paise <= 0:
            raise BadRequestError("Booking has no balance amount due")
        idempotency_key = f"booking-{booking.id}-balance"
    elif payment_type == "full":
        if booking.status not in (BookingStatus.owner_accepted, BookingStatus.payment_pending):
            raise BadRequestError("Booking is not awaiting payment")
        now = datetime.now(UTC)
        if booking.status == BookingStatus.owner_accepted:
            if not booking.hold_expires_at or booking.hold_expires_at < now:
                raise BadRequestError("Payment hold has expired")
        elif booking.status == BookingStatus.payment_pending:
            if not booking.payment_expires_at or booking.payment_expires_at < now:
                raise BadRequestError("Payment hold has expired")
        amount_paise = booking.quoted_price_paise
        if amount_paise <= 0:
            raise BadRequestError("Booking has no amount due")
        idempotency_key = f"booking-{booking.id}-full"
    else:
        raise BadRequestError("Invalid payment type")

    stripe = get_stripe()
    intent = stripe.PaymentIntent.create(
        amount=amount_paise,
        currency=settings.stripe_currency,
        metadata={
            "booking_id": str(booking.id),
            "user_id": str(booking.user_id),
            "payment_type": payment_type,
        },
        idempotency_key=idempotency_key,
    )

    payment = Payment(
        booking_id=booking.id,
        amount_paise=amount_paise,
        currency=settings.stripe_currency,
        status=PaymentAttemptStatus.pending,
        stripe_payment_intent_id=intent.id,
        stripe_client_secret=intent.client_secret,
        payment_type=payment_type,
    )
    db.add(payment)
    if payment_type in (ADVANCE, "full"):
        booking.stripe_advance_payment_intent_id = intent.id
        booking.payment_status = PaymentStatus.unpaid
    else:
        booking.stripe_balance_payment_intent_id = intent.id
    db.commit()
    db.refresh(payment)

    return PaymentIntentResponse(
        payment_id=str(payment.id),
        booking_id=str(booking.id),
        client_secret=intent.client_secret,
        amount_paise=amount_paise,
        currency=payment.currency,
        status=payment.status.value,
    )


# --------------------------------------------------------------------------- #
# Webhook-path: confirm / fail (caller commits)
# --------------------------------------------------------------------------- #
def confirm_payment(db: Session, payment_intent_id: str) -> None:
    payment = (
        db.query(Payment)
        .filter(Payment.stripe_payment_intent_id == payment_intent_id)
        .with_for_update()
        .first()
    )
    if not payment:
        logger.warning("confirm_payment: no payment for intent %s", payment_intent_id)
        return
    booking = db.query(Booking).filter(Booking.id == payment.booking_id).with_for_update().first()
    if not booking:
        logger.warning("confirm_payment: no booking for payment %s", payment.id)
        return

    if payment.payment_type == BALANCE:
        confirm_balance_payment(db, payment, booking)
        return

    # ---- advance / full payment confirmation ----
    # Idempotent: already confirmed
    if (
        payment.status == PaymentAttemptStatus.succeeded
        and booking.status == BookingStatus.confirmed
    ):
        return

    # Booking left the payable state (hold expired / canceled) before the webhook
    # arrived — the money is owed back.
    if booking.status not in (BookingStatus.owner_accepted, BookingStatus.payment_pending):
        logger.warning(
            "confirm_payment: booking %s in %s, refunding stray payment", booking.id, booking.status
        )
        _record_refund(db, payment, booking, payment.amount_paise, "booking_not_payable")
        return

    venue = db.get(Venue, booking.venue_id)

    # Claim the slot(s). The GIST exclusion rejects a second blocking range that
    # overlaps an existing one on the same venue -> the loser hits IntegrityError.
    slots = db.query(BookingSlot).filter(BookingSlot.booking_id == booking.id).all()
    for s in slots:
        s.is_blocking = True
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        logger.info(
            "confirm_payment: booking %s lost the slot race; conflict-canceling", booking.id
        )
        _conflict_cancel_self_and_refund(db, payment_intent_id)
        return

    # Won (or no slots yet). Confirm.
    if not can_transition(booking.status, BookingStatus.confirmed):
        logger.error("confirm_payment: illegal transition %s -> confirmed", booking.status)
        return

    old_status = booking.status
    payment.status = PaymentAttemptStatus.succeeded
    booking.status = BookingStatus.confirmed
    booking.confirmed_at = datetime.now(UTC)
    booking.amount_paid_paise = (booking.amount_paid_paise or 0) + payment.amount_paise

    if payment.payment_type == "full":
        # Full payment covers both advance and balance — advance_due_paise now represents
        # what was paid upfront (the total), and balance is fully settled.
        booking.advance_due_paise = booking.quoted_price_paise
        booking.balance_due_paise = 0
        booking.payment_status = PaymentStatus.fully_paid
    else:
        booking.payment_status = (
            PaymentStatus.fully_paid
            if booking.balance_due_paise == 0
            else PaymentStatus.advance_paid
        )

    if old_status == BookingStatus.payment_pending:
        booking.auto_confirmed_at = datetime.now(UTC)
        booking.confirmed_by = "SYSTEM"
    else:
        booking.confirmed_by = "OWNER"

    owner_id = venue.owner_id if venue else booking.user_id
    db.add(
        LedgerEntry(
            booking_id=booking.id,
            venue_id=booking.venue_id,
            owner_id=owner_id,
            user_id=booking.user_id,
            entry_type="charge",
            amount_paise=payment.amount_paise,
            direction="credit",
            stripe_pi_ref=payment_intent_id,
        )
    )

    fee_pct = (
        float(venue.platform_commission_pct)
        if venue
        else settings_store.get_setting(db, "default_platform_commission_pct")
    )
    fee = booking.platform_fee_paise or round(payment.amount_paise * fee_pct / 100)
    booking.platform_fee_paise = fee
    if fee:
        db.add(
            LedgerEntry(
                booking_id=booking.id,
                venue_id=booking.venue_id,
                owner_id=owner_id,
                user_id=booking.user_id,
                entry_type="platform_fee",
                amount_paise=fee,
                direction="debit",
                stripe_pi_ref=payment_intent_id,
            )
        )

    reason_str = (
        "full_payment_succeeded" if payment.payment_type == "full" else "token_payment_succeeded"
    )
    db.add(
        BookingStatusHistory(
            booking_id=booking.id,
            old_status=old_status,
            new_status=BookingStatus.confirmed,
            reason=reason_str,
        )
    )

    # Knock out competitors for the same slot and refund any who already paid.
    for competitor in _find_competing_bookings(db, booking):
        _conflict_cancel(db, competitor, venue)

    venue_name = venue.name if venue else "your venue"
    # skip_email=True: the customer gets one combined "confirmed + invoice"
    # email from app.modules.booking.invoice once the async job generates the
    # PDF, instead of this immediate email plus a second one later. The
    # in-app notification still fires immediately either way.
    notifications.notify(
        db,
        booking.user_id,
        "payment_confirmed",
        context={"venue_name": venue_name},
        booking_id=booking.id,
        skip_email=True,
    )
    if venue:
        notifications.notify(
            db,
            venue.owner_id,
            "payment_confirmed",
            context={"venue_name": venue_name},
            booking_id=booking.id,
        )

    from app.modules.booking.invoice import enqueue as enqueue_invoice

    enqueue_invoice(db, booking.id)


def confirm_balance_payment(db: Session, payment: Payment, booking: Booking) -> None:
    """Capture the remaining balance on an already-confirmed booking.

    The slot is already reserved (claimed at advance confirmation), so there is
    no slot/conflict work here — only the advance_paid -> fully_paid transition.
    """
    # Idempotent: already fully paid
    if (
        payment.status == PaymentAttemptStatus.succeeded
        and booking.payment_status == PaymentStatus.fully_paid
    ):
        return

    if booking.status != BookingStatus.confirmed:
        logger.warning(
            "confirm_balance_payment: booking %s in %s, refunding stray balance",
            booking.id,
            booking.status,
        )
        _record_refund(db, payment, booking, payment.amount_paise, "balance_not_payable")
        return

    venue = db.get(Venue, booking.venue_id)
    owner_id = venue.owner_id if venue else booking.user_id

    payment.status = PaymentAttemptStatus.succeeded
    booking.amount_paid_paise = (booking.amount_paid_paise or 0) + payment.amount_paise
    booking.payment_status = PaymentStatus.fully_paid
    booking.balance_overdue_at = None
    booking.owner_action_deadline = None

    db.add(
        LedgerEntry(
            booking_id=booking.id,
            venue_id=booking.venue_id,
            owner_id=owner_id,
            user_id=booking.user_id,
            entry_type="charge",
            amount_paise=payment.amount_paise,
            direction="credit",
            stripe_pi_ref=payment.stripe_payment_intent_id,
        )
    )

    venue_name = venue.name if venue else "your venue"
    # skip_email=True: the customer gets one combined "balance paid + updated
    # invoice" email from app.modules.booking.invoice once the async job
    # regenerates the PDF, instead of this immediate email plus a second one
    # later. The in-app notification still fires immediately either way.
    notifications.notify(
        db,
        booking.user_id,
        "balance_paid",
        context={"venue_name": venue_name},
        booking_id=booking.id,
        skip_email=True,
    )
    if venue:
        notifications.notify(
            db,
            venue.owner_id,
            "balance_paid",
            context={"venue_name": venue_name},
            booking_id=booking.id,
        )

    from app.modules.booking.invoice import enqueue as enqueue_invoice

    enqueue_invoice(db, booking.id)


def fail_payment(db: Session, payment_intent_id: str) -> None:
    payment = (
        db.query(Payment)
        .filter(Payment.stripe_payment_intent_id == payment_intent_id)
        .with_for_update()
        .first()
    )
    if not payment:
        return
    payment.status = PaymentAttemptStatus.failed
    # Booking stays in its current state; the hold-expiry / balance-overdue jobs
    # reclaim it if no retry succeeds.


def cancel_payment_intent(payment_intent_id: str | None) -> None:
    """Cancel an uncaptured Stripe PaymentIntent (e.g. a pending advance whose
    booking is being cancelled before payment succeeds).

    Resilient like _record_refund: a Stripe failure (already-captured, already
    -canceled, or network error) is logged and swallowed so it never aborts the
    surrounding cancellation transaction.
    """
    if not payment_intent_id:
        return
    try:
        get_stripe().PaymentIntent.cancel(payment_intent_id)
    except Exception:  # noqa: BLE001 — Stripe/network failure must not abort the txn
        logger.exception("Stripe cancel failed for payment intent %s", payment_intent_id)


# --------------------------------------------------------------------------- #
# Request-path: owner / admin refund (full)
# --------------------------------------------------------------------------- #
def refund_booking(
    db: Session, booking_id: str, current_user: AuthContext, reason: str | None
) -> RefundResponse:
    booking = db.query(Booking).filter(Booking.id == booking_id).with_for_update().first()
    if not booking:
        raise NotFoundError("Booking not found")

    venue = db.get(Venue, booking.venue_id)
    is_venue_owner = (
        current_user.is_owner() and venue and str(venue.owner_id) == str(current_user.user_id)
    )
    if not current_user.is_admin() and not is_venue_owner:
        raise ForbiddenError("Only the venue owner or an admin can refund this booking")

    payments = _succeeded_payments(db, booking.id)
    if not payments:
        raise BadRequestError("No captured payment to refund")

    # Full refund: every captured payment (advance + balance) is returned.
    refunded = 0
    for p in payments:
        refunded += _record_refund(db, p, booking, p.amount_paise, reason or "owner_cancellation")

    if refunded > 0:
        # Set payment_status based on whether full amount was refunded or only partial
        total_paid = booking.amount_paid_paise or 0
        booking.payment_status = (
            PaymentStatus.refunded if refunded >= total_paid else PaymentStatus.partially_refunded
        )
        venue_name = venue.name if venue else "your venue"
        notifications.notify(
            db,
            booking.user_id,
            "refund_issued",
            context={"venue_name": venue_name, "amount_rupees": refunded // 100},
            booking_id=booking.id,
        )

    if booking.status == BookingStatus.confirmed and can_transition(
        booking.status, BookingStatus.user_cancelled
    ):
        booking.status = BookingStatus.user_cancelled
        booking.cancelled_at = datetime.now(UTC)
        db.add(
            BookingStatusHistory(
                booking_id=booking.id,
                old_status=BookingStatus.confirmed,
                new_status=BookingStatus.user_cancelled,
                reason=reason or "owner_cancellation",
            )
        )
        # release the slots so they can be rebooked
        for s in db.query(BookingSlot).filter(BookingSlot.booking_id == booking.id).all():
            s.is_blocking = False

    db.commit()
    return RefundResponse(
        booking_id=str(booking.id),
        refunded_paise=refunded,
        status="succeeded" if refunded > 0 else "failed",
    )


def refund_for_cancellation(db: Session, booking: Booking, amount_paise: int, reason: str) -> int:
    """Refund up to `amount_paise` across a booking's captured payments.

    Used by the booking cancellation flows so their computed policy refunds
    (full / partial / goodwill) move real money and write ledger entries.
    Does NOT commit and does NOT set booking.payment_status — the caller owns
    both (the caller knows whether the result is a full or partial refund).
    """
    if amount_paise <= 0:
        return 0
    remaining = amount_paise
    refunded = 0
    for p in _succeeded_payments(db, booking.id):
        if remaining <= 0:
            break
        take = min(remaining, p.amount_paise)
        got = _record_refund(db, p, booking, take, reason)
        refunded += got
        remaining -= got
    return refunded


def list_payments_for_booking(
    db: Session, booking_id: str, current_user: AuthContext
) -> list[PaymentResponse]:
    booking = db.get(Booking, booking_id)
    if not booking:
        raise NotFoundError("Booking not found")
    venue = db.get(Venue, booking.venue_id)
    is_owner_of_booking = str(booking.user_id) == str(current_user.user_id)
    is_venue_owner = (
        current_user.is_owner() and venue and str(venue.owner_id) == str(current_user.user_id)
    )
    if not (is_owner_of_booking or is_venue_owner or current_user.is_admin()):
        raise ForbiddenError("Not allowed to view these payments")
    rows = db.query(Payment).filter(Payment.booking_id == booking_id).all()
    return [
        PaymentResponse(
            id=str(p.id),
            booking_id=str(p.booking_id),
            amount_paise=p.amount_paise,
            currency=p.currency,
            status=p.status.value,
            stripe_payment_intent_id=p.stripe_payment_intent_id,
        )
        for p in rows
    ]


def get_owner_ledger_stats(db: Session, current_user: AuthContext) -> OwnerLedgerStatsResponse:
    if not current_user.is_owner():
        raise ForbiddenError("Must be a venue owner")

    entries = (
        db.query(
            LedgerEntry.entry_type,
            LedgerEntry.direction,
            func.sum(LedgerEntry.amount_paise).label("total"),
        )
        .filter(LedgerEntry.owner_id == current_user.user_id)
        .group_by(LedgerEntry.entry_type, LedgerEntry.direction)
        .all()
    )

    gross_volume = 0
    platform_fees = 0
    refunds_issued = 0
    payouts_completed = 0

    for entry_type, direction, total in entries:
        val = int(total or 0)
        if entry_type == "charge" and direction == "credit":
            gross_volume += val
        elif entry_type == "platform_fee" and direction == "debit":
            platform_fees += val
        elif entry_type == "refund" and direction == "debit":
            refunds_issued += val
        elif entry_type == "payout" and direction == "debit":
            payouts_completed += val

    net_revenue = gross_volume - platform_fees - refunds_issued
    available_balance = net_revenue - payouts_completed

    return OwnerLedgerStatsResponse(
        gross_volume_paise=gross_volume,
        platform_fees_paise=platform_fees,
        refunds_issued_paise=refunds_issued,
        net_revenue_paise=net_revenue,
        payouts_completed_paise=payouts_completed,
        available_balance_paise=available_balance,
    )


def list_owner_ledger_entries(
    db: Session,
    current_user: AuthContext,
    entry_type: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> LedgerListResponse:
    if not current_user.is_owner():
        raise ForbiddenError("Must be a venue owner")

    query = (
        db.query(LedgerEntry, Venue, Profile)
        .outerjoin(Venue, LedgerEntry.venue_id == Venue.id)
        .outerjoin(Profile, LedgerEntry.user_id == Profile.id)
        .filter(LedgerEntry.owner_id == current_user.user_id)
    )

    if entry_type and entry_type != "all":
        query = query.filter(LedgerEntry.entry_type == entry_type)

    total = query.count()
    total_pages = (total + per_page - 1) // per_page

    query = query.order_by(LedgerEntry.created_at.desc())
    results = query.offset((page - 1) * per_page).limit(per_page).all()

    responses = []
    for ledger, venue, profile in results:
        responses.append(
            LedgerEntryResponse(
                id=str(ledger.id),
                booking_id=str(ledger.booking_id),
                venue_id=str(ledger.venue_id),
                venue_name=venue.name if venue else None,
                user_full_name=profile.full_name if profile else None,
                entry_type=ledger.entry_type,
                amount_paise=ledger.amount_paise,
                direction=ledger.direction,
                stripe_pi_ref=ledger.stripe_pi_ref,
                created_at=ledger.created_at.isoformat(),
            )
        )
    return LedgerListResponse(
        items=responses,
        total=total,
        page=page,
        page_size=per_page,
        total_pages=total_pages,
    )


_PLATFORM_STATS_CACHE_KEY = "admin:financials:stats"
_PLATFORM_STATS_CACHE_TTL_SECONDS = 60


def get_platform_ledger_stats(db: Session) -> PlatformLedgerStatsResponse:
    """Admin-wide equivalent of get_owner_ledger_stats — same bucketing, no
    owner_id filter, so this sums across every venue/owner on the platform.

    TTL-only (no explicit invalidation): ledger rows are written from many
    call sites across the booking/payment lifecycle (webhook confirmations,
    cancellations, refunds, payouts), so exhaustively wiring invalidation at
    every write site isn't practical — a 60s-stale dashboard number is an
    acceptable tradeoff, same call made for booking/growth stats.
    """
    import json

    from app.core.cache import cache_get, cache_set

    cached = cache_get(_PLATFORM_STATS_CACHE_KEY)
    if cached is not None:
        return PlatformLedgerStatsResponse(**json.loads(cached))

    entries = (
        db.query(
            LedgerEntry.entry_type,
            LedgerEntry.direction,
            func.sum(LedgerEntry.amount_paise).label("total"),
        )
        .group_by(LedgerEntry.entry_type, LedgerEntry.direction)
        .all()
    )

    gross_volume = 0
    platform_fees = 0
    refunds_issued = 0
    payouts_completed = 0

    for entry_type, direction, total in entries:
        val = int(total or 0)
        if entry_type == "charge" and direction == "credit":
            gross_volume += val
        elif entry_type == "platform_fee" and direction == "debit":
            platform_fees += val
        elif entry_type == "refund" and direction == "debit":
            refunds_issued += val
        elif entry_type == "payout" and direction == "debit":
            payouts_completed += val

    result = PlatformLedgerStatsResponse(
        gross_volume_paise=gross_volume,
        platform_fees_paise=platform_fees,
        refunds_issued_paise=refunds_issued,
        payouts_completed_paise=payouts_completed,
    )
    cache_set(
        _PLATFORM_STATS_CACHE_KEY, result.model_dump_json(), _PLATFORM_STATS_CACHE_TTL_SECONDS
    )
    return result


def list_platform_ledger_entries(
    db: Session,
    entry_type: str | None = None,
    search: str | None = None,
    page: int = 1,
    per_page: int = 20,
) -> PlatformLedgerListResponse:
    """Admin-wide equivalent of list_owner_ledger_entries — no owner_id filter,
    plus an owner-name column (an admin needs to know WHICH owner, unlike the
    owner's own view of their own ledger) and a venue/owner name search.
    """
    from sqlalchemy.orm import aliased

    Owner = aliased(Profile)

    query = (
        db.query(LedgerEntry, Venue, Profile, Owner)
        .outerjoin(Venue, LedgerEntry.venue_id == Venue.id)
        .outerjoin(Profile, LedgerEntry.user_id == Profile.id)
        .outerjoin(Owner, LedgerEntry.owner_id == Owner.id)
    )

    if entry_type and entry_type != "all":
        query = query.filter(LedgerEntry.entry_type == entry_type)

    if search:
        safe = search.strip().replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
        pattern = f"%{safe}%"
        query = query.filter(Venue.name.ilike(pattern) | Owner.full_name.ilike(pattern))

    total = query.count()
    total_pages = (total + per_page - 1) // per_page

    query = query.order_by(LedgerEntry.created_at.desc())
    results = query.offset((page - 1) * per_page).limit(per_page).all()

    responses = [
        PlatformLedgerEntryResponse(
            id=str(ledger.id),
            booking_id=str(ledger.booking_id),
            venue_id=str(ledger.venue_id),
            venue_name=venue.name if venue else None,
            owner_id=str(ledger.owner_id),
            owner_name=owner.full_name if owner else None,
            user_full_name=user.full_name if user else None,
            entry_type=ledger.entry_type,
            amount_paise=ledger.amount_paise,
            direction=ledger.direction,
            stripe_pi_ref=ledger.stripe_pi_ref,
            created_at=ledger.created_at.isoformat(),
        )
        for ledger, venue, user, owner in results
    ]
    return PlatformLedgerListResponse(
        items=responses,
        total=total,
        page=page,
        page_size=per_page,
        total_pages=total_pages,
    )


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _succeeded_payments(db: Session, booking_id) -> list[Payment]:
    return (
        db.query(Payment)
        .filter(Payment.booking_id == booking_id, Payment.status == PaymentAttemptStatus.succeeded)
        .order_by(Payment.created_at.asc())
        .all()
    )


def _record_refund(
    db: Session, payment: Payment, booking: Booking, amount_paise: int, reason: str
) -> int:
    """Issue a Stripe refund and record it (refund row + ledger debit).

    Resilient: a Stripe failure records a `failed` Refund row and returns 0
    rather than raising (so a competitor-refund failure never rolls back the
    winner's confirmation). Idempotent: a payment that is not in `succeeded`
    state is skipped (prevents double refunds). Does NOT send notifications —
    the caller decides which message to send.
    """
    if amount_paise <= 0:
        return 0
    if payment.status != PaymentAttemptStatus.succeeded:
        logger.info(
            "refund skipped: payment %s not refundable (status=%s)", payment.id, payment.status
        )
        return 0

    stripe = get_stripe()
    try:
        refund = stripe.Refund.create(
            payment_intent=payment.stripe_payment_intent_id,
            amount=amount_paise,
            metadata={"booking_id": str(booking.id), "reason": reason},
        )
    except Exception:  # noqa: BLE001 — Stripe/network failure must not abort the txn
        logger.exception("Stripe refund failed for payment %s (booking %s)", payment.id, booking.id)
        db.add(
            Refund(
                payment_id=payment.id,
                booking_id=booking.id,
                amount_paise=amount_paise,
                reason=reason,
                status=RefundStatus.failed,
                stripe_refund_id=None,
            )
        )
        return 0

    db.add(
        Refund(
            payment_id=payment.id,
            booking_id=booking.id,
            amount_paise=amount_paise,
            reason=reason,
            status=RefundStatus.succeeded,
            stripe_refund_id=refund.id,
        )
    )
    # Mark the attempt refunded only when the whole captured amount is returned.
    if amount_paise >= payment.amount_paise:
        payment.status = PaymentAttemptStatus.refunded
    booking.refund_amount_paise = (booking.refund_amount_paise or 0) + amount_paise

    venue = db.get(Venue, booking.venue_id)
    owner_id = venue.owner_id if venue else booking.user_id
    db.add(
        LedgerEntry(
            booking_id=booking.id,
            venue_id=booking.venue_id,
            owner_id=owner_id,
            user_id=booking.user_id,
            entry_type="refund",
            amount_paise=amount_paise,
            direction="debit",
            stripe_pi_ref=payment.stripe_payment_intent_id,
        )
    )
    return amount_paise


def _find_competing_bookings(db: Session, booking: Booking) -> list[Booking]:
    """Other active bookings contending for the same slot.

    Overlap rule: same venue, still requested/owner_accepted, whose effective slot
    range intersects this booking's effective slot range.
    """
    slot = db.query(BookingSlot).filter(BookingSlot.booking_id == booking.id).first()
    if slot is None:
        return []
    return (
        db.query(Booking)
        .join(BookingSlot, BookingSlot.booking_id == Booking.id)
        .filter(
            Booking.id != booking.id,
            Booking.venue_id == booking.venue_id,
            Booking.status.in_(
                [
                    BookingStatus.requested,
                    BookingStatus.owner_accepted,
                    BookingStatus.payment_pending,
                ]
            ),
            BookingSlot.deleted_at.is_(None),
            BookingSlot.effective_starts_at < slot.effective_ends_at,
            BookingSlot.effective_ends_at > slot.effective_starts_at,
        )
        .with_for_update()
        .all()
    )


def _conflict_cancel(db: Session, competitor: Booking, venue: Venue | None) -> None:
    old = competitor.status
    if not can_transition(old, BookingStatus.conflict_cancelled):
        logger.warning(
            "skip conflict-cancel: illegal %s -> conflict_cancelled for booking %s",
            old,
            competitor.id,
        )
        return
    competitor.status = BookingStatus.conflict_cancelled
    competitor.cancelled_at = datetime.now(UTC)
    db.add(
        BookingStatusHistory(
            booking_id=competitor.id,
            old_status=old,
            new_status=BookingStatus.conflict_cancelled,
            reason="slot_confirmed_by_another",
        )
    )
    # Refund any captured payment; the conflict_canceled notice (below) already
    # tells the user their money was refunded, so no separate refund_issued.
    for paid in _succeeded_payments(db, competitor.id):
        _record_refund(db, paid, competitor, paid.amount_paise, "conflict_canceled")
    venue_name = venue.name if venue else "the venue"
    notifications.notify(
        db,
        competitor.user_id,
        "conflict_canceled",
        context={"venue_name": venue_name},
        booking_id=competitor.id,
    )


def _conflict_cancel_self_and_refund(db: Session, payment_intent_id: str) -> None:
    """The current booking lost the slot race — cancel it and refund this payment."""
    payment = (
        db.query(Payment)
        .filter(Payment.stripe_payment_intent_id == payment_intent_id)
        .with_for_update()
        .first()
    )
    if not payment:
        return
    booking = db.query(Booking).filter(Booking.id == payment.booking_id).with_for_update().first()
    if not booking:
        return
    venue = db.get(Venue, booking.venue_id)
    old = booking.status
    if not can_transition(old, BookingStatus.conflict_cancelled):
        logger.warning(
            "skip self conflict-cancel: illegal %s -> conflict_cancelled for booking %s",
            old,
            booking.id,
        )
        return
    booking.status = BookingStatus.conflict_cancelled
    booking.cancelled_at = datetime.now(UTC)
    db.add(
        BookingStatusHistory(
            booking_id=booking.id,
            old_status=old,
            new_status=BookingStatus.conflict_cancelled,
            reason="lost_slot_race",
        )
    )
    # This payment just succeeded but hasn't been marked succeeded yet — do so
    # so the refund guard recognises it as refundable.
    payment.status = PaymentAttemptStatus.succeeded
    _record_refund(db, payment, booking, payment.amount_paise, "lost_slot_race")
    venue_name = venue.name if venue else "the venue"
    notifications.notify(
        db,
        booking.user_id,
        "conflict_canceled",
        context={"venue_name": venue_name},
        booking_id=booking.id,
    )
