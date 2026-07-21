from uuid import UUID

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import ForbiddenError, NotFoundError
from app.modules.auth.dependencies import AuthContext, require_auth
from app.modules.booking.models import Booking


def get_booking_or_404(
    booking_id: UUID,
    db: Session = Depends(get_db),
) -> Booking:
    booking = (
        db.query(Booking)
        .filter(
            Booking.id == booking_id,
            Booking.deleted_at.is_(None),
        )
        .first()
    )
    if not booking:
        raise NotFoundError("Booking not found")

    return booking


def require_booking_user(
    booking: Booking = Depends(get_booking_or_404),
    current_user: AuthContext = Depends(require_auth),
) -> Booking:
    if booking.user_id != current_user.user_id:
        raise ForbiddenError("Booking access denied")

    return booking


def require_booking_owner(
    booking: Booking = Depends(get_booking_or_404),
    current_user: AuthContext = Depends(require_auth),
) -> Booking:
    if booking.venue.owner_id != current_user.user_id:
        raise ForbiddenError("Booking owner access denied")

    return booking
