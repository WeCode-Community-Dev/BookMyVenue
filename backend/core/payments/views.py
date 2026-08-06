from datetime import datetime

from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import UserRole
from bookings.exceptions import (
    BookingError,
    BookingSessionExpiredError,
    BookingSessionNotActiveError,
    BookingSessionNotFoundError,
    InvalidPaymentSignatureError,
    InvalidPaymentStatusError,
    PaymentAlreadyProcessedError,
    PaymentNotFoundError,
    PaymentNotSuccessfulError,
    SlotAlreadyBookedError,
)
from bookings.models import BookingSession
from bookings.services.payment_service import PaymentService

from payments.serializers import (
    OwnerTransactionSerializer,
    OwnerTransactionSummarySerializer,
    PaymentVerificationResponseSerializer,
    PaymentVerificationSerializer,
)

PAYMENT_ERROR_STATUS = {
    BookingSessionNotFoundError: status.HTTP_404_NOT_FOUND,
    PaymentNotFoundError: status.HTTP_404_NOT_FOUND,
    BookingSessionExpiredError: status.HTTP_400_BAD_REQUEST,
    BookingSessionNotActiveError: status.HTTP_400_BAD_REQUEST,
    InvalidPaymentSignatureError: status.HTTP_400_BAD_REQUEST,
    InvalidPaymentStatusError: status.HTTP_400_BAD_REQUEST,
    PaymentNotSuccessfulError: status.HTTP_400_BAD_REQUEST,
    PaymentAlreadyProcessedError: status.HTTP_409_CONFLICT,
    SlotAlreadyBookedError: status.HTTP_409_CONFLICT,
}


class TransactionPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "limit"
    max_page_size = 100


class OwnerTransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        mine = request.query_params.get("mine") == "true"

        if not mine:
            return Response(
                {"message": "Use ?mine=true to list your transactions."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.role not in (UserRole.VENUE, UserRole.ADMIN):
            return Response(
                {"message": "Only venue owners can list their transactions."},
                status=status.HTTP_403_FORBIDDEN,
            )

        venue_slug = request.query_params.get("venue") or None
        payment_status = request.query_params.get("status") or None
        date_from = self._parse_date(request.query_params.get("date_from"))
        date_to = self._parse_date(request.query_params.get("date_to"))

        if request.query_params.get("date_from") and date_from is None:
            return Response(
                {"message": "Invalid date_from. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if request.query_params.get("date_to") and date_to is None:
            return Response(
                {"message": "Invalid date_to. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = PaymentService.get_owner_payments(
            user,
            venue_slug=venue_slug,
            status=payment_status,
            date_from=date_from,
            date_to=date_to,
        )

        summary = PaymentService.get_owner_payment_summary(
            user,
            venue_slug=venue_slug,
        )

        paginator = TransactionPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = OwnerTransactionSerializer(page, many=True)
        response = paginator.get_paginated_response(serializer.data)
        response.data["summary"] = OwnerTransactionSummarySerializer(summary).data
        return response

    @staticmethod
    def _parse_date(value: str | None):
        if not value:
            return None
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            return None


class PaymentVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PaymentVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = serializer.validated_data

        session_exists = BookingSession.objects.filter(
            pk=validated["booking_session_id"],
            user=request.user,
        ).exists()
        if not session_exists:
            return Response(
                {"message": "Booking session not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            booking = PaymentService.verify_payment(
                booking_session_id=validated["booking_session_id"],
                razorpay_order_id=validated["razorpay_order_id"],
                razorpay_payment_id=validated["razorpay_payment_id"],
                razorpay_signature=validated["razorpay_signature"],
            )
        except BookingError as exc:
            return Response(
                {"message": exc.message},
                status=PAYMENT_ERROR_STATUS.get(
                    type(exc),
                    status.HTTP_400_BAD_REQUEST,
                ),
            )

        response_serializer = PaymentVerificationResponseSerializer(booking)
        return Response(response_serializer.data, status=status.HTTP_200_OK)
