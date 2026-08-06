from django.conf import settings
from django.contrib.gis.db.models import PointField
from django.contrib.postgres.indexes import GinIndex, GistIndex
from django.db import models
from django.db.models import F, Q

from venues.utils import generate_unique_venue_slug


class BookingType(models.TextChoices):
    HOURLY = "hourly", "Hourly"
    SESSION = "session", "Session"
    FULL_DAY = "full_day", "Full Day"


class VenueStatus(models.TextChoices):
    APPROVED = "approved", "Approved"
    PENDING_APPROVAL = "pending_approval", "Pending Approval"
    REJECTED = "rejected", "Rejected"
    SUSPENDED = "suspended", "Suspended"


class District(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = "districts"

    def __str__(self) -> str:
        return self.name


class City(models.Model):
    district = models.ForeignKey(
        District,
        on_delete=models.PROTECT,
        related_name="cities",
    )
    name = models.CharField(max_length=100)
    location = PointField(
        srid=4326,
        blank=True,
        null=True,
        help_text="Geographic coordinates (longitude, latitude) in WGS84.",
    )

    class Meta:
        db_table = "cities"
        verbose_name_plural = "cities"
        constraints = [
            models.UniqueConstraint(
                fields=["district", "name"],
                name="uq_cities_district_name",
            ),
        ]
        indexes = [
            models.Index(fields=["district"], name="ix_cities_district_id"),
            GistIndex(fields=["location"], name="ix_cities_location"),
        ]

    def __str__(self) -> str:
        return f"{self.name}, {self.district.name}"


class VenueCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon_url = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "venue_categories"
        verbose_name_plural = "venue categories"

    def __str__(self) -> str:
        return self.name


class Venue(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="venues",
    )
    category = models.ForeignKey(
        VenueCategory,
        on_delete=models.PROTECT,
        related_name="venues",
    )
    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        related_name="venues",
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField()
    google_maps_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Google Maps URL for venue directions.",
    )
    capacity = models.PositiveIntegerField()
    contact_name = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=VenueStatus.choices,
        default=VenueStatus.PENDING_APPROVAL,
    )
    amenities = models.JSONField(default=list)
    booking_type = models.CharField(max_length=20, choices=BookingType.choices)
    average_rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=0,
        help_text="Cached average rating from reviews (0.0–5.0).",
    )
    review_count = models.PositiveIntegerField(
        default=0,
        help_text="Cached count of reviews for this venue.",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "venues"
        constraints = [
            models.CheckConstraint(
                condition=Q(capacity__gt=0),
                name="ck_venues_capacity_positive",
            ),
            models.CheckConstraint(
                condition=Q(average_rating__gte=0) & Q(average_rating__lte=5),
                name="ck_venues_average_rating_range",
            ),
        ]
        indexes = [
            models.Index(fields=["slug"], name="ix_venues_slug"),
            models.Index(fields=["owner"], name="ix_venues_owner_id"),
            models.Index(fields=["category"], name="ix_venues_category_id"),
            models.Index(fields=["city"], name="ix_venues_city_id"),
            models.Index(fields=["status"], name="ix_venues_status"),
            models.Index(
                fields=["category", "status"],
                name="ix_venues_category_status",
            ),
            models.Index(
                fields=["city", "status"],
                name="ix_venues_city_status",
            ),
            GinIndex(
                fields=["name"],
                name="ix_venues_name_trgm",
                opclasses=["gin_trgm_ops"],
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_venue_slug(self.name, exclude_pk=self.pk)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class VenueImage(models.Model):
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image_url = models.TextField()
    is_cover = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "venue_images"
        indexes = [
            models.Index(fields=["venue"], name="ix_venue_images_venue_id"),
            models.Index(
                fields=["venue", "sort_order"],
                name="ix_venue_images_venue_sort",
            ),
        ]

    def __str__(self) -> str:
        return f"Image #{self.pk}"


class VenueScheduleGroup(models.Model):
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="schedule_groups",
    )
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "venue_schedule_groups"

    def __str__(self) -> str:
        return self.name


class VenueScheduleGroupDay(models.Model):
    group = models.ForeignKey(
        VenueScheduleGroup,
        on_delete=models.CASCADE,
        related_name="days",
    )
    day_of_week = models.IntegerField()

    class Meta:
        db_table = "venue_schedule_group_days"
        constraints = [
            models.UniqueConstraint(
                fields=["group", "day_of_week"],
                name="uq_group_day",
            ),
            models.CheckConstraint(
                condition=Q(day_of_week__gte=0) & Q(day_of_week__lte=6),
                name="ck_day_of_week",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.group.name} - day {self.day_of_week}"


class VenueSchedule(models.Model):
    group = models.ForeignKey(
        VenueScheduleGroup,
        on_delete=models.CASCADE,
        related_name="schedules",
    )
    name = models.CharField(max_length=100, blank=True, null=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "venue_schedules"
        constraints = [
            models.CheckConstraint(
                condition=Q(end_time__gt=F("start_time")),
                name="ck_schedule_time_range",
            ),
            models.CheckConstraint(
                condition=Q(price__gte=0),
                name="ck_schedule_price",
            ),
            models.UniqueConstraint(
                fields=["group", "start_time", "end_time"],
                name="uq_schedule_slot",
            ),
        ]

    def __str__(self) -> str:
        label = self.name or "Schedule"
        return f"{label} ({self.start_time}-{self.end_time})"


class VenueScheduleOverride(models.Model):
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="schedule_overrides",
    )
    override_date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    is_available = models.BooleanField()
    reason = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "venue_schedule_overrides"
        indexes = [
            models.Index(fields=["venue"], name="ix_sched_override_venue"),
            models.Index(fields=["override_date"], name="ix_sched_override_date"),
        ]

    def __str__(self) -> str:
        return f"{self.venue.name} - {self.override_date}"
