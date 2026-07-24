import secrets

from sqlalchemy.orm import Session

from app.models.booking import Booking


def generate_check_in_token() -> str:
    return secrets.token_urlsafe(32)


def ensure_check_in_token(booking: Booking) -> str:
    if not booking.check_in_token:
        booking.check_in_token = generate_check_in_token()
    return booking.check_in_token
