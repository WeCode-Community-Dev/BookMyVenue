from django.db import transaction
from django.db.models.deletion import ProtectedError
from rest_framework import serializers

from accounts.models import UserRole
from venues.models import (
    BookingType,
    City,
    District,
    Venue,
    VenueCategory,
    VenueImage,
    VenueSchedule,
    VenueScheduleGroup,
    VenueScheduleGroupDay,
    VenueScheduleOverride,
    VenueStatus,
)
from venues.cloudinary_url import CloudinaryImagePreset, transform_cloudinary_url
from venues.utils import generate_unique_venue_slug

WEEKDAY_LABELS = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday",
}


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ("id", "name")


class CitySerializer(serializers.ModelSerializer):
    district = DistrictSerializer(read_only=True)

    class Meta:
        model = City
        fields = ("id", "name", "district")


class CityDropdownSerializer(serializers.ModelSerializer):
    district_id = serializers.IntegerField(source="district.id", read_only=True)

    class Meta:
        model = City
        fields = ("id", "name", "district_id")


class CityOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ("id", "name")


class DistrictCityGroupSerializer(serializers.ModelSerializer):
    cities = CityOptionSerializer(many=True, read_only=True)

    class Meta:
        model = District
        fields = ("id", "name", "cities")


class VenueCategorySerializer(serializers.ModelSerializer):
    icon_url = serializers.SerializerMethodField()

    class Meta:
        model = VenueCategory
        fields = ("id", "name", "icon_url")

    def get_icon_url(self, obj) -> str | None:
        return transform_cloudinary_url(
            obj.icon_url,
            CloudinaryImagePreset.CATEGORY_ICON,
        )


class VenueImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VenueImage
        fields = ("id", "image_url", "is_cover", "sort_order", "uploaded_at")
        read_only_fields = fields

    def get_image_url(self, obj) -> str:
        return transform_cloudinary_url(
            obj.image_url,
            CloudinaryImagePreset.DETAIL_HERO,
        )


class VenueImageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueImage
        fields = ("image_url", "is_cover", "sort_order")


