import logging
from datetime import UTC, datetime, timedelta

from app.core.database import with_session
from app.modules.booking.models import Booking, BookingStatus, BookingStatusHistory
from app.modules.notification import service as notifications
from app.modules.venue.models import Venue

logger = logging.getLogger(__name__)

STALE_AFTER = timedelta(days=7)
BATCH = 100


def run() -> int:
    """Auto-expire booking requests that have been pending (requested) for 7 days."""
    now = datetime.now(UTC)
    cutoff = now - STALE_AFTER
    expired = 0
    with with_session() as db:
        rows = (
            db.query(Booking)
            .filter(
                Booking.status == BookingStatus.requested,
                Booking.requested_at < cutoff,
                Booking.deleted_at.is_(None),
            )
            .with_for_update(skip_locked=True)
            .limit(BATCH)
            .all()
        )
        for b in rows:
            b.status = BookingStatus.request_expired
            b.expired_at = now
            db.add(BookingStatusHistory(
                booking_id=b.id, old_status=BookingStatus.requested,
                new_status=BookingStatus.request_expired, reason="stale_requests_job",
            ))
            venue = db.get(Venue, b.venue_id)
            venue_name = venue.name if venue else "the venue"
            notifications.notify(db, b.user_id, "request_expired",
                                 context={"venue_name": venue_name}, booking_id=b.id)
            expired += 1
        logger.info("stale_requests: expired %d request(s)", expired)
        return expired
