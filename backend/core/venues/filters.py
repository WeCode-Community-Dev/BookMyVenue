from decimal import Decimal, InvalidOperation

from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.contrib.postgres.search import TrigramWordSimilarity
from django.db import connection
from django.db.models import Case, Exists, IntegerField, Min, OuterRef, Q, Value, When
from rest_framework.filters import OrderingFilter

from venues.models import City, VenueSchedule

DEFAULT_NEARBY_RADIUS_KM = 75

# Minimum pg_trgm word-similarity for a venue to be considered a match.
# 0.3 is PostgreSQL's default similarity threshold and tolerates minor typos.
VENUE_SEARCH_SIMILARITY_THRESHOLD = 0.3


def apply_venue_search(queryset, search):
    """Filter venues by name.

    On PostgreSQL this uses pg_trgm word similarity for typo-tolerant fuzzy
    matching (backed by the ``ix_venues_name_trgm`` GIN index) combined with a
    plain substring match so exact matches are never missed. On other backends
    (e.g. SQLite in local dev) it falls back to a case-insensitive substring
    match.

    Returns a tuple of ``(queryset, ordered_by_relevance)`` where the second
    value indicates whether the queryset carries a ``name_similarity``
    annotation that can be used to rank results by relevance.
    """
    if not search:
        return queryset, False

    if connection.vendor == "postgresql":
        queryset = queryset.annotate(
            name_similarity=TrigramWordSimilarity(search, "name"),
        ).filter(
            Q(name__icontains=search)
            | Q(name_similarity__gte=VENUE_SEARCH_SIMILARITY_THRESHOLD),
        )
        return queryset, True

    return queryset.filter(name__icontains=search), False


class VenueFilterBackend:
    def filter_queryset(self, request, queryset):
        category_id = request.query_params.get("category_id")
        if category_id:
            queryset = queryset.filter(category_id=category_id)

        min_price = _parse_decimal(request.query_params.get("min_price"))
        if min_price is not None:
            queryset = queryset.filter(min_price__gte=min_price)

        max_price = _parse_decimal(request.query_params.get("max_price"))
        if max_price is not None:
            queryset = queryset.filter(min_price__lte=max_price)

        return queryset


class VenueOrderingFilter(OrderingFilter):
    ordering_fields = ["min_price", "created_at", "name", "capacity"]
    ordering = ["-created_at"]


def annotate_min_price(queryset):
    return queryset.annotate(
        min_price=Min(
            "schedule_groups__schedules__price",
            filter=Q(
                schedule_groups__is_active=True,
                schedule_groups__schedules__is_available=True,
            ),
        ),
    )


def annotate_has_slots(queryset):
    return queryset.annotate(
        has_slots=Exists(
            VenueSchedule.objects.filter(
                group__venue=OuterRef("pk"),
                group__is_active=True,
            ),
        ),
    )


def _parse_radius_km(value):
    if value in (None, ""):
        return DEFAULT_NEARBY_RADIUS_KM
    try:
        radius = float(value)
    except (TypeError, ValueError):
        return DEFAULT_NEARBY_RADIUS_KM
    return radius if radius > 0 else DEFAULT_NEARBY_RADIUS_KM


def apply_city_location_filter(queryset, city_id, radius_km=None):
    """
    When a city is selected:
    1. Include venues in that exact city (priority 0).
    2. Include venues in other cities within radius_km, ordered by distance.
    """
    try:
        city_pk = int(city_id)
    except (TypeError, ValueError):
        return queryset, None

    city = City.objects.filter(pk=city_pk).first()
    if city is None:
        return queryset.none(), None

    if city.location is None:
        queryset = queryset.filter(city_id=city_pk)
        queryset = queryset.annotate(
            location_priority=Value(0, output_field=IntegerField()),
        )
        return queryset, "exact_only"

    ref = city.location
    radius = D(km=_parse_radius_km(radius_km))

    # Geographic PointField (SRID 4326) does not support DWithin with km/m;
    # annotate Distance and filter with distance__lte instead.
    queryset = queryset.filter(
        Q(city_id=city_pk) | Q(city__location__isnull=False),
    ).annotate(
        location_priority=Case(
            When(city_id=city_pk, then=Value(0)),
            default=Value(1),
            output_field=IntegerField(),
        ),
        distance=Distance("city__location", ref),
    ).filter(
        Q(city_id=city_pk) | Q(distance__lte=radius),
    )
    return queryset, "distance"


def filter_venue_list(queryset, request):
    search = request.query_params.get("search")
    if search is not None:
        search = search.strip()
    queryset, relevance_ordering = apply_venue_search(queryset, search)

    queryset = VenueFilterBackend().filter_queryset(request, queryset)

    city_id = request.query_params.get("city_id")
    location_order_mode = None
    if city_id:
        queryset, location_order_mode = apply_city_location_filter(
            queryset,
            city_id,
            radius_km=request.query_params.get("radius_km"),
        )

    ordering_filter = VenueOrderingFilter()
    has_explicit_ordering = bool(
        (request.query_params.get(ordering_filter.ordering_param) or "").strip(),
    )
    secondary_ordering = ordering_filter.get_ordering(
        request,
        queryset,
        _ListFilterView(),
    )
    if not secondary_ordering:
        secondary_ordering = VenueOrderingFilter.ordering

    if location_order_mode == "distance":
        return queryset.order_by(
            "location_priority",
            "distance",
            *secondary_ordering,
        )
    if location_order_mode == "exact_only":
        return queryset.order_by("location_priority", *secondary_ordering)

    # When a search term drives the results and the caller has not asked for a
    # specific ordering, surface the closest name matches first.
    if relevance_ordering and not has_explicit_ordering:
        return queryset.order_by("-name_similarity", *secondary_ordering)

    return ordering_filter.filter_queryset(
        request,
        queryset,
        _ListFilterView(),
    )


class _ListFilterView:
    ordering_fields = VenueOrderingFilter.ordering_fields
    ordering = VenueOrderingFilter.ordering


def _parse_decimal(value: str | None) -> Decimal | None:
    if value in (None, ""):
        return None
    try:
        return Decimal(value)
    except (InvalidOperation, TypeError):
        return None