class VenueListSerializer(serializers.ModelSerializer):
    category = VenueCategorySerializer(read_only=True)
    city = CitySerializer(read_only=True)
    min_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
        allow_null=True,
    )
    has_slots = serializers.BooleanField(read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Venue
        fields = (
            "slug",
            "name",
            "address",
            "capacity",
            "status",
            "is_active",
            "booking_type",
            "category",
            "city",
            "min_price",
            "has_slots",
            "cover_image",
            "average_rating",
            "review_count",
            "created_at",
        )

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


class VenueDetailSerializer(serializers.ModelSerializer):
    category = VenueCategorySerializer(read_only=True)
    city = CitySerializer(read_only=True)
    images = VenueImageSerializer(many=True, read_only=True)
    owner_id = serializers.IntegerField(source="owner.id", read_only=True)
    min_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Venue
        fields = (
            "id",
            "slug",
            "owner_id",
            "name",
            "description",
            "address",
            "google_maps_url",
            "capacity",
            "contact_name",
            "contact_phone",
            "contact_email",
            "status",
            "amenities",
            "booking_type",
            "is_active",
            "category",
            "city",
            "images",
            "min_price",
            "average_rating",
            "review_count",
            "created_at",
            "updated_at",
        )


def save_venue_images(venue, images_data):
    if not images_data:
        return

    VenueImage.objects.bulk_create(
        [
            VenueImage(
                venue=venue,
                image_url=image["image_url"],
                is_cover=image.get("is_cover", False),
                sort_order=image.get("sort_order", index),
            )
            for index, image in enumerate(images_data)
        ],
    )


class VenueWriteSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=VenueCategory.objects.filter(is_active=True),
    )
    city_id = serializers.PrimaryKeyRelatedField(
        source="city",
        queryset=City.objects.all(),
    )
    images = VenueImageCreateSerializer(many=True, required=False, default=list)

    class Meta:
        model = Venue
        fields = (
            "category_id",
            "city_id",
            "name",
            "description",
            "address",
            "google_maps_url",
            "capacity",
            "booking_type",
            "contact_name",
            "contact_phone",
            "contact_email",
            "amenities",
            "images",
        )
        extra_kwargs = {
            "google_maps_url": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def validate_capacity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Capacity must be greater than 0.")
        return value

    def validate_booking_type(self, value):
        if value not in BookingType.values:
            raise serializers.ValidationError("Invalid booking type.")
        return value

    def validate_google_maps_url(self, value):
        if value == "":
            return None
        return value

    def validate_images(self, value):
        if not value:
            return value

        cover_count = sum(1 for image in value if image.get("is_cover"))
        if cover_count > 1:
            raise serializers.ValidationError("Only one cover image is allowed.")
        if cover_count == 0:
            value[0]["is_cover"] = True
        return value

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        owner = self.context["request"].user
        name = validated_data["name"]
        validated_data["slug"] = generate_unique_venue_slug(name)
        venue = Venue.objects.create(owner=owner, **validated_data)
        save_venue_images(venue, images_data)
        return venue

    def update(self, instance, validated_data):
        images_data = validated_data.pop("images", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if images_data is not None:
            instance.images.all().delete()
            save_venue_images(instance, images_data)

        return instance


class VenueUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=VenueCategory.objects.filter(is_active=True),
        required=False,
    )
    city_id = serializers.PrimaryKeyRelatedField(
        source="city",
        queryset=City.objects.all(),
        required=False,
    )
    images = VenueImageCreateSerializer(many=True, required=False)
    slug = serializers.SlugField(required=False, max_length=220)

    class Meta:
        model = Venue
        fields = (
            "slug",
            "category_id",
            "city_id",
            "name",
            "description",
            "address",
            "google_maps_url",
            "capacity",
            "booking_type",
            "contact_name",
            "contact_phone",
            "contact_email",
            "amenities",
            "status",
            "is_active",
            "images",
        )
        extra_kwargs = {
            "name": {"required": False},
            "address": {"required": False},
            "google_maps_url": {"required": False, "allow_blank": True, "allow_null": True},
            "capacity": {"required": False},
            "booking_type": {"required": False},
            "contact_name": {"required": False},
            "contact_phone": {"required": False},
            "contact_email": {"required": False},
        }

    def validate_google_maps_url(self, value):
        if value == "":
            return None
        return value

    def validate_slug(self, value):
        queryset = Venue.objects.filter(slug=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("This slug is already in use.")
        return value

    def validate_capacity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Capacity must be greater than 0.")
        return value

    def validate_status(self, value):
        user = self.context["request"].user
        if user.role != UserRole.ADMIN and value != self.instance.status:
            raise serializers.ValidationError(
                "Only admins can change venue status.",
            )
        if value not in VenueStatus.values:
            raise serializers.ValidationError("Invalid status.")
        return value

    def validate_is_active(self, value):
        user = self.context["request"].user
        if user.role != UserRole.ADMIN and value != self.instance.is_active:
            raise serializers.ValidationError(
                "Use the active status endpoint to change venue availability.",
            )
        return value

    def validate_images(self, value):
        if value is None:
            return value
        cover_count = sum(1 for image in value if image.get("is_cover"))
        if cover_count > 1:
            raise serializers.ValidationError("Only one cover image is allowed.")
        if value and cover_count == 0:
            value[0]["is_cover"] = True
        return value

    def update(self, instance, validated_data):
        images_data = validated_data.pop("images", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if images_data is not None:
            instance.images.all().delete()
            save_venue_images(instance, images_data)

        return instance


class VenueActiveStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()


class VenueScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueSchedule
        fields = (
            "id",
            "name",
            "start_time",
            "end_time",
            "price",
            "is_available",
        )
        read_only_fields = ("id",)


class VenueScheduleWriteSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, min_value=1)
    name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_available = serializers.BooleanField(default=True)

    def validate(self, attrs):
        if attrs["end_time"] <= attrs["start_time"]:
            raise serializers.ValidationError("End time must be after start time.")
        if attrs["price"] < 0:
            raise serializers.ValidationError("Price must be zero or greater.")
        return attrs


class VenueScheduleGroupReadSerializer(serializers.ModelSerializer):
    days = serializers.SerializerMethodField()
    schedules = VenueScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = VenueScheduleGroup
        fields = (
            "id",
            "name",
            "is_active",
            "days",
            "schedules",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields

    def get_days(self, obj) -> list[int]:
        return sorted(day.day_of_week for day in obj.days.all())


def _validate_schedules_no_overlap(schedules: list[dict]) -> None:
    for index, current in enumerate(schedules):
        for other in schedules[index + 1 :]:
            if (
                current["start_time"] < other["end_time"]
                and other["start_time"] < current["end_time"]
            ):
                current_label = current.get("name") or "Schedule"
                other_label = other.get("name") or "Schedule"
                raise serializers.ValidationError(
                    {
                        "schedules": (
                            f'"{current_label}" overlaps with "{other_label}".'
                        ),
                    },
                )


def _validate_days_available(
    venue: Venue,
    days: list[int],
    exclude_group_id: int | None = None,
) -> None:
    queryset = VenueScheduleGroupDay.objects.filter(group__venue=venue)
    if exclude_group_id is not None:
        queryset = queryset.exclude(group_id=exclude_group_id)

    assigned_days = set(queryset.values_list("day_of_week", flat=True))
    conflicts = sorted(set(days) & assigned_days)
    if not conflicts:
        return

    labels = [WEEKDAY_LABELS.get(day, str(day)) for day in conflicts]
    raise serializers.ValidationError(
        {"days": f"These days are already assigned: {', '.join(labels)}."},
    )


def _sync_schedule_group_children(group: VenueScheduleGroup, days, schedules) -> None:
    group.days.all().delete()
    VenueScheduleGroupDay.objects.bulk_create(
        [
            VenueScheduleGroupDay(group=group, day_of_week=day)
            for day in sorted(set(days))
        ],
    )

    existing_by_id = {schedule.id: schedule for schedule in group.schedules.all()}
    kept_ids: set[int] = set()

    for schedule_data in schedules:
        schedule_id = schedule_data.get("id")
        payload = {
            "name": schedule_data.get("name") or "",
            "start_time": schedule_data["start_time"],
            "end_time": schedule_data["end_time"],
            "price": schedule_data["price"],
            "is_available": schedule_data.get("is_available", True),
        }

        if schedule_id and schedule_id in existing_by_id:
            schedule = existing_by_id[schedule_id]
            for field, value in payload.items():
                setattr(schedule, field, value)
            schedule.save(update_fields=[*payload.keys(), "updated_at"])
            kept_ids.add(schedule_id)
            continue

        created = VenueSchedule.objects.create(group=group, **payload)
        kept_ids.add(created.id)

    for schedule_id, schedule in existing_by_id.items():
        if schedule_id in kept_ids:
            continue
        try:
            schedule.delete()
        except ProtectedError:
            label = schedule.name or "Schedule"
            raise serializers.ValidationError(
                {
                    "schedules": (
                        f'Cannot remove "{label}" because it has existing bookings.'
                    ),
                },
            ) from None


class VenueScheduleGroupWriteSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    is_active = serializers.BooleanField(required=False, default=True)
    days = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=6),
        allow_empty=False,
    )
    schedules = VenueScheduleWriteSerializer(many=True, allow_empty=False)

    def validate_days(self, value):
        if len(value) != len(set(value)):
            raise serializers.ValidationError("Duplicate days are not allowed.")
        return value

    def validate(self, attrs):
        schedules = attrs.get("schedules", [])
        _validate_schedules_no_overlap(schedules)

        venue = self.context["venue"]
        exclude_group_id = self.context.get("group_id")
        _validate_days_available(venue, attrs["days"], exclude_group_id)

        if exclude_group_id is not None:
            schedule_ids = [
                schedule["id"]
                for schedule in schedules
                if schedule.get("id") is not None
            ]
            if len(schedule_ids) != len(set(schedule_ids)):
                raise serializers.ValidationError(
                    {"schedules": "Duplicate schedule ids are not allowed."},
                )
            if schedule_ids:
                valid_ids = set(
                    VenueSchedule.objects.filter(
                        group_id=exclude_group_id,
                        pk__in=schedule_ids,
                    ).values_list("pk", flat=True),
                )
                invalid_ids = sorted(set(schedule_ids) - valid_ids)
                if invalid_ids:
                    raise serializers.ValidationError(
                        {
                            "schedules": (
                                "Invalid schedule id(s): "
                                f"{', '.join(str(pk) for pk in invalid_ids)}."
                            ),
                        },
                    )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        venue = self.context["venue"]
        days = validated_data.pop("days")
        schedules = validated_data.pop("schedules")

        group = VenueScheduleGroup.objects.create(venue=venue, **validated_data)
        _sync_schedule_group_children(group, days, schedules)
        return group

    @transaction.atomic
    def update(self, instance, validated_data):
        days = validated_data.pop("days")
        schedules = validated_data.pop("schedules")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        _sync_schedule_group_children(instance, days, schedules)
        return instance


class VenueScheduleOverrideReadSerializer(serializers.ModelSerializer):
    is_full_day = serializers.SerializerMethodField()

    class Meta:
        model = VenueScheduleOverride
        fields = (
            "id",
            "override_date",
            "start_time",
            "end_time",
            "is_available",
            "reason",
            "is_full_day",
            "created_at",
            "updated_at",
        )
        read_only_fields = fields

    def get_is_full_day(self, obj) -> bool:
        return obj.start_time is None and obj.end_time is None


def _override_is_full_day(start_time, end_time) -> bool:
    return start_time is None and end_time is None


def _overrides_overlap(
    date_a,
    start_a,
    end_a,
    date_b,
    start_b,
    end_b,
) -> bool:
    if date_a != date_b:
        return False
    if _override_is_full_day(start_a, end_a) or _override_is_full_day(start_b, end_b):
        return True
    return start_a < end_b and start_b < end_a


def _validate_override_no_overlap(
    venue: Venue,
    override_date,
    start_time,
    end_time,
    exclude_override_id: int | None = None,
) -> None:
    queryset = VenueScheduleOverride.objects.filter(
        venue=venue,
        override_date=override_date,
    )
    if exclude_override_id is not None:
        queryset = queryset.exclude(pk=exclude_override_id)

    for existing in queryset:
        if _overrides_overlap(
            override_date,
            start_time,
            end_time,
            existing.override_date,
            existing.start_time,
            existing.end_time,
        ):
            if _override_is_full_day(existing.start_time, existing.end_time):
                label = "full day"
            else:
                label = f"{existing.start_time.strftime('%H:%M')}–{existing.end_time.strftime('%H:%M')}"
            raise serializers.ValidationError(
                {
                    "override_date": (
                        f"This block overlaps with an existing entry on "
                        f"{override_date} ({label})."
                    ),
                },
            )


class VenueScheduleOverrideWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenueScheduleOverride
        fields = (
            "override_date",
            "start_time",
            "end_time",
            "is_available",
            "reason",
        )

    def validate(self, attrs):
        start_time = attrs.get(
            "start_time",
            getattr(self.instance, "start_time", None),
        )
        end_time = attrs.get(
            "end_time",
            getattr(self.instance, "end_time", None),
        )
        override_date = attrs.get(
            "override_date",
            getattr(self.instance, "override_date", None),
        )

        start_is_null = start_time is None
        end_is_null = end_time is None
        if start_is_null != end_is_null:
            raise serializers.ValidationError(
                "Provide both start and end time, or leave both empty for a full-day block.",
            )
        if not start_is_null and end_time <= start_time:
            raise serializers.ValidationError("End time must be after start time.")

        venue = self.context["venue"]
        exclude_override_id = self.instance.pk if self.instance else None
        _validate_override_no_overlap(
            venue,
            override_date,
            start_time,
            end_time,
            exclude_override_id,
        )

        return attrs

    def create(self, validated_data):
        venue = self.context["venue"]
        return VenueScheduleOverride.objects.create(venue=venue, **validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
