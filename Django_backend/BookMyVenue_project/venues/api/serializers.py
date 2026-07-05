from rest_framework import serializers
from django.utils import timezone

from ..models import (
    Amenity,
    Booking,
    Favorite,
    Venue,
    VenueImage,
    VenuePackage,
    VenueUnavailablePeriod,
)

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = [
            "id",
            "name",
            "slug",
            "icon"
        ]

class VenueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueImage
        fields = [
            "id",
            "image",
            "alt_text",
            "is_cover",
            "sort_order",
        ]

class VenuePackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenuePackage
        fields = [
            "id",
            "name",
            "description",
            "price_per_day",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["id", "created_at", "updated_at"]


class VenueUnavailablePeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueUnavailablePeriod
        fields = [
            "id",
            "start_date",
            "end_date",
            "reason",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields

class VenueListSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    cover_image = serializers.SerializerMethodField()
    venue_type_display = serializers.CharField(
        source="get_venue_type_display",
        read_only=True,
    )

    class Meta:
        model = Venue
        fields = [
            "id",
            "name",
            "slug",
            "venue_type",
            "venue_type_display",
            "city",
            "max_capacity",
            "base_price_per_day",
            "is_verified",
            "is_featured",
            "amenities",
            "cover_image",
        ]

    def get_cover_image(self, venue):
        cover = next(
            (image for image in venue.images.all() if image.is_cover),
            None,
        )

        if cover is None:
            return None

        return VenueImageSerializer(
            cover,
            context=self.context,
        ).data


class VenueDetailSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    images = VenueImageSerializer(many=True, read_only=True)
    packages = VenuePackageSerializer(many=True, read_only=True)
    venue_type_display = serializers.CharField(
        source="get_venue_type_display",
        read_only=True,
    )

    class Meta:
        model = Venue
        fields = [
            "id",
            "name",
            "slug",
            "venue_type",
            "venue_type_display",
            "description",
            "max_capacity",
            "base_price_per_day",
            "address",
            "city",
            "state",
            "postal_code",
            "country",
            "latitude",
            "longitude",
            "contact_phone",
            "contact_email",
            "is_verified",
            "is_featured",
            "amenities",
            "images",
            "packages",
            "created_at",
            "updated_at",
        ]

class VenueCreateUpdateSerializer(serializers.ModelSerializer):
    amenities = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = Venue
        fields = [
            "id",
            "name",
            "slug",
            "venue_type",
            "description",
            "max_capacity",
            "base_price_per_day",
            "address",
            "city",
            "state",
            "postal_code",
            "country",
            "latitude",
            "longitude",
            "contact_phone",
            "contact_email",
            "amenities",
        ]

        read_only_fields = ["id", "slug"]


class FavoriteSerializer(serializers.ModelSerializer):
    venue = VenueListSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(
        source="venue",
        queryset=Venue.objects.filter(status=Venue.Status.APPROVED),
        write_only=True,
    )

    class Meta:
        model = Favorite
        fields = ["id", "venue", "venue_id", "created_at"]
        read_only_fields = ["id", "venue", "created_at"]

    def validate_venue_id(self, venue):
        request = self.context.get("request")
        if (
            request
            and request.user.is_authenticated
            and Favorite.objects.filter(user=request.user, venue=venue).exists()
        ):
            raise serializers.ValidationError(
                "This venue is already in your favorites."
            )
        return venue


class BookingSerializer(serializers.ModelSerializer):
    venue = VenueListSerializer(read_only=True)
    venue_id = serializers.PrimaryKeyRelatedField(
        source="venue",
        queryset=Venue.objects.filter(status=Venue.Status.APPROVED),
        write_only=True,
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "venue",
            "venue_id",
            "event_date",
            "event_type",
            "guest_count",
            "message",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "venue",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        venue = attrs["venue"]
        event_date = attrs["event_date"]
        guest_count = attrs["guest_count"]

        if event_date < timezone.localdate():
            raise serializers.ValidationError({
                "event_date": "The event date cannot be in the past."
            })

        if guest_count > venue.max_capacity:
            raise serializers.ValidationError({
                "guest_count": (
                    f"This venue allows at most {venue.max_capacity} guests."
                )
            })

        if VenueUnavailablePeriod.objects.filter(
            venue=venue,
            start_date__lte=event_date,
            end_date__gte=event_date,
        ).exists():
            raise serializers.ValidationError({
                "event_date": "This venue is unavailable on the selected date."
            })

        return attrs
