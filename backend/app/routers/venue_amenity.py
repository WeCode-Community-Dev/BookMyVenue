from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.services.venue_amenity_service import (
    add_amenity_to_venue
)

router = APIRouter(
    prefix="/venue-amenities",
    tags=["Venue Amenities"]
)

@router.post("/{venue_id}/{amenity_id}")
def link_amenity(
    venue_id: int,
    amenity_id: int,
    db: Session = Depends(get_db)
):
    return add_amenity_to_venue(
        db,
        venue_id,
        amenity_id
    )