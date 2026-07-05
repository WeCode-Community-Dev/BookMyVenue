from django.urls import path

from .views import (
    BookingListCreateAPIView,
    FavoriteDetailAPIView,
    FavoriteListCreateAPIView,
    FeaturedVenueListAPIView,
    VenueDetailAPIView,
    VenueListAPIView,
    VenueUnavailablePeriodListAPIView,
)


app_name = "venues_api"


urlpatterns = [
    path(
        "venues/",
        VenueListAPIView.as_view(),
        name="venue-list",
    ),
    path(
        "venues/featured/",
        FeaturedVenueListAPIView.as_view(),
        name="featured-venue-list",
    ),
    path(
        "venues/<slug:slug>/",
        VenueDetailAPIView.as_view(),
        name="venue-detail",
    ),
    path(
        "venues/<slug:slug>/unavailable-periods/",
        VenueUnavailablePeriodListAPIView.as_view(),
        name="venue-unavailable-period-list",
    ),
    path(
        "bookings/",
        BookingListCreateAPIView.as_view(),
        name="booking-list",
    ),
    path(
        "favorites/",
        FavoriteListCreateAPIView.as_view(),
        name="favorite-list",
    ),
    path(
        "favorites/<int:pk>/",
        FavoriteDetailAPIView.as_view(),
        name="favorite-detail",
    ),
]
