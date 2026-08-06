from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserRole
from bookings.exceptions import (
    BookingError,
    BookingNotFoundError,
    BookingSessionNotFoundError,
    InvalidBookingDateError,
    RazorpayOrderCreationError,
    ScheduleUnavailableError,
    SlotAlreadyBookedError,
    SlotLockedError,
    VenueNotAvailableError,
    VenueScheduleNotFoundError,
)
from bookings.serializers import (
    BookingDetailSerializer,
    BookingListSerializer,
    BookingOwnerListSerializer,
    BookingSessionAbandonSerializer,
    BookingStartResponseSerializer,
    BookingStartSerializer,
    BookingStatusUpdateSerializer,
)
from bookings.services.booking_service import BookingService

BOOKING_ERROR_STATUS = {
    BookingNotFoundError: status.HTTP_404_NOT_FOUND,
    BookingSessionNotFoundError: status.HTTP_404_NOT_FOUND,
    VenueScheduleNotFoundError: status.HTTP_404_NOT_FOUND,
    InvalidBookingDateError: status.HTTP_400_BAD_REQUEST,
    VenueNotAvailableError: status.HTTP_400_BAD_REQUEST,
    ScheduleUnavailableError: status.HTTP_400_BAD_REQUEST,
    SlotAlreadyBookedError: status.HTTP_409_CONFLICT,
    SlotLockedError: status.HTTP_409_CONFLICT,
    RazorpayOrderCreationError: status.HTTP_502_BAD_GATEWAY,
}


class BookingPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "limit"
    max_page_size = 100


class BookingSessionAbandonView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingSessionAbandonSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            BookingService.abandon_booking_session(
                booking_session_id=serializer.validated_data["booking_session_id"],
                user=request.user,
            )
        except BookingError as exc:
            return Response(
                {"message": exc.message},
                status=BOOKING_ERROR_STATUS.get(
                    type(exc),
                    status.HTTP_400_BAD_REQUEST,
                ),
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class BookingStartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = BookingService.start_booking(
                user=request.user,
                venue_schedule_id=serializer.validated_data["venue_schedule_id"],
                booking_date=serializer.validated_data["booking_date"],
            )
        except BookingError as exc:
            return Response(
                {"message": exc.message},
                status=BOOKING_ERROR_STATUS.get(
                    type(exc),
                    status.HTTP_400_BAD_REQUEST,
                ),
            )

        response_serializer = BookingStartResponseSerializer(result)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class BookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        mine = request.query_params.get("mine") == "true"
        venue_slug = request.query_params.get("venue") or None

        if mine:
            if user.role not in (UserRole.VENUE, UserRole.ADMIN):
                return Response(
                    {"message": "Only venue owners can list their bookings."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            queryset = BookingService.get_owner_bookings(
                user,
                venue_slug=venue_slug,
            )
            serializer_class = BookingOwnerListSerializer
        else:
            queryset = BookingService.get_user_bookings(user)
            serializer_class = BookingListSerializer

        paginator = BookingPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            booking = BookingService.get_booking_detail(
                booking_id=booking_id,
                user=request.user,
            )
        except BookingNotFoundError as exc:
            return Response(
                {"message": exc.message},
                status=BOOKING_ERROR_STATUS[type(exc)],
            )

        return Response(BookingDetailSerializer(booking).data)

    def patch(self, request, booking_id):
        try:
            booking = BookingService.get_booking_detail(
                booking_id=booking_id,
                user=request.user,
            )
        except BookingNotFoundError as exc:
            return Response(
                {"message": exc.message},
                status=BOOKING_ERROR_STATUS[type(exc)],
            )

        serializer = BookingStatusUpdateSerializer(
            data=request.data,
            context={"booking": booking},
        )
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(BookingDetailSerializer(booking).data)
