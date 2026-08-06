from django.urls import path

from bookings.views import (
    BookingDetailView,
    BookingListView,
    BookingSessionAbandonView,
    BookingStartView,
)

urlpatterns = [
    path("start/", BookingStartView.as_view(), name="booking-start"),
    path("abandon/", BookingSessionAbandonView.as_view(), name="booking-session-abandon"),
    path("", BookingListView.as_view(), name="booking-list"),
    path("<uuid:booking_id>/", BookingDetailView.as_view(), name="booking-detail"),
]
