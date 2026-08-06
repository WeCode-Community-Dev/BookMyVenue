from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.venue_type import VenueTypeOut
from app.services.venue_type_service import get_venue_types

router = APIRouter(
    prefix="/venue-types",
    tags=["Venue Types"]
)

@router.get("/", response_model=list[VenueTypeOut])
def list_venue_types(
    db: Session = Depends(get_db)
):
    return get_venue_types(db)