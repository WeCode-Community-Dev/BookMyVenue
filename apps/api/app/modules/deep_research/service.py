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

from app.modules.deep_research.models import DeepResearchQuery
from app.modules.deep_research.query_enrichment import build_internal_search_query
from app.modules.deep_research.query_understanding import understand_query
from app.modules.deep_research.schemas import DeepResearchSearchResponse
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
