from django.urls import path

from venues.views import (
    ImageUploadView,
    VenueActiveStatusView,
    VenueAvailabilityView,
    VenueCategoryListView,
    VenueCityListView,
    VenueCreateView,
    VenueDetailView,
    VenueDistrictListView,
    VenueLocationGroupListView,
    VenueListCreateView,
    VenueScheduleGroupDetailView,
    VenueScheduleGroupListCreateView,
    VenueScheduleOverrideDetailView,
    VenueScheduleOverrideListCreateView,
    VenueSlotAvailabilityCheckView,
)

urlpatterns = [
    path("categories", VenueCategoryListView.as_view(), name="venue-categories"),
    path("districts", VenueDistrictListView.as_view(), name="venue-districts"),
    path("cities", VenueCityListView.as_view(), name="venue-cities"),
    path("location-groups", VenueLocationGroupListView.as_view(), name="venue-location-groups"),
    path("", VenueListCreateView.as_view(), name="venue-list-create"),
    path("add", VenueCreateView.as_view(), name="venue-add"),
    path(
        "<slug:slug>/schedule-groups/",
        VenueScheduleGroupListCreateView.as_view(),
        name="venue-schedule-group-list-create",
    ),
    path(
        "<slug:slug>/schedule-groups/<int:group_id>/",
        VenueScheduleGroupDetailView.as_view(),
        name="venue-schedule-group-detail",
    ),
    path(
        "<slug:slug>/schedule-overrides/",
        VenueScheduleOverrideListCreateView.as_view(),
        name="venue-schedule-override-list-create",
    ),
    path(
        "<slug:slug>/schedule-overrides/<int:override_id>/",
        VenueScheduleOverrideDetailView.as_view(),
        name="venue-schedule-override-detail",
    ),
    path(
        "<slug:slug>/availability/check/",
        VenueSlotAvailabilityCheckView.as_view(),
        name="venue-slot-availability-check",
    ),
    path(
        "<slug:slug>/availability/",
        VenueAvailabilityView.as_view(),
        name="venue-availability",
    ),
    path(
        "<slug:slug>/active/",
        VenueActiveStatusView.as_view(),
        name="venue-active-status",
    ),
    path("<slug:slug>/", VenueDetailView.as_view(), name="venue-detail"),
]
