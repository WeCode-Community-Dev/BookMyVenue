from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import require_admin
from app.core.exceptions import ConflictError
from app.db.session import get_db
from app.modules.bookings.model import Booking
from app.modules.bookings.schemas import BookingRead
from app.modules.users.model import User
from app.modules.venues import repository as venues_repo
from app.modules.venues import service as venues_service
from app.modules.venues.model import VenueStatus
from app.modules.venues.schemas import VenueRead, VenueStatusUpdate

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/venues/pending", response_model=list[VenueRead])
def pending_venues(
    db: Session = Depends(get_db),
    _user: User = Depends(require_admin),
):
    return venues_repo.list_pending_venues(db)


@router.get("/venues", response_model=list[VenueRead])
def all_venues(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _user: User = Depends(require_admin),
):
    return venues_repo.list_all_venues(db, skip=skip, limit=limit)


@router.patch("/venues/{venue_id}", response_model=VenueRead)
def update_venue_status(
    venue_id: int,
    data: VenueStatusUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(require_admin),
):
    if data.status not in (VenueStatus.approved, VenueStatus.rejected):
        raise ConflictError("Admin can only set a venue to 'approved' or 'rejected'")
    venue = venues_repo.get_venue(db, venue_id)
    return venues_repo.set_venue_status(db, venue, data.status)


@router.get("/bookings", response_model=list[BookingRead])
def all_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _user: User = Depends(require_admin),
):
    stmt = select(Booking).order_by(Booking.created_at.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt))


@router.get("/venues/{venue_id}/approve", response_model=VenueRead)
def approve_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(require_admin),
):
    venue = venues_repo.get_venue(db, venue_id)
    return venues_service.approve(db, venue)


@router.get("/venues/{venue_id}/reject", response_model=VenueRead)
def reject_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(require_admin),
):
    venue = venues_repo.get_venue(db, venue_id)
    return venues_service.reject(db, venue)
