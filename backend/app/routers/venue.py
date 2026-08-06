from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.security import get_current_venue_owner
from app.db.deps import get_db
from app.models.user import User
from app.schemas.review import VenueReviewsOut
from app.schemas.venue import VenueCreate, VenueOut, VenueUpdate
from app.schemas.venue_image import VenueImageCreate, VenueImageOut, VenueImageUpdate
from app.services import venue_image_service
from app.services.review_service import get_reviews_for_venue
from app.services.venue_service import (
    check_availability,
    check_availability_range,
    create_venue,
    deactivate_venue,
    delete_venue,
    get_my_venues,
    get_venue_by_id,
    get_venues,
    update_venue,
)

router = APIRouter(prefix="/venues", tags=["Venues"])


def _parse_date(date_str: str):
    return datetime.strptime(date_str, "%Y-%m-%d").date()


def _parse_time(time_str: str):
    for fmt in ("%H:%M:%S", "%H:%M"):
        try:
            return datetime.strptime(time_str, fmt).time()
        except ValueError:
            continue
    raise ValueError


@router.get("/my-venues", response_model=list[VenueOut])
def list_my_venues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return get_my_venues(db, current_user)


@router.post("/", response_model=VenueOut, status_code=201)
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


@router.get("/{venue_id}/reviews", response_model=VenueReviewsOut)
def list_venue_reviews(
    venue_id: int,
    db: Session = Depends(get_db),
):
    return get_reviews_for_venue(db, venue_id)


@router.get("/{venue_id}", response_model=VenueOut)
def get_single_venue(
    venue_id: int,
    db: Session = Depends(get_db),
):
    return get_venue_by_id(db, venue_id)


@router.get("/{venue_id}/availability/range")
def venue_availability_range(
    venue_id: int,
    check_in_date: str = Query(..., description="Check-in date YYYY-MM-DD"),
    check_in_time: str = Query(..., description="Check-in time HH:MM or HH:MM:SS"),
    check_out_date: str = Query(..., description="Check-out date YYYY-MM-DD"),
    check_out_time: str = Query(..., description="Check-out time HH:MM or HH:MM:SS"),
    db: Session = Depends(get_db),
):
    try:
        parsed_check_in_date = _parse_date(check_in_date)
        parsed_check_out_date = _parse_date(check_out_date)
        parsed_check_in_time = _parse_time(check_in_time)
        parsed_check_out_time = _parse_time(check_out_time)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date or time format. Use YYYY-MM-DD and HH:MM",
        )

    return check_availability_range(
        db,
        venue_id,
        parsed_check_in_date,
        parsed_check_in_time,
        parsed_check_out_date,
        parsed_check_out_time,
    )


@router.get("/{venue_id}/availability")
def venue_availability(
    venue_id: int,
    booking_date: str = Query(..., description="Date in YYYY-MM-DD format"),
    time_slot: str = Query(..., description="Time in HH:MM or HH:MM:SS format"),
    db: Session = Depends(get_db),
):
    try:
        parsed_date = _parse_date(booking_date)
        parsed_time = _parse_time(time_slot)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date or time format. Use YYYY-MM-DD and HH:MM",
        )

    return check_availability(db, venue_id, parsed_date, parsed_time)


@router.put("/{venue_id}", response_model=VenueOut)
def update_existing_venue(
    venue_id: int,
    venue: VenueUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return update_venue(db, venue_id, venue, owner_id=current_user.id)


@router.get("/{venue_id}/images", response_model=list[VenueImageOut])
def list_venue_images(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    venue_image_service.get_owned_venue(db, venue_id, current_user.id)
    return venue_image_service.ordered_images(db, venue_id)


@router.post("/{venue_id}/images", response_model=list[VenueImageOut], status_code=201)
def add_venue_images(
    venue_id: int,
    payload: VenueImageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return venue_image_service.add_images(
        db,
        venue_id,
        current_user.id,
        payload.url_list(),
    )


@router.patch("/{venue_id}/images/{image_id}", response_model=list[VenueImageOut])
def update_venue_image(
    venue_id: int,
    image_id: int,
    payload: VenueImageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return venue_image_service.update_image(
        db,
        venue_id,
        image_id,
        current_user.id,
        is_cover=payload.is_cover,
        sort_order=payload.sort_order,
    )


@router.delete("/{venue_id}/images/{image_id}", response_model=list[VenueImageOut])
def delete_venue_image(
    venue_id: int,
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return venue_image_service.delete_image(db, venue_id, image_id, current_user.id)


@router.patch("/{venue_id}/deactivate")
def deactivate_existing_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return deactivate_venue(db, venue_id, current_user)


@router.delete("/{venue_id}")
def delete_existing_venue(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return delete_venue(db, venue_id, current_user)
