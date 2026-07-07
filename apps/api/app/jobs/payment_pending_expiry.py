import logging
from datetime import datetime, timezone

from app.core.database import with_session
from app.modules.booking.models import Booking, BookingStatus, PaymentStatus, BookingStatusHistory
from app.modules.venue.models import Venue
from app.modules.notification import service as notifications

logger = logging.getLogger(__name__)

BATCH = 100


def run() -> int:
    """Cancel bookings whose 15-minute payment pending window has expired."""
    now = datetime.now(timezone.utc)
    with with_session() as db:
        rows = (
            db.query(Booking)
            .filter(
                Booking.status == BookingStatus.payment_pending,
                Booking.payment_expires_at.isnot(None),
                Booking.payment_expires_at < now,
                Booking.deleted_at.is_(None),
            )
            .with_for_update(skip_locked=True)
            .limit(BATCH)
            .all()
        )
        for b in rows:
            b.status = BookingStatus.hold_expired
            b.payment_status = PaymentStatus.unpaid
            b.expired_at = now
            if b.slot:
                b.slot.is_blocking = False
            db.add(BookingStatusHistory(
                booking_id=b.id, old_status=BookingStatus.payment_pending,
                new_status=BookingStatus.hold_expired, reason="payment_pending_expiry_job",
            ))
            venue = db.get(Venue, b.venue_id)
            venue_name = venue.name if venue else "your venue"
            notifications.notify(db, b.user_id, "hold_expired",
                                 context={"venue_name": venue_name}, booking_id=b.id)
        logger.info("payment_pending_expiry: expired %d booking(s)", len(rows))
        return len(rows)
