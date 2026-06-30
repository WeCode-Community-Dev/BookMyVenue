from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_owner
from app.db.session import get_db
from app.modules.users.model import User
from app.modules.venues import repository, service
from app.modules.venues.model import VenueStatus, VenueType
from app.modules.venues.schemas import (
    VenueCreate,
    VenueRead,
    VenueSearchParams,
    VenueUpdate,
)

router = APIRouter(tags=["venues"])


def _params(
    lat: float | None = None,
    lng: float | None = None,
    radius_km: float | None = None,
    type: VenueType | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    min_capacity: int | None = None,
    q: str | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
) -> VenueSearchParams:
    return VenueSearchParams(
        lat=lat,
        lng=lng,
        radius_km=radius_km,
        type=type,
        min_price=min_price,
        max_price=max_price,
        min_capacity=min_capacity,
        q=q,
        skip=skip,
        limit=limit,
    )


@router.get("/venues", response_model=list[VenueRead])
def search_venues(
    params: VenueSearchParams = Depends(_params),
    db: Session = Depends(get_db),
):
    return service.search(db, params)


@router.get("/venues/{venue_id}", response_model=VenueRead)
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    return service.get_public(db, venue_id)


owner_router = APIRouter(prefix="/owner", tags=["owner"])


@owner_router.post("/venues", response_model=VenueRead, status_code=201)
def create_venue(
    data: VenueCreate,
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.create(db, current_user.id, data)


@owner_router.get("/venues", response_model=list[VenueRead])
def list_my_venues(
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return service.list_for_owner(db, current_user.id)


@owner_router.put("/venues/{venue_id}", response_model=VenueRead)
def update_venue(
    venue_id: int,
    data: VenueUpdate,
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db),
):
    venue = repository.get_venue(db, venue_id)
    return service.update(db, venue, current_user.id, data)
