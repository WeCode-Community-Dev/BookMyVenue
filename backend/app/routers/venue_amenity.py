from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
 
from app.db.deps import get_db
from app.schemas.amenity import AmenityOut
from app.services.venue_amenity_service import (
    add_amenity_to_venue,
    remove_amenity_from_venue,
)
from app.core.security import get_current_venue_owner
from app.models.user import User
router = APIRouter(
    prefix="/venue-amenities",
    tags=["Venue Amenities"]
)

@router.post("/{venue_id}/{amenity_id}", response_model=list[AmenityOut])
def link_amenity(
    venue_id: int,
    amenity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return add_amenity_to_venue(db, venue_id, amenity_id, current_user)
 
 
@router.delete("/{venue_id}/{amenity_id}", response_model=list[AmenityOut])
def unlink_amenity(
    venue_id: int,
    amenity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_venue_owner),
):
    return remove_amenity_from_venue(db, venue_id, amenity_id, current_user)