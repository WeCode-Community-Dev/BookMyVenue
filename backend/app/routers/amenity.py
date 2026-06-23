from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.amenity import AmenityOut
from app.services.amenity_service import get_amenities

router = APIRouter(
    prefix="/amenities",
    tags=["Amenities"]
)

@router.get("/", response_model=list[AmenityOut])
def list_amenities(
    db: Session = Depends(get_db)
):
    return get_amenities(db)