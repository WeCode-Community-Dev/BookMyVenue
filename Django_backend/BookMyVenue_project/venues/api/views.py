from django.db.models import Prefetch
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.generics import ListCreateAPIView, RetrieveDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.permissions import BasePermission

from ..models import Booking, Favorite, Venue, VenuePackage, VenueUnavailablePeriod
from .pagination import FeaturedVenuePagination, VenuePagination
from .serializers import (
    BookingSerializer,
    FavoriteSerializer,
    VenueDetailSerializer,
    VenueListSerializer,
    VenueUnavailablePeriodSerializer,
)


class IsVenueUser(BasePermission):
    message = "Only venue-user accounts can create booking requests."

    def has_permission(self, request, view):
        return request.user.account_type == "venue_user"


class VenueListAPIView(ListAPIView):
    serializer_class = VenueListSerializer
    permission_classes = [AllowAny]
    pagination_class = VenuePagination

    queryset = (
        Venue.objects
        .filter(status=Venue.Status.APPROVED)
        .prefetch_related("amenities", "images")
    )


class FeaturedVenueListAPIView(ListAPIView):
    serializer_class = VenueListSerializer
    permission_classes = [AllowAny]
    pagination_class = FeaturedVenuePagination

    queryset = (
        Venue.objects
        .filter(status=Venue.Status.APPROVED, is_featured=True)
        .prefetch_related("amenities", "images")
        .order_by("name")
    )


class VenueDetailAPIView(RetrieveAPIView):
    serializer_class = VenueDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    queryset = (
        Venue.objects
        .filter(status=Venue.Status.APPROVED)
        .prefetch_related(
            "amenities",
            "images",
            Prefetch(
                "packages",
                queryset=VenuePackage.objects.filter(is_active=True),
            ),
        )
    )


class VenueUnavailablePeriodListAPIView(ListAPIView):
    serializer_class = VenueUnavailablePeriodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return VenueUnavailablePeriod.objects.filter(
            venue__slug=self.kwargs["slug"],
            venue__status=Venue.Status.APPROVED,
        )


class FavoriteListCreateAPIView(ListCreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Favorite.objects
            .filter(user=self.request.user)
            .select_related("venue")
            .prefetch_related("venue__amenities", "venue__images")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoriteDetailAPIView(RetrieveDestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Favorite.objects
            .filter(user=self.request.user)
            .select_related("venue")
            .prefetch_related("venue__amenities", "venue__images")
        )


class BookingListCreateAPIView(ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsVenueUser]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(user=self.request.user)
            .select_related("venue")
            .prefetch_related("venue__amenities", "venue__images")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
