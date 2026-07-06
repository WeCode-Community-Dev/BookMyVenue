from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_auth
from app.modules.deep_research import service
from app.modules.deep_research.schemas import (
    DeepResearchSearchRequest, DeepResearchSearchResponse,
    TriggerExternalDiscoveryRequest, ExternalDiscoveryJobResponse,
    ExternalDiscoveryJobResult, ReserveLeadRequest, ReserveLeadResponse,
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


@router.post("/external", response_model=ExternalDiscoveryJobResponse)
def trigger_external(
    body: TriggerExternalDiscoveryRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
    job = service.trigger_external_discovery(db, body.query_id, body.latitude, body.longitude)
    return ExternalDiscoveryJobResponse(job_id=job.id, status=job.status)


@router.get("/external/{job_id}", response_model=ExternalDiscoveryJobResult)
def poll_external(job_id: UUID, db: Session = Depends(get_db), auth: AuthContext = Depends(require_auth)):
    result = service.get_discovery_job_result(db, job_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Job not found")
    job, leads = result
    return ExternalDiscoveryJobResult(job_id=job.id, status=job.status, leads=leads, error_message=job.error_message)


@router.post("/leads/{lead_id}/reserve", response_model=ReserveLeadResponse)
def reserve(
    lead_id: UUID, body: ReserveLeadRequest,
    db: Session = Depends(get_db), auth: AuthContext = Depends(require_auth),
):
    reservation = service.reserve_lead(db, lead_id, auth.user_id, body.event_date, body.guest_count, body.phone, body.notes)
    return ReserveLeadResponse(reservation_id=reservation.id, status=reservation.status.value)

@router.get("/reservations", response_model=list[UserReservationResponse])
def get_reservations(
    db: Session = Depends(get_db), auth: AuthContext = Depends(require_auth)
):
    return service.get_user_reservations(db, auth.user_id)

