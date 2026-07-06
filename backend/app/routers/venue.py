from fastapi import APIRouter, Depends,Query
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.venue import VenueCreate,VenueUpdate, VenueOut
from app.models.venue import Venue
from app.services.venue_service import(
    create_venue,
    get_venues,
    get_venue_by_id,
    update_venue,
    delete_venue,
    get_my_venues,

)
from app.core.security import get_current_venue_owner
from app.models.user import User


router = APIRouter(prefix="/venues", tags=["Venues"])

@router.get("/my-venues", response_model=list[VenueOut])
def list_my_venues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):

    return get_my_venues(db, current_user)




@router.get("/pending", response_model=list[VenueOut])
def list_pending_venues(
    db: Session = Depends(get_db)
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
    skip: int = Query(default=0),
    limit: int = Query(default=10),
    db: Session = Depends(get_db)
):
    return get_venues(
        db,
        location=location,
        search=search,
        skip=skip,
        limit=limit
    )

@router.get("/{venue_id}", response_model=VenueOut)
def get_single_venue(
    venue_id: int,
    db: Session = Depends(get_db)
):
    return get_venue_by_id(db, venue_id)


@router.put("/{venue_id}", response_model=VenueOut)
def update_existing_venue(
    venue_id: int,
    venue: VenueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    """Update a venue (owner only - can only update own venues)"""
    return update_venue(
        db,
        venue_id,
        venue,
        owner_id=current_user.id
    )

@router.delete("/{venue_id}")
def delete_existing_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    """Delete a venue (owner only - can only delete own venues)"""
    return delete_venue(
        db,
        venue_id,
        owner_id=current_user.id
    )


@router.get("/{venue_id}/availability")
def check_availability(
    venue_id: int,
    booking_date: str = Query(..., description="Date in YYYY-MM-DD format"),
    time_slot: str = Query(..., description="Time in HH:MM:SS format"),
    db: Session = Depends(get_db)
):
    """
    Check if a venue is available for a specific date and time.
    Returns available=False if there's already a booking (excluding cancelled ones).
    """
    from datetime import datetime
    from app.models.booking import Booking
    
    # Parse the date and time
    try:
        parsed_date = datetime.strptime(booking_date, "%Y-%m-%d").date()
        parsed_time = datetime.strptime(time_slot, "%H:%M:%S").time()
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400,
            detail="Invalid date or time format. Use YYYY-MM-DD for date and HH:MM:SS for time"
        )
    
    # Check if venue exists
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Venue not found")
    
    # Check for existing bookings (excluding cancelled)
    existing_booking = db.query(Booking).filter(
        Booking.venue_id == venue_id,
        Booking.booking_date == parsed_date,
        Booking.time_slot == parsed_time,
        Booking.status != "cancelled"
    ).first()
    
    return {
        "venue_id": venue_id,
        "available": True
    }

@router.put("/{venue_id}/approve", response_model=VenueOut)
def approve_existing_venue(
    venue_id: int,
    db: Session = Depends(get_db)
):
    return approve_venue(
        db,
        venue_id
    )

