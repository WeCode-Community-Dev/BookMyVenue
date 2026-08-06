import logging

from celery import shared_task

from bookings.services.booking_session_expiry_service import (
    BookingSessionExpiryService,
)

logger = logging.getLogger(__name__)


@shared_task(name="expire_booking_sessions")
def expire_booking_sessions() -> int:
    expired_count = BookingSessionExpiryService.expire_sessions()
    logger.info("Expired %s booking session(s).", expired_count)
    return expired_count
