from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.modules.search.schemas import SearchResultPage


class QueryUnderstanding(BaseModel):
    intent: str
    city: str | None = None
    venue_type: str | None = None
    capacity: int | None = None
    budget_hint: str | None = None
    date_hint: str | None = None
    required_amenities: list[str] = []
    special_requirements: list[str] = []


class DeepResearchSearchRequest(BaseModel):
    query: str
    page: int = 1
    page_size: int = 20


class DeepResearchSearchResponse(BaseModel):
    query_id: UUID
    understanding: QueryUnderstanding
    internal_results: SearchResultPage


class TriggerExternalDiscoveryRequest(BaseModel):
    query_id: UUID
    latitude: float
    longitude: float


class ExternalLeadPublic(BaseModel):
    id: UUID
    name: str
    city: str | None = None
    formatted_address: str | None = None
    cover_photo_url: str | None = None
    category_guess: str | None = None
    source: str
    disclaimer: str = (
        "Not verified on Venue404. Reservation is a request only, subject to "
        "availability, and includes an additional platform fee."
    )


class ReserveLeadRequest(BaseModel):
    category_id: UUID
    event_date: str | None = None
    guest_count: int | None = None
    phone: str | None = None
    notes: str | None = None


class ReserveLeadResponse(BaseModel):
    reservation_id: UUID
    status: str


class UserReservationResponse(BaseModel):
    id: UUID
    lead: ExternalLeadPublic
    status: str
    event_date: str | None = None
    guest_count: int | None = None
    phone: str | None = None
    notes: str | None = None
    created_at: datetime
