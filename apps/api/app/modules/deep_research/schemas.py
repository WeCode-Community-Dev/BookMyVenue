from typing import Optional, Literal
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel

from app.modules.search.schemas import SearchResult
from app.shared.pagination import Page


class QueryUnderstanding(BaseModel):
    intent: str
    city: Optional[str] = None
    venue_type: Optional[str] = None
    capacity: Optional[int] = None
    budget_hint: Optional[str] = None
    date_hint: Optional[str] = None
    required_amenities: list[str] = []
    special_requirements: list[str] = []


class DeepResearchSearchRequest(BaseModel):
    query: str
    page: int = 1
    page_size: int = 20


class DeepResearchSearchResponse(BaseModel):
    query_id: UUID
    understanding: QueryUnderstanding
    internal_results: Page[SearchResult]


class TriggerExternalDiscoveryRequest(BaseModel):
    query_id: UUID
    latitude: float   # from browser geolocation, sent only at this step
    longitude: float


class ExternalDiscoveryJobResponse(BaseModel):
    job_id: UUID
    status: Literal["pending", "processing", "completed", "failed"]


class ExternalLeadPublic(BaseModel):
    id: UUID
    name: str
    city: Optional[str] = None
    formatted_address: Optional[str] = None
    cover_photo_url: Optional[str] = None
    category_guess: Optional[str] = None
    source: str
    disclaimer: str = (
        "Not verified on Venue404. Reservation is a request only, subject to "
        "availability, and includes an additional platform fee."
    )


class ExternalDiscoveryJobResult(BaseModel):
    job_id: UUID
    status: str
    leads: list[ExternalLeadPublic] = []
    error_message: Optional[str] = None


class ReserveLeadRequest(BaseModel):
    event_date: Optional[str] = None
    guest_count: Optional[int] = None
    phone: Optional[str] = None
    notes: Optional[str] = None


class ReserveLeadResponse(BaseModel):
    reservation_id: UUID
    status: str

class UserReservationResponse(BaseModel):
    id: UUID
    lead: ExternalLeadPublic
    status: str
    event_date: Optional[str] = None
    guest_count: Optional[int] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

