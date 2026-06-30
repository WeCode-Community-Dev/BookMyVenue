from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import require_owner, require_user
from app.core.exceptions import ConflictError
from app.db.session import get_db
from app.modules.bookings import repository
from app.modules.bookings.model import BookingStatus
from app.modules.bookings.schemas import (
    BookingCreate,
    BookingDecision,
    BookingRead,
)
from app.modules.users.model import User

router = APIRouter(tags=["bookings"])


def _enrich(booking, db: Session) -> BookingRead:  # noqa: ANN001
    from app.modules.venues.model import Venue

    read = BookingRead.model_validate(booking)
    venue = db.get(Venue, booking.venue_id)
    read.venue_name = venue.name if venue else None
    return read


@router.post("/bookings", response_model=BookingRead, status_code=201)
def create_booking(
    data: BookingCreate,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    booking = repository.create_booking(
        db, current_user.id, data.venue_id, data.start_at, data.end_at
    )
    return _enrich(booking, db)


@router.get("/bookings", response_model=list[BookingRead])
def my_bookings(
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    bookings = repository.list_user_bookings(db, current_user.id)
    return [_enrich(b, db) for b in bookings]


@router.post("/bookings/{booking_id}/cancel", response_model=BookingRead)
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    booking = repository.get_booking(db, booking_id)
    booking = repository.cancel_booking(db, booking, current_user.id)
    # Trigger mock refund if there was a payment
    from app.modules.payments import service as payments_service

    payments_service.refund_for_booking(db, booking.id)
    return _enrich(booking, db)


owner_bookings_router = APIRouter(prefix="/owner", tags=["owner"])


@owner_bookings_router.get("/bookings", response_model=list[BookingRead])
def owner_bookings(
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    bookings = repository.list_venue_owner_bookings(db, current_user.id)
    return [_enrich(b, db) for b in bookings]


@owner_bookings_router.patch("/bookings/{booking_id}", response_model=BookingRead)
def decide_booking(
    booking_id: int,
    data: BookingDecision,
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    if data.status not in (BookingStatus.confirmed, BookingStatus.declined):
        raise ConflictError("Decision must be confirmed or declined")
    booking = repository.get_booking(db, booking_id)
    booking = repository.decide_booking(db, booking, current_user.id, data.status == BookingStatus.confirmed)
    if booking.status == BookingStatus.confirmed:
        from app.modules.payments import service as payments_service

        payments_service.charge_for_booking(db, booking.id, booking.total_price)
    return _enrich(booking, db)
