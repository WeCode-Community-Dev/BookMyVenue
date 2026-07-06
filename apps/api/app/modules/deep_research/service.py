"""Deep Research Phase 1 orchestration: Query Understanding -> Internal
Retrieval (existing /search/hybrid) -> persisted query log (breakdown +
result summary, for the admin observability page).

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


_TOP_RESULTS_TRACKED = 5


def run_search(
    db: Session, user_id: UUID, query: str, page: int, page_size: int
) -> DeepResearchSearchResponse:
    breakdown = understand_query(query)

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

    match_scores = [r.match_score for r in internal_results.items if r.match_score is not None]
    avg_match_score = sum(match_scores) / len(match_scores) if match_scores else None
    top_results = [
        {
            "id": str(r.id),
            "name": r.name,
            "match_source": r.match_source,
            "match_score": r.match_score,
        }
        for r in internal_results.items[:_TOP_RESULTS_TRACKED]
    ]

    # Persisted once with everything already known, rather than inserted
    # then updated — this row is the only place the breakdown and match
    # scores are queryable after the fact (both are otherwise ephemeral:
    # logged text, or computed fresh per-request and discarded).
    research_query = DeepResearchQuery(
        user_id=user_id,
        query_text=query,
        city_filter=breakdown.city,
        understanding_json=breakdown.model_dump(),
        result_count=internal_results.total,
        avg_match_score=avg_match_score,
        top_results_json=top_results,
    )
    db.add(research_query)
    db.commit()
    db.refresh(research_query)

    return DeepResearchSearchResponse(
        query_id=research_query.id,
        understanding=breakdown,
        internal_results=internal_results,
    )
