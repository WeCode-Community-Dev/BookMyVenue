"""Detects which venue-category "intent" a search query implies, so hybrid
search can boost only the categories the query actually seems to be about
instead of always boosting wedding venues regardless of what was searched.

Deliberately simple: a token-overlap check against three small term sets.
Not a classifier — just enough to stop "rooftop party bangalore" from
getting a wedding-hall boost it has nothing to do with, and (as of this
version) to stop "corporate offsite bangalore" from boosting rooftop/resort
venues instead of the conference/meeting/auditorium venues it actually
means.

The boost *group names* (GROUP_WEDDING / GROUP_EVENT / GROUP_CORPORATE) are
the same strings stored in VenueCategory.search_boost_group — see
search_metadata_cache.py — so a category's DB tag and a query's detected
intent line up automatically.

The boost *magnitudes* live in settings so they can be tuned without a
deploy.
"""

from app.core.config import settings

# Must match the values used in VenueCategory.search_boost_group.
GROUP_WEDDING = "wedding_hall_banquet_hall"
GROUP_EVENT = "event_space_rooftop_resort_lawn"
GROUP_CORPORATE = "corporate_conference_meeting"  # conference_room, meeting_room, auditorium

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
# NOTE: "corporate"/"conference" used to live here, which meant a corporate
# offsite query was boosting resort/rooftop/lawn venues instead of the
# conference/meeting/auditorium venues it actually meant. Moved to
# _CORPORATE_INTENT_TERMS below.
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
    "dj",
    "sundowner",
}

# Terms that suggest the query is about formal corporate/institutional
# venues (conference rooms, meeting rooms, auditoriums).
_CORPORATE_INTENT_TERMS = {
    "corporate",
    "conference",
    "meeting",
    "boardroom",
    "seminar",
    "convocation",
    "offsite",
    "training",
    "workshop",
    "interview",
    "auditorium",
}

NO_BOOST = 1.00


def detect_category_intents(query: str) -> dict[str, float]:
    """Return the boost multiplier to apply per category group, based on
    whether the (normalized) query's tokens overlap with that group's terms.
    Groups with no signal in the query get a neutral 1.0 — i.e. no boost.
    """
    tokens = set(query.lower().split()) if query else set()

    wedding_boost = settings.search_wedding_boost if tokens & _WEDDING_INTENT_TERMS else NO_BOOST
    event_boost = settings.search_event_boost if tokens & _EVENT_INTENT_TERMS else NO_BOOST
    corporate_boost = (
        settings.search_corporate_boost if tokens & _CORPORATE_INTENT_TERMS else NO_BOOST
    )

    return {
        GROUP_WEDDING: wedding_boost,
        GROUP_EVENT: event_boost,
        GROUP_CORPORATE: corporate_boost,
    }
