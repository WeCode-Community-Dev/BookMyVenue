"""Lightweight typo correction for search queries.

Fuzzy-matches each token in the raw query against a vocabulary of domain
terms and swaps in the closest match when confidence is high. Intentionally
cheap and dependency-light — no ML, no external calls — just a
pre-processing pass before FTS/vector search runs.

The vocabulary has two parts:
  - _STATIC_SYNONYMS: linguistic spelling variants (e.g. "shaadi"/"vivah")
    that aren't really DB data — these stay hardcoded since they're
    language, not content.
  - dynamic vocabulary: city names + category slugs/labels currently in the
    DB, injected at startup via set_dynamic_vocabulary() so new cities or
    categories don't require a code change. See
    search_metadata_cache.build_query_vocabulary() and main.py's lifespan.
"""

from rapidfuzz import fuzz, process

from app.core.config import settings

_STATIC_SYNONYMS = [
    "wedding",
    "marriage",
    "reception",
    "function",
    "mandap",
    "sadya",
    "kalyanam",
    "vivaham",
    "engagement",
    "muhurtham",
    "nikah",
    "shaadi",
    "mehendi",
    "sangeet",
    "baraat",
]

# Populated at startup from the DB — see set_dynamic_vocabulary().
_dynamic_vocabulary: list[str] = []


def set_dynamic_vocabulary(terms: list[str]) -> None:
    """Replace the DB-sourced portion of the vocabulary. Call once at
    startup (main.py's lifespan) and again whenever categories/cities
    change meaningfully, if you want that reflected without a restart."""
    global _dynamic_vocabulary
    _dynamic_vocabulary = terms


def _vocabulary() -> list[str]:
    return _STATIC_SYNONYMS + _dynamic_vocabulary


def normalize_query(q: str) -> str:
    """Fuzzy-correct likely typos in each token of a search query.

    Falls back to the original token whenever no confident vocabulary match
    is found, so this only ever tightens spelling — it never invents terms
    that weren't plausibly intended.
    """
    if not q or not q.strip():
        return q

    vocabulary = _vocabulary()
    if not vocabulary:
        # Dynamic vocabulary hasn't loaded yet (e.g. called before startup
        # finished) — fall back to the static synonym list only rather than
        # silently no-op'ing typo correction entirely.
        vocabulary = _STATIC_SYNONYMS

    tokens = q.strip().split()
    corrected_tokens = []

    for token in tokens:
        if len(token) < settings.search_normalizer_min_token_len:
            corrected_tokens.append(token)
            continue

        match = process.extractOne(token.lower(), vocabulary, scorer=fuzz.ratio)
        if match and match[1] >= settings.search_normalizer_match_threshold:
            corrected_tokens.append(match[0])
        else:
            corrected_tokens.append(token)

    return " ".join(corrected_tokens)
