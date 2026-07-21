from fastapi import APIRouter, Depends,Query
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.venue import VenueCreate,VenueUpdate, VenueOut
from app.services.venue_service import(
    create_venue,
    get_venues,
    get_venue_by_id,
    update_venue,
    delete_venue,
    get_my_venues,
    deactivate_venue

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
    return update_venue(
        db,
        venue_id,
        venue
    )

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
def check_availability(
    venue_id: int
):
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

