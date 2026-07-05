"""Deep Research's query-understanding stage.

First step of the Deep Research pipeline (see docs/deep-research-architecture.md):
takes the user's free-text prompt and asks Groq to break it into structured
signals (intent, city, venue type, capacity, budget/date hints, amenities,
and any other requirements). This is deliberately separate from
app.modules.search.query_normalizer, which is a cheap fuzzy-typo corrector
with no LLM call — this stage is the new, LLM-backed layer that sits in
front of it.

The breakdown returned here is logged, then consumed by
app.modules.deep_research.service.run_search, which persists the query and
builds the internal /search/hybrid request from it (see query_enrichment.py).
"""

import json
import logging

from app.infrastructure.llm import groq
from app.modules.deep_research.prompts import QUERY_UNDERSTANDING_SYSTEM_PROMPT
from app.modules.deep_research.schemas import QueryUnderstanding

logger = logging.getLogger(__name__)


def understand_query(query: str) -> QueryUnderstanding:
    """Call Groq to break the raw query into structured signals, log the
    breakdown, and return it.

    Degrades to a raw-query-only breakdown (rather than raising) on any
    failure — missing/invalid GROQ_API_KEY, Groq outage, timeout, or an
    unparseable response — so a Groq problem takes down query understanding
    only, not the whole /deep-research/search request. Internal retrieval
    still runs on the raw query in that case; it just misses the structured
    city/capacity/amenity signals for this one search.
    """
    try:
        raw_content = groq.chat_completion(
            messages=[
                {"role": "system", "content": QUERY_UNDERSTANDING_SYSTEM_PROMPT},
                {"role": "user", "content": query},
            ]
        )
        parsed = json.loads(raw_content)
        breakdown = QueryUnderstanding(**parsed)
    except (json.JSONDecodeError, TypeError, ValueError):
        logger.warning(
            "deep_research.query_understanding: could not parse Groq response as JSON: %r",
            raw_content,
        )
        breakdown = QueryUnderstanding(intent=query)
    except Exception:
        logger.exception(
            "deep_research.query_understanding: Groq call failed for query=%r", query
        )
        breakdown = QueryUnderstanding(intent=query)

    logger.info(
        "deep_research.query_understanding: query=%r breakdown=%s",
        query,
        breakdown.model_dump(),
    )
    return breakdown
