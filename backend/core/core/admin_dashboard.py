from decimal import Decimal

from django.db.models import Sum
from django.urls import reverse
from django.utils import timezone

from accounts.models import User, UserRole
from bookings.models import Booking, BookingSession, BookingStatus
from venues.models import Venue, VenueStatus


def _format_currency(amount: Decimal) -> str:
    return f"₹{amount:,.0f}"


def get_dashboard_stats() -> list[dict]:
    today = timezone.localdate()

    venue_changelist = reverse("admin:venues_venue_changelist")
    booking_changelist = reverse("admin:bookings_booking_changelist")
    booking_session_changelist = reverse("admin:bookings_bookingsession_changelist")
    user_changelist = reverse("admin:accounts_user_changelist")

    # --- Platform Overview ---
    pending_venues = Venue.objects.filter(status=VenueStatus.PENDING_APPROVAL).count()
    total_users = User.objects.count()
    venue_owners = User.objects.filter(role=UserRole.VENUE).count()
    total_venues = Venue.objects.count()
    confirmed_bookings = Booking.objects.filter(status=BookingStatus.CONFIRMED).count()
    revenue = Booking.objects.filter(
        status__in=[BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
    ).aggregate(total=Sum("booking_amount"))["total"] or Decimal("0")

    platform_overview = {
        "title": "Platform Overview",
        "cards": [
            {
                "label": "Pending Venue Approvals",
                "value": pending_venues,
                "icon": "fas fa-hourglass-half",
                "color": "warning",
                "url": f"{venue_changelist}?status__exact=pending_approval",
            },
            {
                "label": "Total Users",
                "value": total_users,
                "icon": "fas fa-users",
                "color": "dark",
                "url": user_changelist,
            },
            {
                "label": "Venue Owners",
                "value": venue_owners,
                "icon": "fas fa-user-tie",
                "color": "info",
                "url": f"{user_changelist}?role__exact={UserRole.VENUE}",
            },
            {
                "label": "Venues",
                "value": total_venues,
                "icon": "fas fa-building",
                "color": "success",
                "url": venue_changelist,
            },
            {
                "label": "Confirmed Bookings",
                "value": confirmed_bookings,
                "icon": "fas fa-calendar-check",
                "color": "primary",
                "url": f"{booking_changelist}?status__exact={BookingStatus.CONFIRMED}",
            },
            {
                "label": "Revenue",
                "value": _format_currency(revenue),
                "icon": "fas fa-indian-rupee-sign",
                "color": "secondary",
                "url": booking_changelist,
            },
        ],
    }

    # --- Today's Activity ---
    new_users_today = User.objects.filter(created_at__date=today).count()
    new_venues_today = Venue.objects.filter(created_at__date=today).count()
    booking_requests_today = BookingSession.objects.filter(
        created_at__date=today,
    ).count()
    bookings_confirmed_today = Booking.objects.filter(
        confirmed_at__date=today,
    ).count()
    bookings_cancelled_today = Booking.objects.filter(
        cancelled_at__date=today,
    ).count()

    todays_activity = {
        "title": "Today's Activity",
        "cards": [
            {
                "label": "New Users Today",
                "value": new_users_today,
                "icon": "fas fa-user-plus",
                "color": "success",
                "url": user_changelist,
            },
            {
                "label": "New Venues Added",
                "value": new_venues_today,
                "icon": "fas fa-plus-square",
                "color": "info",
                "url": venue_changelist,
            },
            {
                "label": "Booking Requests Today",
                "value": booking_requests_today,
                "icon": "fas fa-hourglass-start",
                "color": "warning",
                "url": booking_session_changelist,
            },
            {
                "label": "Bookings Confirmed Today",
                "value": bookings_confirmed_today,
                "icon": "fas fa-calendar-check",
                "color": "primary",
                "url": f"{booking_changelist}?status__exact={BookingStatus.CONFIRMED}",
            },
            {
                "label": "Bookings Cancelled Today",
                "value": bookings_cancelled_today,
                "icon": "fas fa-calendar-times",
                "color": "danger",
                "url": f"{booking_changelist}?status__exact={BookingStatus.CANCELLED}",
            },
        ],
    }

    return [platform_overview, todays_activity]
