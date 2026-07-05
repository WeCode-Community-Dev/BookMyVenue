"""Deep Research's query-understanding stage.

First step of the Deep Research pipeline (see docs/deep-research-architecture.md):
takes the user's free-text prompt and asks Groq to break it into structured
signals (intent, city, venue type, capacity, budget/date hints, amenities,
and any other requirements). This is deliberately separate from
app.modules.search.query_normalizer, which is a cheap fuzzy-typo corrector
with no LLM call — this stage is the new, LLM-backed layer that sits in
front of it.

For this first slice the breakdown is only logged and returned to the
caller — it does not yet feed into /search/hybrid or get persisted.
"""

import json
import logging

from app.infrastructure.llm import groq
from app.modules.deep_research.prompts import QUERY_UNDERSTANDING_SYSTEM_PROMPT
from app.modules.deep_research.schemas import QueryUnderstanding

logger = logging.getLogger(__name__)


def understand_query(query: str) -> QueryUnderstanding:
    """Call Groq to break the raw query into structured signals, log the
    breakdown, and return it."""
    raw_content = groq.chat_completion(
        messages=[
            {"role": "system", "content": QUERY_UNDERSTANDING_SYSTEM_PROMPT},
            {"role": "user", "content": query},
        ]
    )

    try:
        parsed = json.loads(raw_content)
        breakdown = QueryUnderstanding(**parsed)
    except (json.JSONDecodeError, TypeError, ValueError):
        logger.warning(
            "deep_research.query_understanding: could not parse Groq response as JSON: %r",
            raw_content,
        )
        breakdown = QueryUnderstanding(intent=query)

    logger.info(
        "deep_research.query_understanding: query=%r breakdown=%s",
        query,
        breakdown.model_dump(),
    )
    return breakdown
