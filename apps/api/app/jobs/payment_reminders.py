import logging
from datetime import UTC, datetime, timedelta

from app.core.database import with_session
from app.modules.booking.models import Booking, BookingStatus
from app.modules.notification import service as notifications
from app.modules.notification.models import InAppNotification
from app.modules.venue.models import Venue

logger = logging.getLogger(__name__)

# The advance hold is only 24h, so reminders are keyed to the hold expiry, not
# days-before-event. Remind once when the hold is within this window of expiring.
REMINDER_BEFORE = timedelta(hours=12)
BATCH = 100


def run() -> int:
    """Remind accepted-but-unpaid users to pay the token advance before their
    24-hour hold expires. Deduped via the in-app notification row so a user gets
    at most one reminder per booking even if the job runs repeatedly.
    """
    now = datetime.now(UTC)
    sent = 0
    with with_session() as db:
        rows = (
            db.query(Booking)
            .filter(
                Booking.status == BookingStatus.owner_accepted,
                Booking.hold_expires_at.isnot(None),
                Booking.hold_expires_at > now,
                Booking.hold_expires_at <= now + REMINDER_BEFORE,
                Booking.deleted_at.is_(None),
            )
            .with_for_update(skip_locked=True)
            .limit(BATCH)
            .all()
        )
        for b in rows:
            already = (
                db.query(InAppNotification)
                .filter(
                    InAppNotification.booking_id == b.id,
                    InAppNotification.type == "payment_reminder",
                )
                .first()
            )
            if already:
                continue
            venue = db.get(Venue, b.venue_id)
            venue_name = venue.name if venue else "your venue"
            hours_left = max(0, int((b.hold_expires_at - now).total_seconds() // 3600))
            notifications.notify(db, b.user_id, "payment_reminder",
                                 context={"venue_name": venue_name, "hours_left": hours_left},
                                 booking_id=b.id)
            sent += 1
        logger.info("payment_reminders: sent %d reminder(s)", sent)
        return sent
