from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.deps import get_db
from app.models.user import User
from app.schemas.booking import (
    BookingCancelRequest,
    BookingCreate,
    BookingDetailOut,
    BookingOut,
    PaginatedBookings,
)
from app.services import booking_service

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", response_model=BookingOut, status_code=201)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return booking_service.create_booking(db, current_user, data)


@router.get("/my-bookings", response_model=PaginatedBookings)
def my_bookings(
    status: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return booking_service.get_my_bookings(
        db, current_user, status_filter=status, page=page, limit=limit
    )


@router.get("/{booking_id}", response_model=BookingDetailOut)
def booking_detail(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return booking_service.get_booking_detail(db, current_user, booking_id)


@router.patch("/{booking_id}/cancel", response_model=BookingOut)
def cancel_booking(
    booking_id: int,
    body: BookingCancelRequest | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reason = body.cancellation_reason if body else None
    return booking_service.cancel_booking(db, current_user, booking_id, reason)
