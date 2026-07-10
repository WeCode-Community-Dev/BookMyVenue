import logging
from datetime import UTC, datetime

from app.core.database import with_session
from app.modules.booking.models import (
    Booking,
    BookingSlot,
    BookingStatus,
    BookingStatusHistory,
    PaymentStatus,
)
from app.modules.notification import service as notifications
from app.modules.venue.models import Venue

logger = logging.getLogger(__name__)

BATCH = 100


def run() -> int:
    """Mark confirmed bookings completed once the event date has passed and no
    payment is pending. (Dispute/cancellation workflow checks go here too.)
    """
    now = datetime.now(UTC)
    completed = 0
    with with_session() as db:
        rows = (
            db.query(Booking)
            .join(BookingSlot, BookingSlot.booking_id == Booking.id)
            .filter(
                Booking.status == BookingStatus.confirmed,
                Booking.payment_status == PaymentStatus.fully_paid,
                Booking.deleted_at.is_(None),
                BookingSlot.deleted_at.is_(None),
                BookingSlot.effective_ends_at < now,
            )
            .with_for_update(skip_locked=True)
            .limit(BATCH)
            .all()
        )
        for b in rows:
            b.status = BookingStatus.completed
            b.completed_at = now
            if b.slot:
                b.slot.is_blocking = False
            db.add(
                BookingStatusHistory(
                    booking_id=b.id,
                    old_status=BookingStatus.confirmed,
                    new_status=BookingStatus.completed,
                    reason="booking_completion_job",
                )
            )
            venue = db.get(Venue, b.venue_id)
            venue_name = venue.name if venue else "your venue"
            notifications.notify(
                db,
                b.user_id,
                "booking_completed",
                context={"venue_name": venue_name},
                booking_id=b.id,
            )
            completed += 1
        logger.info("booking_completion: completed %d booking(s)", completed)
        return completed
