"""Detects which venue-category "intent" a search query implies, so hybrid
search can boost only the categories the query actually seems to be about
instead of always boosting wedding venues regardless of what was searched.

Deliberately simple: a token-overlap check against two small term sets. Not
a classifier — just enough to stop "rooftop party bangalore" from getting a
wedding-hall boost it has nothing to do with.
"""

# Terms that suggest the query is about wedding/marriage-function venues.
_WEDDING_INTENT_TERMS = {
    "wedding",
    "marriage",
    "reception",
    "mandap",
    "sadya",
    "kalyanam",
    "kalyana",
    "vivaham",
    "nikah",
    "shaadi",
    "shadi",
    "vivah",
    "engagement",
    "muhurtham",
    "sangeet",
    "mehendi",
    "haldi",
    "baraat",
    "banquet",
}

# Terms that suggest the query is about party/event-style venues
# (rooftop, club, resort, lawn, event_space).
_EVENT_INTENT_TERMS = {
    "party",
    "rooftop",
    "club",
    "nightclub",
    "lounge",
    "birthday",
    "anniversary",
    "celebration",
    "resort",
    "lawn",
    "getaway",
    "staycation",
    "event",
    "corporate",
    "conference",
    "dj",
    "sundowner",
}

WEDDING_BOOST = 1.85
EVENT_BOOST = 1.40
NO_BOOST = 1.00


def detect_category_intents(query: str) -> dict[str, float]:
    """Return the boost multiplier to apply per category group, based on
    whether the (normalized) query's tokens overlap with that group's terms.
    Groups with no signal in the query get a neutral 1.0 — i.e. no boost.
    """
    tokens = set(query.lower().split()) if query else set()

    wedding_boost = WEDDING_BOOST if tokens & _WEDDING_INTENT_TERMS else NO_BOOST
    event_boost = EVENT_BOOST if tokens & _EVENT_INTENT_TERMS else NO_BOOST

    return {
        "wedding_hall_banquet_hall": wedding_boost,
        "event_space_rooftop_resort_lawn": event_boost,
    }
