from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_auth
from app.modules.deep_research import service
from app.modules.deep_research.schemas import (
    DeepResearchSearchRequest, DeepResearchSearchResponse,
    TriggerExternalDiscoveryRequest, ExternalLeadPublic,
    ReserveLeadRequest, ReserveLeadResponse,
    UserReservationResponse,
)

router = APIRouter()


@router.post("/search", response_model=DeepResearchSearchResponse)
def search(
    body: DeepResearchSearchRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
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
    return await service.run_external_discovery(
        db, body.query_id, body.latitude, body.longitude
    )


@router.post("/leads/{lead_id}/reserve", response_model=ReserveLeadResponse)
def reserve(
    lead_id: UUID,
    body: ReserveLeadRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
    reservation = service.reserve_lead(
        db, lead_id, auth.user_id, body.event_date, body.guest_count, body.phone, body.notes
    )
    return ReserveLeadResponse(reservation_id=reservation.id, status=reservation.status.value)


@router.get("/reservations", response_model=list[UserReservationResponse])
def get_reservations(
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
    return service.get_user_reservations(db, auth.user_id)
