from django.contrib import admin
from django.db.models import Count, Q, Sum

from bookings.models import Booking, BookingSession, Payment, PaymentStatus
from core.admin_dashboard import _format_currency


@admin.register(BookingSession)
class BookingSessionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "venue_schedule",
        "booking_date",
        "locked_price",
        "status",
        "expires_at",
    )
    list_filter = ("status", "booking_date")
    search_fields = ("user__email", "user__phone", "venue_schedule__name")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "booking_session",
        "razorpay_order_id",
        "amount",
        "status",
        "created_at",
    )
    list_filter = ("status", "provider", "created_at")
    date_hierarchy = "created_at"
    search_fields = ("razorpay_order_id", "razorpay_payment_id")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)
    change_list_template = "admin/bookings/payment/change_list.html"

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context)
        try:
            queryset = response.context_data["cl"].queryset
        except (AttributeError, KeyError):
            return response

        agg = queryset.aggregate(
            total_count=Count("id"),
            total_amount=Sum("amount"),
            success_amount=Sum("amount", filter=Q(status=PaymentStatus.SUCCESS)),
            success_count=Count("id", filter=Q(status=PaymentStatus.SUCCESS)),
            refunded_amount=Sum("amount", filter=Q(status=PaymentStatus.REFUNDED)),
            refunded_count=Count("id", filter=Q(status=PaymentStatus.REFUNDED)),
            failed_count=Count("id", filter=Q(status=PaymentStatus.FAILED)),
        )

        success_amount = agg["success_amount"] or 0
        refunded_amount = agg["refunded_amount"] or 0
        net_revenue = success_amount - refunded_amount

        response.context_data["payment_summary_cards"] = [
            {
                "label": "Successful Revenue",
                "value": _format_currency(success_amount),
                "subtext": f"{agg['success_count']} payments",
                "icon": "fas fa-circle-check",
                "color": "success",
            },
            {
                "label": "Net Revenue",
                "value": _format_currency(net_revenue),
                "subtext": "Successful minus refunded",
                "icon": "fas fa-indian-rupee-sign",
                "color": "primary",
            },
            {
                "label": "Refunded",
                "value": _format_currency(refunded_amount),
                "subtext": f"{agg['refunded_count']} payments",
                "icon": "fas fa-rotate-left",
                "color": "danger",
            },
            {
                "label": "Total Payments",
                "value": agg["total_count"],
                "subtext": f"{_format_currency(agg['total_amount'] or 0)} total "
                f"· {agg['failed_count']} failed",
                "icon": "fas fa-receipt",
                "color": "dark",
            },
        ]
        return response


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "venue_schedule",
        "booking_date",
        "booking_amount",
        "status",
        "confirmed_at",
    )
    list_filter = ("status", "booking_date")
    search_fields = ("user__email", "user__phone", "venue_schedule__name")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-booking_date", "-created_at")
    autocomplete_fields = ("user", "venue_schedule")
