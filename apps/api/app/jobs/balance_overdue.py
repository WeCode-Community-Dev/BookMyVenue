import logging
from datetime import UTC, datetime, timedelta

from app.core.database import with_session
from app.modules.admin import settings_store
from app.modules.booking.models import (
    Booking,
    BookingStatus,
    BookingStatusHistory,
    PaymentStatus,
)
from app.modules.notification import service as notifications
from app.modules.venue.models import Venue

logger = logging.getLogger(__name__)

BATCH = 100


def run_flag() -> int:
    """Flag confirmed-but-balance-unpaid bookings whose balance due date has
    passed, opening the owner-action window (extend / forfeit / goodwill).
    """
    now = datetime.now(UTC)
    today = now.date()
    flagged = 0
    with with_session() as db:
        rows = (
            db.query(Booking)
            .filter(
                Booking.status == BookingStatus.confirmed,
                Booking.payment_status == PaymentStatus.advance_paid,
                Booking.balance_due_date.isnot(None),
                Booking.balance_due_date < today,
                Booking.balance_overdue_at.is_(None),
                Booking.deleted_at.is_(None),
            )
            .with_for_update(skip_locked=True)
            .limit(BATCH)
            .all()
        )
        default_window_hours = settings_store.get_setting(db, "balance_overdue_action_window_hours")
        for b in rows:
            venue = db.get(Venue, b.venue_id)
            window = venue.owner_action_window_hours if venue else default_window_hours
            b.balance_overdue_at = now
            b.owner_action_deadline = now + timedelta(hours=window)
            venue_name = venue.name if venue else "your venue"
            notifications.notify(
                db,
                b.user_id,
                "balance_overdue",
                context={"venue_name": venue_name},
                booking_id=b.id,
            )
            if venue:
                notifications.notify(
                    db,
                    venue.owner_id,
                    "balance_overdue",
                    context={"venue_name": venue_name},
                    booking_id=b.id,
                )
            flagged += 1
        logger.info("balance_overdue_flag: flagged %d booking(s)", flagged)
        return flagged


def run_autocancel() -> int:
    """Auto-cancel bookings whose owner-action window expired without the owner
    extending the deadline or otherwise acting on the overdue balance.

    The advance is NOT refunded here: the customer missed the balance deadline,
    so the advance is forfeited (this is a system cancel for non-payment, not an
    owner cancellation). Owner-initiated cancels still refund per their own paths.
    """
    now = datetime.now(UTC)
    cancelled = 0
    with with_session() as db:
        rows = (
            db.query(Booking)
            .filter(
                Booking.status == BookingStatus.confirmed,
                Booking.payment_status == PaymentStatus.advance_paid,
                Booking.balance_overdue_at.isnot(None),
                Booking.owner_action_deadline.isnot(None),
                Booking.owner_action_deadline < now,
                Booking.deleted_at.is_(None),
            )
            .with_for_update(skip_locked=True)
            .limit(BATCH)
            .all()
        )
        for b in rows:
            old = b.status
            b.status = BookingStatus.balance_overdue_cancelled
            b.cancelled_at = now
            if b.slot:
                b.slot.is_blocking = False
            db.add(
                BookingStatusHistory(
                    booking_id=b.id,
                    old_status=old,
                    new_status=BookingStatus.balance_overdue_cancelled,
                    reason="balance_overdue_autocancel_job",
                )
            )
            venue = db.get(Venue, b.venue_id)
            venue_name = venue.name if venue else "your venue"
            notifications.notify(
                db,
                b.user_id,
                "booking_canceled",
                context={"venue_name": venue_name},
                booking_id=b.id,
            )
            cancelled += 1
        logger.info("balance_overdue_autocancel: cancelled %d booking(s)", cancelled)
        return cancelled
