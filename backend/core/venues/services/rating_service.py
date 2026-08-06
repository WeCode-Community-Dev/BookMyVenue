from decimal import Decimal

from venues.models import Venue


class VenueNotFoundError(Exception):
    message = "Venue not found."


class VenueRatingService:
    @staticmethod
    def update_rating(
        *,
        venue_id: int,
        average_rating: Decimal,
        review_count: int,
    ) -> Venue:
        try:
            venue = Venue.objects.get(pk=venue_id)
        except Venue.DoesNotExist as exc:
            raise VenueNotFoundError from exc

        # Absolute values make retries idempotent: same payload → same state.
        if (
            venue.average_rating == average_rating
            and venue.review_count == review_count
        ):
            return venue

        venue.average_rating = average_rating
        venue.review_count = review_count
        venue.save(update_fields=["average_rating", "review_count", "updated_at"])
        return venue
