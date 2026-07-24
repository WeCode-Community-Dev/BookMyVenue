from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_venue_owner
from app.db.deps import get_db
from app.models.user import User
from app.schemas.venue import VenueCreate, VenueOut, VenueUpdate
from app.services.venue_service import (
    check_availability,
    create_venue,
    delete_venue,
    deactivate_venue,
    get_my_venues,
    get_venue,
    get_venues,
    get_pending_venues,
    update_venue,
)

router = APIRouter(prefix="/venues", tags=["Venues"])


@router.get("/my-venues", response_model=list[VenueOut])
def list_my_venues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return get_my_venues(db, current_user)


@router.get("/pending", response_model=list[VenueOut])
def list_pending_venues(
    db: Session = Depends(get_db),
):
    return get_pending_venues(db)


@router.post("/", response_model=VenueOut)
def create_new_venue(
    venue: VenueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return create_venue(db, venue, current_user)


@router.get("/", response_model=list[VenueOut])
def list_venues(
    location: str | None = Query(default=None, description="Filter by location"),
    search: str | None = Query(default=None, description="Search by venue name"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_venues(db, location=location, search=search, skip=skip, limit=limit)


@router.get("/{venue_id}", response_model=VenueOut)
def get_single_venue(
    venue_id: int,
    db: Session = Depends(get_db),
):
    return get_venue(db, venue_id)


@router.put("/{venue_id}", response_model=VenueOut)
def update_existing_venue(
    venue_id: int,
    venue: VenueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return update_venue(db, venue_id, venue, owner_id=current_user.id)


@router.delete("/{venue_id}")
def delete_existing_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return delete_venue(db, venue_id, current_user)


@router.patch("/{venue_id}/deactivate")
def deactivate_existing_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return deactivate_venue(db, venue_id, current_user)


@router.get("/{venue_id}/availability")
def venue_availability(
    venue_id: int,
    booking_date: str = Query(..., description="Date in YYYY-MM-DD format"),
    time_slot: str = Query(..., description="Time in HH:MM or HH:MM:SS format"),
    db: Session = Depends(get_db),
):
    try:
        parsed_date = datetime.strptime(booking_date, "%Y-%m-%d").date()
        for fmt in ("%H:%M:%S", "%H:%M"):
            try:
                parsed_time = datetime.strptime(time_slot, fmt).time()
                break
            except ValueError:
                continue
        else:
            raise ValueError
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date or time format. Use YYYY-MM-DD and HH:MM",
        )

    return check_availability(db, venue_id, parsed_date, parsed_time)