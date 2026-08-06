from django.urls import path

from venues.internal.views import InternalVenueRatingView

urlpatterns = [
    path(
        "venues/<int:venue_id>/rating",
        InternalVenueRatingView.as_view(),
        name="internal-venue-rating",
    ),
]
