from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify


class Venue(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        INACTIVE = "inactive", "Inactive"

    class VenueType(models.TextChoices):
        WEDDING_HALL = "wedding_hall", "Wedding Hall"
        BANQUET_HALL = "banquet_hall", "Banquet Hall"
        AUDITORIUM = "auditorium", "Auditorium"
        CONFERENCE_HALL = "conference_hall", "Conference Hall"
        OUTDOOR_LAWN = "outdoor_lawn", "Outdoor Lawn"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="venues",
        limit_choices_to={"account_type": "venue_owner"},
    )

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)

    venue_type = models.CharField(max_length=30, choices=VenueType.choices)
    description = models.TextField()

    max_capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    base_price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default="India")

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        validators=[
            MinValueValidator(Decimal("-90.000000")),
            MaxValueValidator(Decimal("90.000000")),
        ],
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        validators=[
            MinValueValidator(Decimal("-180.000000")),
            MaxValueValidator(Decimal("180.000000")),
        ],
    )

    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    is_verified = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    amenities = models.ManyToManyField(
        "Amenity",
        blank=True,
        related_name="venues",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["status", "city"], name="venue_status_city_idx"),
            models.Index(fields=["venue_type"], name="venue_type_idx"),
            models.Index(fields=["base_price_per_day"], name="venue_price_idx"),
            models.Index(fields=["max_capacity"], name="venue_capacity_idx"),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(max_capacity__gte=1),
                name="venue_capacity_at_least_one",
            ),
            models.CheckConstraint(
                condition=models.Q(base_price_per_day__gte=0),
                name="venue_base_price_not_negative",
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(latitude__isnull=True)
                    | models.Q(latitude__gte=-90, latitude__lte=90)
                ),
                name="venue_valid_latitude",
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(longitude__isnull=True)
                    | models.Q(longitude__gte=-180, longitude__lte=180)
                ),
                name="venue_valid_longitude",
            ),
        ]

    def clean(self):
        super().clean()
        if (
            self.owner_id
            and getattr(self.owner, "account_type", None) != "venue_owner"
        ):
            raise ValidationError(
                {"owner": "Only a venue-owner account can own a venue."}
            )

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "venue"
            slug = base_slug
            counter = 2
            queryset = type(self).objects.all()
            if self.pk:
                queryset = queryset.exclude(pk=self.pk)

            while queryset.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class VenueImage(models.Model):
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="venue_images/")
    alt_text = models.CharField(max_length=255, blank=True)
    is_cover = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["venue"],
                condition=models.Q(is_cover=True),
                name="unique_cover_image_per_venue",
            )
        ]

    def __str__(self):
        return f"Image for {self.venue.name}"


class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name


class VenuePackage(models.Model):
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="packages",
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price_per_day = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["venue", "name"],
                name="unique_package_name_per_venue",
            ),
            models.CheckConstraint(
                condition=models.Q(price_per_day__gte=0),
                name="venue_package_price_not_negative",
            ),
        ]

    def __str__(self):
        return f"{self.name} - {self.venue.name}"


class VenueUnavailablePeriod(models.Model):
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="unavailable_periods",
    )
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_date"]
        indexes = [
            models.Index(
                fields=["venue", "start_date", "end_date"],
                name="venue_unavailable_dates_idx",
            )
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__gte=models.F("start_date")),
                name="unavailable_end_on_or_after_start",
            )
        ]

    def clean(self):
        super().clean()
        if not self.venue_id or not self.start_date or not self.end_date:
            return

        overlapping_periods = type(self).objects.filter(
            venue_id=self.venue_id,
            start_date__lte=self.end_date,
            end_date__gte=self.start_date,
        )
        if self.pk:
            overlapping_periods = overlapping_periods.exclude(pk=self.pk)

        if overlapping_periods.exists():
            raise ValidationError(
                "This unavailable period overlaps an existing unavailable period."
            )

    def __str__(self):
        return f"{self.venue.name}: {self.start_date} to {self.end_date}"


class Booking(models.Model):
    class EventType(models.TextChoices):
        BIRTHDAY = "birthday", "Birthday"
        WEDDING = "wedding", "Wedding"
        CORPORATE = "corporate", "Corporate Event"
        ENGAGEMENT = "engagement", "Engagement"
        RECEPTION = "reception", "Reception"
        CONFERENCE = "conference", "Conference"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="booking_requests",
    )
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="booking_requests",
    )
    event_date = models.DateField()
    event_type = models.CharField(max_length=20, choices=EventType.choices)
    guest_count = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["venue", "event_date", "status"],
                name="booking_venue_date_status_idx",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(guest_count__gte=1),
                name="booking_guest_count_at_least_one",
            ),
        ]

    def __str__(self):
        return f"{self.user} - {self.venue.name} on {self.event_date}"


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorite_records",
    )
    venue = models.ForeignKey(
        Venue,
        on_delete=models.CASCADE,
        related_name="favorite_records",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "venue"],
                name="unique_user_venue_favorite",
            )
        ]

    def __str__(self):
        return f"{self.user} likes {self.venue.name}"
