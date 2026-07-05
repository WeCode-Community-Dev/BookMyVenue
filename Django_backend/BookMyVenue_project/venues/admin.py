from django.contrib import admin

from .models import (
    Amenity,
    Booking,
    Favorite,
    Venue,
    VenueImage,
    VenuePackage,
    VenueUnavailablePeriod,
)


class VenueImageInline(admin.TabularInline):
    model = VenueImage
    extra = 0
    fields = ("image", "alt_text", "is_cover", "sort_order")


class VenuePackageInline(admin.StackedInline):
    model = VenuePackage
    extra = 0
    fields = ("name", "description", "price_per_day", "is_active")


class VenueUnavailablePeriodInline(admin.TabularInline):
    model = VenueUnavailablePeriod
    extra = 0
    fields = ("start_date", "end_date", "reason")


@admin.register(Venue)
class VenueAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "venue_type",
        "city",
        "max_capacity",
        "base_price_per_day",
        "status",
        "is_verified",
        "is_featured",
        "updated_at",
    )
    list_filter = (
        "status",
        "venue_type",
        "is_verified",
        "is_featured",
        "country",
        "state",
    )
    search_fields = (
        "name",
        "owner__username",
        "owner__fullname",
        "owner__email",
        "city",
        "address",
    )
    list_select_related = ("owner",)
    list_editable = ("status", "is_verified", "is_featured")
    filter_horizontal = ("amenities",)
    readonly_fields = ("slug", "created_at", "updated_at")
    inlines = (
        VenueImageInline,
        VenuePackageInline,
        VenueUnavailablePeriodInline,
    )
    fieldsets = (
        (
            "Venue",
            {
                "fields": (
                    "owner",
                    "name",
                    "slug",
                    "venue_type",
                    "description",
                    "amenities",
                )
            },
        ),
        (
            "Capacity and pricing",
            {"fields": ("max_capacity", "base_price_per_day")},
        ),
        (
            "Location",
            {
                "fields": (
                    "address",
                    "city",
                    "state",
                    "postal_code",
                    "country",
                    "latitude",
                    "longitude",
                )
            },
        ),
        (
            "Contact",
            {"fields": ("contact_phone", "contact_email")},
        ),
        (
            "Publishing",
            {"fields": ("status", "is_verified", "is_featured")},
        ),
        (
            "Audit",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "icon")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(VenueImage)
class VenueImageAdmin(admin.ModelAdmin):
    list_display = ("venue", "image", "is_cover", "sort_order")
    list_filter = ("is_cover",)
    search_fields = ("venue__name", "alt_text")
    list_select_related = ("venue",)
    ordering = ("venue", "sort_order")


@admin.register(VenuePackage)
class VenuePackageAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "venue",
        "price_per_day",
        "is_active",
        "updated_at",
    )
    list_filter = ("is_active",)
    search_fields = ("name", "venue__name", "description")
    list_select_related = ("venue",)
    list_editable = ("is_active",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(VenueUnavailablePeriod)
class VenueUnavailablePeriodAdmin(admin.ModelAdmin):
    list_display = ("venue", "start_date", "end_date", "reason")
    list_filter = ("start_date", "end_date")
    search_fields = ("venue__name", "reason")
    list_select_related = ("venue",)
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "start_date"


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "venue", "created_at")
    search_fields = (
        "user__username",
        "user__fullname",
        "user__email",
        "venue__name",
    )
    list_select_related = ("user", "venue")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "venue",
        "event_date",
        "event_type",
        "guest_count",
        "status",
        "created_at",
    )
    list_filter = ("status", "event_type", "event_date")
    search_fields = ("user__username", "user__fullname", "venue__name")
    list_select_related = ("user", "venue")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "event_date"
