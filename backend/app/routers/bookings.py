from fastapi import APIRouter, Depends, Header, Query, Response
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.deps import get_db
from app.models.user import User
from app.schemas.booking import (
    BookingCancelRequest,
    BookingCancelOut,
    BookingCreate,
    BookingDetailOut,
    BookingOut,
    PaginatedBookingsOut,
)
from app.services import booking_service

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", response_model=BookingOut)
def create_booking(
    data: BookingCreate,
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    idempotency_key: str = Header(..., alias="Idempotency-Key"),
):
    booking, created = booking_service.create_booking(
        db, current_user, data, idempotency_key
    )
    response.status_code = 201 if created else 200
    return booking


@router.get("/my-bookings", response_model=PaginatedBookingsOut)
def my_bookings(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return booking_service.get_my_bookings(db, current_user, page, limit, status)


@router.get("/{booking_id}", response_model=BookingDetailOut)
def booking_detail(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return booking_service.get_booking_detail(db, current_user, booking_id)


@router.patch("/{booking_id}/cancel", response_model=BookingCancelOut)
def cancel_booking(
    booking_id: int,
    data: BookingCancelRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reason = data.cancellation_reason if data else None
    return booking_service.cancel_booking(db, current_user, booking_id, reason)
