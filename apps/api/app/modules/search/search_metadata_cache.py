"""In-memory cache of search-relevant metadata, populated from the DB at
app startup (and reloadable on demand from the admin routes).

This exists to kill three copies of the same information that used to live
as hardcoded Python literals:
  - indexer.py's per-slug keyword-expansion dict
  - service.py's SQL boost CASE slug lists
  - query_normalizer.py's hardcoded city/category vocabulary

Now there's one source of truth: VenueCategory.search_boost_group and
VenueCategory.search_keywords columns (admin-editable), plus the distinct
city/slug values already in the venues/venue_categories tables.

Requires two new columns on VenueCategory — see the accompanying migration
`XXXX_add_search_metadata_to_venue_categories.py`:
    search_boost_group: str | None   # e.g. "wedding_hall_banquet_hall"
    search_keywords:    str | None   # space-separated synonym string
"""

import logging
from threading import Lock

from sqlalchemy.orm import Session

from app.modules.venue.models import Venue, VenueCategory

logger = logging.getLogger(__name__)

_lock = Lock()
_boost_groups: dict[str, str] = {}
_keywords: dict[str, str] = {}
_loaded = False


def load_category_metadata(db: Session) -> None:
    """Populate the boost-group / keyword cache from the DB. Call once at
    startup, and again whenever a category's search metadata is edited via
    the admin routes (call reload from there rather than waiting for a
    restart)."""
    global _boost_groups, _keywords, _loaded

    categories = db.query(VenueCategory).all()
    boost_groups = {c.slug: c.search_boost_group for c in categories if c.search_boost_group}
    keywords = {c.slug: c.search_keywords for c in categories if c.search_keywords}

    with _lock:
        _boost_groups = boost_groups
        _keywords = keywords
        _loaded = True

    logger.info(
        "search_metadata_cache: loaded %d categories (%d with boost group, %d with keywords)",
        len(categories),
        len(boost_groups),
        len(keywords),
    )


def boost_group_for(slug: str | None) -> str | None:
    if not slug:
        return None
    return _boost_groups.get(slug)


def keywords_for(slug: str | None) -> str | None:
    if not slug:
        return None
    return _keywords.get(slug)


def slugs_in_group(group: str) -> list[str]:
    """Slugs tagged with a given boost group, e.g. all slugs tagged
    'wedding_hall_banquet_hall'. Used to build the SQL boost CASE at query
    time instead of a hardcoded IN (...) list."""
    return [slug for slug, g in _boost_groups.items() if g == group]


def is_loaded() -> bool:
    return _loaded


def build_query_vocabulary(db: Session) -> list[str]:
    """Distinct city names + category labels/slugs currently in the DB,
    for the query normalizer's fuzzy-match vocabulary. Combine this with a
    small static list of linguistic synonyms (spelling variants like
    "shaadi"/"vivah") that aren't really DB data — that part stays in
    query_normalizer.py.
    """
    cities = [
        row[0]
        for row in db.query(Venue.city).distinct().filter(Venue.city.isnot(None)).all()
        if row[0]
    ]
    categories = db.query(VenueCategory).all()
    category_terms: list[str] = []
    for c in categories:
        category_terms.append(c.slug.replace("_", " "))
        if c.label:
            category_terms.append(c.label.lower())

    vocabulary = sorted({t.lower() for t in cities + category_terms if t})
    logger.info("search_metadata_cache: built %d dynamic vocabulary terms", len(vocabulary))
    return vocabulary
