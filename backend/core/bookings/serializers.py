from rest_framework import serializers

from accounts.models import User
from bookings.models import Booking, BookingStatus, Payment
from venues.cloudinary_url import CloudinaryImagePreset, transform_cloudinary_url
from venues.models import Venue, VenueSchedule
from venues.serializers import CitySerializer


class BookingStartSerializer(serializers.Serializer):
    venue_schedule_id = serializers.IntegerField(min_value=1)
    booking_date = serializers.DateField()


class BookingSessionAbandonSerializer(serializers.Serializer):
    booking_session_id = serializers.UUIDField()


class BookingStartResponseSerializer(serializers.Serializer):
    booking_session_id = serializers.UUIDField(source="booking_session.id")
    razorpay_order_id = serializers.CharField(source="payment.razorpay_order_id")
    amount = serializers.IntegerField(source="amount_paise")
    currency = serializers.CharField()
    expires_at = serializers.DateTimeField(source="booking_session.expires_at")
    key = serializers.CharField()


class BookingListVenueSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)

    class Meta:
        model = Venue
        fields = ("id", "slug", "name", "address", "city")
        read_only_fields = fields


class BookingListScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueSchedule
        fields = ("id", "name", "start_time", "end_time", "price", "is_available")
        read_only_fields = fields


class BookingListPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id", "provider", "status", "amount", "currency", "verified_at")
        read_only_fields = fields

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["provider"] = instance.provider.lower()
        data["status"] = instance.status.lower()
        return data


class BookingListCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "full_name", "email", "phone")
        read_only_fields = fields


class BookingListSerializer(serializers.ModelSerializer):
    venue = BookingListVenueSerializer(
        source="venue_schedule.group.venue",
        read_only=True,
    )
    schedule = BookingListScheduleSerializer(
        source="venue_schedule",
        read_only=True,
    )
    payment = BookingListPaymentSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = (
            "id",
            "booking_date",
            "booking_amount",
            "status",
            "confirmed_at",
            "cancelled_at",
            "created_at",
            "venue",
            "schedule",
            "payment",
        )
        read_only_fields = fields

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["status"] = instance.status.lower()
        return data


class BookingOwnerListSerializer(BookingListSerializer):
    customer = BookingListCustomerSerializer(source="user", read_only=True)

    class Meta(BookingListSerializer.Meta):
        fields = BookingListSerializer.Meta.fields + ("customer",)


class VenueSummarySerializer(serializers.ModelSerializer):
    city = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Venue
        fields = (
            "id",
            "name",
            "slug",
            "address",
            "city",
            "contact_name",
            "contact_phone",
            "cover_image",
        )
        read_only_fields = fields

    def get_city(self, obj) -> str:
        return obj.city.name

    def get_cover_image(self, obj) -> str | None:
        images = list(obj.images.all())
        if not images:
            return None
        cover = next((image for image in images if image.is_cover), None)
        image = cover or min(images, key=lambda item: item.sort_order)
        return transform_cloudinary_url(
            image.image_url,
            CloudinaryImagePreset.LIST_COVER,
        )


class ScheduleSummarySerializer(serializers.ModelSerializer):
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = VenueSchedule
        fields = ("id", "name", "start_time", "end_time")
        read_only_fields = fields

    def get_start_time(self, obj) -> str:
        return obj.start_time.strftime("%H:%M")

    def get_end_time(self, obj) -> str:
        return obj.end_time.strftime("%H:%M")


class PaymentSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("provider", "status", "amount", "currency")
        read_only_fields = fields


class BookingDetailSerializer(serializers.ModelSerializer):
    venue = VenueSummarySerializer(
        source="venue_schedule.group.venue",
        read_only=True,
    )
    schedule = ScheduleSummarySerializer(
        source="venue_schedule",
        read_only=True,
    )
    payment = PaymentSummarySerializer(read_only=True)

    class Meta:
        model = Booking
        fields = (
            "id",
            "status",
            "booking_date",
            "booking_amount",
            "confirmed_at",
            "venue",
            "schedule",
            "payment",
        )
        read_only_fields = fields


class BookingStatusUpdateSerializer(serializers.Serializer):
    status = serializers.CharField()

    def validate_status(self, value):
        normalized = value.upper()
        booking = self.context["booking"]

        if booking.status == BookingStatus.CANCELLED:
            raise serializers.ValidationError("Booking is already cancelled.")
        if normalized != BookingStatus.CANCELLED:
            raise serializers.ValidationError("Only cancellation is supported.")
        return BookingStatus.CANCELLED

    def save(self):
        booking = self.context["booking"]
        booking.status = BookingStatus.CANCELLED
        booking.save(update_fields=["status", "updated_at"])
        return booking
