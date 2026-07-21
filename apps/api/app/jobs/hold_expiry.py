import logging
from datetime import UTC, datetime

from app.core.database import with_session
from app.modules.booking.models import Booking, BookingStatus, BookingStatusHistory, PaymentStatus
from app.modules.notification import service as notifications
from app.modules.venue.models import Venue

logger = logging.getLogger(__name__)

BATCH = 100


def run() -> int:
    """Cancel bookings whose 24-hour advance payment window has expired."""
    now = datetime.now(UTC)
    with with_session() as db:
        rows = (
            db.query(Booking)
            .filter(
                Booking.status == BookingStatus.owner_accepted,
                Booking.hold_expires_at.isnot(None),
                Booking.hold_expires_at < now,
                Booking.deleted_at.is_(None),
            )
            .with_for_update(skip_locked=True)
            .limit(BATCH)
            .all()
        )
        for b in rows:
            b.status = BookingStatus.hold_expired
            b.payment_status = PaymentStatus.unpaid
            b.amount_paid_paise = 0
            b.refund_amount_paise = 0
            b.stripe_advance_payment_intent_id = None
            b.expired_at = now
            if b.slot:
                b.slot.is_blocking = False
            db.add(
                BookingStatusHistory(
                    booking_id=b.id,
                    old_status=BookingStatus.owner_accepted,
                    new_status=BookingStatus.hold_expired,
                    reason="hold_expiry_job",
                )
            )
            venue = db.get(Venue, b.venue_id)
            venue_name = venue.name if venue else "your venue"
            notifications.notify(
                db, b.user_id, "hold_expired", context={"venue_name": venue_name}, booking_id=b.id
            )
        db.commit()
        logger.info("hold_expiry: expired %d booking(s)", len(rows))
        return len(rows)
