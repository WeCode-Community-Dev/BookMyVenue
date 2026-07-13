from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_auth, require_owner
from app.modules.booking import service
from app.modules.booking.schemas import (
    BookingOut,
    BookingListResponse,
    BookingRequestIn,
    CancellationPreviewOut,
    ExtendDeadlineIn,
    OwnerRejectIn,
    UpdateOwnerNotesIn,
)

router = APIRouter()


@router.post("/", response_model=BookingOut, status_code=201)
def create_booking(
    body: BookingRequestIn,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    return service.create_booking_request(db, auth.user_id, body)


@router.get("/", response_model=list[BookingOut])
def list_my_bookings(
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    return service.list_user_bookings(db, auth.user_id)


@router.get("/owner", response_model=BookingListResponse)
def list_owner_bookings(
    tab: str | None = None,
    venue_id: str | None = None,
    search: str | None = None,
    page: int = 1,
    per_page: int = 20,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.list_all_owner_bookings(db, auth.user_id, tab, venue_id, search, page, per_page)


@router.get("/venues/{venue_id}/bookings", response_model=list[BookingOut])
def list_venue_bookings(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.list_venue_bookings(db, venue_id, auth.user_id)


@router.get("/venues/{venue_id}/bookings/pending", response_model=list[BookingOut])
def list_pending_venue_bookings(
    venue_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.list_venue_bookings(db, venue_id, auth.user_id, pending_only=True)


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(
    booking_id: UUID,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    return service.get_booking(db, booking_id, auth.user_id)


@router.get("/{booking_id}/cancellation-preview", response_model=CancellationPreviewOut)
def cancellation_preview(
    booking_id: UUID,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    return service.get_cancellation_preview(db, booking_id, auth.user_id)


@router.post("/{booking_id}/cancel", response_model=BookingOut)
def user_cancel_booking(
    booking_id: UUID,
    auth: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    return service.user_cancel_booking(db, booking_id, auth.user_id)


@router.post("/{booking_id}/accept", response_model=BookingOut)
def owner_accept_booking(
    booking_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.owner_accept_booking(db, booking_id, auth.user_id)


@router.post("/{booking_id}/reject", response_model=BookingOut)
def owner_reject_booking(
    booking_id: UUID,
    body: OwnerRejectIn,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.owner_reject_booking(db, booking_id, auth.user_id, body.reason)


@router.post("/{booking_id}/extend-balance-deadline", response_model=BookingOut)
def owner_extend_deadline(
    booking_id: UUID,
    body: ExtendDeadlineIn,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.owner_extend_deadline(db, booking_id, auth.user_id, body)


@router.post("/{booking_id}/cancel-forfeit", response_model=BookingOut)
def owner_cancel_forfeit(
    booking_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.owner_cancel_forfeit(db, booking_id, auth.user_id)


@router.post("/{booking_id}/cancel-goodwill", response_model=BookingOut)
def owner_cancel_goodwill(
    booking_id: UUID,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.owner_cancel_goodwill(db, booking_id, auth.user_id)


@router.patch("/{booking_id}/owner-notes", response_model=BookingOut)
def update_owner_notes(
    booking_id: UUID,
    body: UpdateOwnerNotesIn,
    auth: AuthContext = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.update_owner_notes(db, booking_id, auth.user_id, body.notes)
