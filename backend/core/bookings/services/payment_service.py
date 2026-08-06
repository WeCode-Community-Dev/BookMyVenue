from datetime import date
from decimal import Decimal
from uuid import UUID

import razorpay
from django.db import transaction
from django.db.models import Count, Q, Sum
from django.utils import timezone

from bookings.exceptions import (
    BookingSessionNotFoundError,
    InvalidPaymentSignatureError,
    InvalidPaymentStatusError,
    PaymentAlreadyProcessedError,
    PaymentNotFoundError,
)
from bookings.models import Booking, BookingSession, Payment, PaymentStatus
from bookings.services.booking_service import BookingService
from bookings.services.razorpay_service import RazorpayService


class PaymentService:
    @staticmethod
    def get_owner_payments(
        user,
        *,
        venue_slug: str | None = None,
        status: str | None = None,
        date_from: date | None = None,
        date_to: date | None = None,
    ):
        queryset = (
            Payment.objects.filter(
                booking_session__venue_schedule__group__venue__owner=user,
            )
            .select_related(
                "booking_session",
                "booking_session__user",
                "booking_session__venue_schedule",
                "booking_session__venue_schedule__group",
                "booking_session__venue_schedule__group__venue",
                "booking",
            )
            .order_by("-created_at")
        )

        if venue_slug:
            queryset = queryset.filter(
                booking_session__venue_schedule__group__venue__slug=venue_slug,
            )

        if status:
            queryset = queryset.filter(status=status.upper())

        if date_from:
            queryset = queryset.filter(created_at__date__gte=date_from)

        if date_to:
            queryset = queryset.filter(created_at__date__lte=date_to)

        return queryset

    @staticmethod
    def get_owner_payment_summary(user, *, venue_slug: str | None = None):
        queryset = Payment.objects.filter(
            booking_session__venue_schedule__group__venue__owner=user,
        )

        if venue_slug:
            queryset = queryset.filter(
                booking_session__venue_schedule__group__venue__slug=venue_slug,
            )

        now = timezone.now()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        aggregates = queryset.aggregate(
            total_collected=Sum(
                "amount",
                filter=Q(status=PaymentStatus.SUCCESS),
            ),
            collected_this_month=Sum(
                "amount",
                filter=Q(
                    status=PaymentStatus.SUCCESS,
                    verified_at__gte=month_start,
                ),
            ),
            successful_count=Count("id", filter=Q(status=PaymentStatus.SUCCESS)),
            pending_count=Count("id", filter=Q(status=PaymentStatus.ORDER_CREATED)),
            failed_count=Count("id", filter=Q(status=PaymentStatus.FAILED)),
            refunded_total=Sum(
                "amount",
                filter=Q(status=PaymentStatus.REFUNDED),
            ),
            transaction_count=Count("id"),
        )

        return {
            "total_collected": aggregates["total_collected"] or Decimal("0"),
            "collected_this_month": aggregates["collected_this_month"] or Decimal("0"),
            "successful_count": aggregates["successful_count"] or 0,
            "pending_count": aggregates["pending_count"] or 0,
            "failed_count": aggregates["failed_count"] or 0,
            "refunded_total": aggregates["refunded_total"] or Decimal("0"),
            "transaction_count": aggregates["transaction_count"] or 0,
        }

    @staticmethod
    def verify_payment(
        booking_session_id: UUID,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> Booking:
        session = (
            BookingSession.objects.select_related("payment")
            .filter(pk=booking_session_id)
            .first()
        )
        if session is None:
            raise BookingSessionNotFoundError("Booking session not found.")

        try:
            payment = session.payment
        except Payment.DoesNotExist as exc:
            raise PaymentNotFoundError(
                "Payment not found for this booking session.",
            ) from exc

        PaymentService._validate_payment_status(payment)

        PaymentService._verify_razorpay_signature(
            razorpay_order_id=razorpay_order_id,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_signature=razorpay_signature,
        )

        with transaction.atomic():
            payment = Payment.objects.select_for_update().get(pk=payment.pk)
            PaymentService._validate_payment_status(payment)

            now = timezone.now()
            payment.status = PaymentStatus.SUCCESS
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            payment.verified_at = now
            payment.save(
                update_fields=[
                    "status",
                    "razorpay_payment_id",
                    "razorpay_signature",
                    "verified_at",
                    "updated_at",
                ],
            )

            return BookingService.complete_booking(session.id)

    @staticmethod
    def _validate_payment_status(payment: Payment) -> None:
        if payment.status == PaymentStatus.SUCCESS:
            raise PaymentAlreadyProcessedError(
                "Payment has already been processed.",
            )
        if payment.status != PaymentStatus.ORDER_CREATED:
            raise InvalidPaymentStatusError(
                "Payment is not in a verifiable state.",
            )

    @staticmethod
    def _verify_razorpay_signature(
        *,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> None:
        client = RazorpayService().client
        try:
            client.utility.verify_payment_signature(
                {
                    "razorpay_order_id": razorpay_order_id,
                    "razorpay_payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature,
                },
            )
        except razorpay.errors.SignatureVerificationError as exc:
            raise InvalidPaymentSignatureError(
                "Payment signature verification failed.",
            ) from exc
