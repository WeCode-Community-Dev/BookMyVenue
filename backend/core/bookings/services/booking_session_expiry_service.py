from django.db import transaction
from django.utils import timezone

from bookings.models import (
    BookingAuditEvent,
    BookingAuditLog,
    BookingSession,
    BookingSessionStatus,
)


class BookingSessionExpiryService:
    @staticmethod
    def expire_sessions() -> int:
        now = timezone.now()
        expired_count = 0

        while True:
            with transaction.atomic():
                session = (
                    BookingSession.objects.select_for_update(skip_locked=True)
                    .filter(
                        status=BookingSessionStatus.ACTIVE,
                        expires_at__lte=now,
                    )
                    .order_by("expires_at")
                    .first()
                )
                if session is None:
                    break

                session.status = BookingSessionStatus.EXPIRED
                session.lock_released_at = now
                session.save(
                    update_fields=["status", "lock_released_at", "updated_at"],
                )

                BookingAuditLog.objects.create(
                    booking_session=session,
                    event=BookingAuditEvent.LOCK_EXPIRED,
                    description=(
                        f"Booking lock expired for {session.booking_date} "
                        f"on schedule {session.venue_schedule_id}."
                    ),
                )

                expired_count += 1

        return expired_count
