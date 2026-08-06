from rest_framework import serializers

from bookings.models import Booking, Payment
from bookings.serializers import (
    BookingListCustomerSerializer,
    BookingListVenueSerializer,
)


class PaymentVerificationSerializer(serializers.Serializer):
    booking_session_id = serializers.UUIDField()
    razorpay_order_id = serializers.CharField(max_length=255, trim_whitespace=True)
    razorpay_payment_id = serializers.CharField(max_length=255, trim_whitespace=True)
    razorpay_signature = serializers.CharField(max_length=512, trim_whitespace=True)

    def validate_razorpay_order_id(self, value):
        if not value:
            raise serializers.ValidationError("This field is required.")
        return value

    def validate_razorpay_payment_id(self, value):
        if not value:
            raise serializers.ValidationError("This field is required.")
        return value

    def validate_razorpay_signature(self, value):
        if not value:
            raise serializers.ValidationError("This field is required.")
        return value


class PaymentVerificationResponseSerializer(serializers.Serializer):
    booking_id = serializers.UUIDField(source="id")
    status = serializers.CharField()
    message = serializers.SerializerMethodField()

    def get_message(self, obj: Booking) -> str:
        return "Booking confirmed successfully."


class OwnerTransactionSummarySerializer(serializers.Serializer):
    total_collected = serializers.DecimalField(max_digits=12, decimal_places=2)
    collected_this_month = serializers.DecimalField(max_digits=12, decimal_places=2)
    successful_count = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    failed_count = serializers.IntegerField()
    refunded_total = serializers.DecimalField(max_digits=12, decimal_places=2)
    transaction_count = serializers.IntegerField()


class OwnerTransactionSerializer(serializers.ModelSerializer):
    venue = serializers.SerializerMethodField()
    customer = serializers.SerializerMethodField()
    booking_id = serializers.SerializerMethodField()
    booking_status = serializers.SerializerMethodField()
    event_date = serializers.DateField(source="booking_session.booking_date")
    razorpay_order_id = serializers.SerializerMethodField()
    razorpay_payment_id = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = (
            "id",
            "provider",
            "status",
            "amount",
            "currency",
            "verified_at",
            "created_at",
            "razorpay_order_id",
            "razorpay_payment_id",
            "booking_id",
            "booking_status",
            "event_date",
            "venue",
            "customer",
        )
        read_only_fields = fields

    def get_venue(self, obj):
        venue = obj.booking_session.venue_schedule.group.venue
        return BookingListVenueSerializer(venue).data

    def get_customer(self, obj):
        customer = obj.booking_session.user
        return BookingListCustomerSerializer(customer).data

    def _get_booking(self, obj: Payment) -> Booking | None:
        try:
            return obj.booking
        except Booking.DoesNotExist:
            return None

    def get_booking_id(self, obj):
        booking = self._get_booking(obj)
        return str(booking.id) if booking else None

    def get_booking_status(self, obj):
        booking = self._get_booking(obj)
        return booking.status.lower() if booking else None

    @staticmethod
    def _mask_gateway_id(value: str | None) -> str | None:
        if not value:
            return None
        if len(value) <= 8:
            return value
        return f"••••{value[-8:]}"

    def get_razorpay_order_id(self, obj) -> str:
        return self._mask_gateway_id(obj.razorpay_order_id)

    def get_razorpay_payment_id(self, obj) -> str | None:
        return self._mask_gateway_id(obj.razorpay_payment_id)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["provider"] = instance.provider.lower()
        data["status"] = instance.status.lower()
        return data
