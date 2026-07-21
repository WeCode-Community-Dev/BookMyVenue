"""Builds the query string actually sent to internal retrieval
(/search/hybrid), from the LLM's structured breakdown rather than the raw
user sentence.

Why this exists: search_hybrid's FTS half uses plainto_tsquery, which ANDs
every lexeme together — a raw sentence like "best club venues in ernakulam"
requires "best" AND "club" AND "venue" AND "ernakulam" to all appear in a
venue's indexed text, so filler words alone can sink an otherwise-good match.
City/date/budget are already passed as separate structured filters (or
ignored, for hints hybrid search has no filter for), so they're dropped here
too — this function keeps only the words that are actually useful lexical/
semantic anchors: intent, venue type, and required amenities.
"""

from app.modules.deep_research.schemas import QueryUnderstanding


def build_internal_search_query(raw_query: str, breakdown: QueryUnderstanding) -> str:
    terms = [breakdown.intent, breakdown.venue_type, *breakdown.required_amenities]
    # dict.fromkeys dedupes while preserving first-seen order (e.g. intent and
    # venue_type are often the same phrase from the LLM).
    cleaned = " ".join(dict.fromkeys(t.strip() for t in terms if t and t.strip()))
    return cleaned or raw_query
