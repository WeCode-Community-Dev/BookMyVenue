from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import enforce_daily_limit, enforce_per_minute_limit
from app.modules.auth.dependencies import AuthContext, require_auth
from app.modules.deep_research import service
from app.modules.deep_research.schemas import (
    DeepResearchSearchRequest,
    DeepResearchSearchResponse,
    ExternalLeadPublic,
    ReserveLeadRequest,
    ReserveLeadResponse,
    TriggerExternalDiscoveryRequest,
    UserReservationResponse,
)

router = APIRouter()


@router.post("/search", response_model=DeepResearchSearchResponse)
def search(
    body: DeepResearchSearchRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
    enforce_per_minute_limit(auth.user_id, "deep_research")
    enforce_daily_limit(auth.user_id, "deep_research", settings.deep_research_daily_limit)
    return service.run_search(db, auth.user_id, body.query, body.page, body.page_size)


@router.post("/external", response_model=list[ExternalLeadPublic])
async def trigger_external(
    body: TriggerExternalDiscoveryRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
    """
    Async endpoint: awaits Google Places + concurrent Cloudinary uploads,
    then returns all discovered leads in one response. No jobs, no polling.
    """
    enforce_per_minute_limit(auth.user_id, "deep_research_external")
    return await service.run_external_discovery(db, body.query_id, body.latitude, body.longitude)


@router.post("/leads/{lead_id}/reserve", response_model=ReserveLeadResponse)
def reserve(
    lead_id: UUID,
    body: ReserveLeadRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
    reservation = service.reserve_lead(
        db,
        lead_id,
        auth.user_id,
        body.category_id,
        body.event_date,
        body.guest_count,
        body.phone,
        body.notes,
    )
    return ReserveLeadResponse(reservation_id=reservation.id, status=reservation.status.value)


@router.get("/reservations", response_model=list[UserReservationResponse])
def get_reservations(
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
    return service.get_user_reservations(db, auth.user_id)
