"""Deep Research Phase 1 orchestration: Query Understanding -> persisted
query log -> Internal Retrieval (existing /search/hybrid).

External discovery (external_venue_leads), Candidate Union, Dedup, and the
Business Score Booster (see docs/DEEP-RESEARCH-PRD.md Phase 2) only apply
once there's a second candidate source to merge against — they are not part
of this internal-only path and are triggered separately once the user asks
to search externally.
"""

from uuid import UUID

from sqlalchemy.orm import Session

from app.modules.deep_research.models import DeepResearchQuery, ExternalDiscoveryRequest, ExternalVenueLead, LeadReservation
from app.modules.deep_research.query_enrichment import build_internal_search_query
from app.modules.deep_research.query_understanding import understand_query
from app.modules.deep_research.schemas import DeepResearchSearchResponse, ExternalLeadPublic
from app.modules.search import service as search_service
from app.modules.search.schemas import SearchParams


def run_search(
    db: Session, user_id: UUID, query: str, page: int, page_size: int
) -> DeepResearchSearchResponse:
    breakdown = understand_query(query)

    research_query = DeepResearchQuery(
        user_id=user_id,
        query_text=query,
        city_filter=breakdown.city,
    )
    db.add(research_query)
    db.commit()
    db.refresh(research_query)

    # venue_type from the LLM breakdown is a free-text label (e.g. "marriage
    # hall"), not a VenueCategory slug — passing it as a hard filter would
    # zero out results on an exact-match miss. City and capacity are safe,
    # unambiguous filters; venue-type intent is instead picked up softly by
    # search_hybrid's category-boost logic from the enriched query text.
    search_params = SearchParams(
        q=build_internal_search_query(query, breakdown),
        city=breakdown.city or "",
        capacity=breakdown.capacity or 0,
        page=page,
        page_size=page_size,
    )
    internal_results = search_service.search_hybrid(db, search_params)

    return DeepResearchSearchResponse(
        query_id=research_query.id,
        understanding=breakdown,
        internal_results=internal_results,
    )


def _to_public_lead(lead: ExternalVenueLead) -> ExternalLeadPublic:
    return ExternalLeadPublic(id=lead.id, name=lead.name, city=lead.city, category_guess=lead.category_guess, source=lead.source)


def trigger_external_discovery(db: Session, query_id: UUID, latitude: float, longitude: float):
    from app.modules.deep_research.jobs import ENTITY_TYPE, OPERATION
    from app.modules.search.models import SearchIndexJob  # CONFIRM path

    ctx = ExternalDiscoveryRequest(query_id=query_id, latitude=latitude, longitude=longitude)
    db.add(ctx)

    job = SearchIndexJob(entity_type=ENTITY_TYPE, entity_id=query_id, operation=OPERATION, status="pending")
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_discovery_job_result(db: Session, job_id: UUID):
    from app.modules.search.models import SearchIndexJob

    job = db.get(SearchIndexJob, job_id)
    if job is None:
        return None
    leads = []
    if job.status == "completed":
        rows = db.query(ExternalVenueLead).filter(ExternalVenueLead.discovered_via_query_id == job.entity_id).all()
        leads = [_to_public_lead(l) for l in rows]
    return job, leads


def reserve_lead(db: Session, lead_id: UUID, user_id: UUID, event_date=None, notes=None) -> LeadReservation:
    from app.modules.deep_research.external_source import external_source

    lead = db.get(ExternalVenueLead, lead_id)
    if lead is None:
        raise ValueError(f"No lead found for id={lead_id}")

    if not lead.raw_contact_info:
        details = external_source.place_details(lead.source_ref)
        lead.raw_contact_info = {
            "phone": details.get("internationalPhoneNumber"),
            "website": details.get("websiteUri"),
            "formatted_address": details.get("formattedAddress"),
        }

    reservation = LeadReservation(lead_id=lead.id, user_id=user_id, platform_fee_paise=50000, event_date=event_date, notes=notes)
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation
