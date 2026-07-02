"""Lightweight typo correction for search queries.

Fuzzy-matches each token in the raw query against a fixed vocabulary of
domain terms (venue categories, wedding-related synonyms, common Indian
cities) and swaps in the closest match when confidence is high. This is
intentionally cheap and dependency-light — no ML, no external calls — just
a pre-processing pass before FTS/vector search runs.
"""

from rapidfuzz import fuzz, process

# Kept intentionally flat/simple. Extend as new categories, cities, or
# frequently-mistyped terms show up in query logs.
_VOCABULARY = [
    # categories
    "wedding hall",
    "banquet hall",
    "event space",
    "rooftop",
    "club",
    "resort",
    "lawn",
    "auditorium",
    # wedding-adjacent synonyms
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
    # common Indian cities relevant to this marketplace
    "bangalore",
    "bengaluru",
    "kochi",
    "kozhikode",
    "calicut",
    "malappuram",
    "chennai",
    "hyderabad",
    "mumbai",
    "delhi",
    "pune",
    "coimbatore",
    "trivandrum",
    "thiruvananthapuram",
    "mysore",
    "mangalore",
]

_MATCH_THRESHOLD = 85  # 0-100 rapidfuzz score; below this we keep the original token
_MIN_TOKEN_LEN = 3  # don't try to correct very short tokens (too noisy)


def normalize_query(q: str) -> str:
    """Fuzzy-correct likely typos in each token of a search query.

    Falls back to the original token whenever no confident vocabulary match
    is found, so this only ever tightens spelling — it never invents terms
    that weren't plausibly intended.
    """
    if not q or not q.strip():
        return q

    tokens = q.strip().split()
    corrected_tokens = []

    for token in tokens:
        if len(token) < _MIN_TOKEN_LEN:
            corrected_tokens.append(token)
            continue

        match = process.extractOne(token.lower(), _VOCABULARY, scorer=fuzz.ratio)
        if match and match[1] >= _MATCH_THRESHOLD:
            corrected_tokens.append(match[0])
        else:
            corrected_tokens.append(token)

    return " ".join(corrected_tokens)
