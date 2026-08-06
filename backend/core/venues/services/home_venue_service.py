from venues.filters import annotate_has_slots, annotate_min_price
from venues.models import Venue, VenueStatus


class HomeVenueService:
    DEFAULT_LIMIT = 12
    MAX_LIMIT = 50

    @classmethod
    def _eligible_base(cls):
        return Venue.objects.filter(
            is_active=True,
            status=VenueStatus.APPROVED,
        )

    @classmethod
    def _annotated_queryset(cls):
        return annotate_has_slots(
            annotate_min_price(
                cls._eligible_base()
                .select_related(
                    "category",
                    "city",
                    "city__district",
                    "owner",
                )
                .prefetch_related("images"),
            ),
        )

    @classmethod
    def list_venues(cls, *, limit: int = DEFAULT_LIMIT) -> list[Venue]:
        """Return diversified home venues: one newest per category, then fill.

        1. Pick the newest approved/active venue in each category.
        2. Keep up to ``limit`` of those picks, newest first.
        3. Fill remaining slots with other eligible venues by ``-created_at``.
        """
        try:
            limit = int(limit)
        except (TypeError, ValueError):
            limit = cls.DEFAULT_LIMIT
        limit = max(1, min(limit, cls.MAX_LIMIT))

        # Unannotated queryset: Django cannot combine annotate() with distinct(fields).
        category_pick_ids = list(
            cls._eligible_base()
            .order_by("category_id", "-created_at")
            .distinct("category_id")
            .values_list("pk", flat=True),
        )

        annotated = cls._annotated_queryset()
        category_picks = list(
            annotated.filter(pk__in=category_pick_ids).order_by("-created_at")[:limit],
        )
        selected_ids = [venue.pk for venue in category_picks]

        remaining = limit - len(selected_ids)
        if remaining <= 0:
            return category_picks

        fillers = list(
            annotated.exclude(pk__in=selected_ids).order_by("-created_at")[:remaining],
        )
        return category_picks + fillers
