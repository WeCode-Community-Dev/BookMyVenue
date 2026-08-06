from datetime import date, datetime, time
from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from bookings.models import (
    Booking,
    BookingSession,
    BookingSessionStatus,
    BookingStatus,
    Payment,
    PaymentStatus,
)
from venues.availability import get_available_slots, is_slot_time_in_past
from venues.models import (
    BookingType,
    City,
    District,
    Venue,
    VenueCategory,
    VenueSchedule,
    VenueScheduleGroup,
    VenueScheduleGroupDay,
    VenueScheduleOverride,
    VenueStatus,
)

User = get_user_model()


def _create_confirmed_booking(user, venue_schedule, booking_date, amount):
    session = BookingSession.objects.create(
        user=user,
        venue_schedule=venue_schedule,
        booking_date=booking_date,
        locked_price=amount,
        status=BookingSessionStatus.COMPLETED,
        expires_at=timezone.now(),
    )
    payment = Payment.objects.create(
        booking_session=session,
        razorpay_order_id=f"order_{session.id}",
        amount=amount,
        status=PaymentStatus.SUCCESS,
    )
    return Booking.objects.create(
        booking_session=session,
        payment=payment,
        user=user,
        venue_schedule=venue_schedule,
        booking_date=booking_date,
        booking_amount=amount,
        status=BookingStatus.CONFIRMED,
        confirmed_at=timezone.now(),
    )


class AvailabilityTestCase(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="password123",
            role="venue",
        )
        self.category = VenueCategory.objects.create(name="Hall")
        self.district = District.objects.create(name="Andheri")
        self.city = City.objects.create(district=self.district, name="Mumbai")
        self.venue = Venue.objects.create(
            owner=self.owner,
            category=self.category,
            city=self.city,
            name="Test Venue",
            slug="test-venue",
            address="123 Test St",
            capacity=100,
            contact_name="Owner",
            contact_phone="9999999999",
            contact_email="owner@example.com",
            status=VenueStatus.APPROVED,
            booking_type=BookingType.HOURLY,
        )
        self.group = VenueScheduleGroup.objects.create(
            venue=self.venue,
            name="Weekdays",
            is_active=True,
        )
        VenueScheduleGroupDay.objects.create(group=self.group, day_of_week=0)
        self.morning_slot = VenueSchedule.objects.create(
            group=self.group,
            name="Morning",
            start_time=time(9, 0),
            end_time=time(12, 0),
            price=Decimal("1000.00"),
            is_available=True,
        )
        self.afternoon_slot = VenueSchedule.objects.create(
            group=self.group,
            name="Afternoon",
            start_time=time(13, 0),
            end_time=time(17, 0),
            price=Decimal("1500.00"),
            is_available=True,
        )
        self.target_date = date(2026, 6, 29)

    def test_returns_slots_for_matching_weekday_group(self):
        result = get_available_slots(self.venue, self.target_date)

        self.assertEqual(result["date"], "2026-06-29")
        self.assertEqual(result["day_of_week"], 0)
        self.assertEqual(result["schedule_group"]["name"], "Weekdays")
        self.assertEqual(len(result["slots"]), 2)
        self.assertEqual(result["slots"][0]["name"], "Morning")

    def test_returns_empty_when_no_weekday_group_matches(self):
        result = get_available_slots(self.venue, date(2026, 7, 4))

        self.assertEqual(result["day_of_week"], 5)
        self.assertIsNone(result["schedule_group"])
        self.assertEqual(result["slots"], [])

    def test_excludes_slots_marked_unavailable_in_schedule(self):
        self.morning_slot.is_available = False
        self.morning_slot.save()

        result = get_available_slots(self.venue, self.target_date)

        self.assertEqual(len(result["slots"]), 1)
        self.assertEqual(result["slots"][0]["name"], "Afternoon")

    def test_excludes_slots_blocked_by_full_day_override(self):
        VenueScheduleOverride.objects.create(
            venue=self.venue,
            override_date=self.target_date,
            start_time=None,
            end_time=None,
            is_available=False,
            reason="Closed",
        )

        result = get_available_slots(self.venue, self.target_date)

        self.assertEqual(result["slots"], [])

    def test_excludes_slots_blocked_by_partial_override(self):
        VenueScheduleOverride.objects.create(
            venue=self.venue,
            override_date=self.target_date,
            start_time=time(8, 0),
            end_time=time(13, 0),
            is_available=False,
            reason="Maintenance",
        )

        result = get_available_slots(self.venue, self.target_date)

        self.assertEqual(len(result["slots"]), 1)
        self.assertEqual(result["slots"][0]["name"], "Afternoon")

    def test_excludes_slots_blocked_by_booking(self):
        customer = User.objects.create_user(
            email="customer@example.com",
            password="password123",
        )
        _create_confirmed_booking(
            customer,
            self.morning_slot,
            self.target_date,
            Decimal("1000.00"),
        )

        result = get_available_slots(self.venue, self.target_date)

        self.assertEqual(len(result["slots"]), 1)
        self.assertEqual(result["slots"][0]["name"], "Afternoon")

    @patch("venues.availability.timezone.localtime")
    @patch("venues.availability.timezone.localdate")
    def test_excludes_slots_whose_time_has_passed_for_today(
        self,
        mock_localdate,
        mock_localtime,
    ):
        today = date(2026, 6, 29)
        mock_localdate.return_value = today
        mock_localtime.return_value = datetime(2026, 6, 29, 20, 0)

        result = get_available_slots(self.venue, today)

        self.assertEqual(result["slots"], [])
        self.assertTrue(is_slot_time_in_past(self.morning_slot, today))
        self.assertTrue(is_slot_time_in_past(self.afternoon_slot, today))

    @patch("venues.availability.timezone.localtime")
    @patch("venues.availability.timezone.localdate")
    def test_includes_slots_still_upcoming_for_today(
        self,
        mock_localdate,
        mock_localtime,
    ):
        today = date(2026, 6, 29)
        mock_localdate.return_value = today
        mock_localtime.return_value = datetime(2026, 6, 29, 10, 0)

        result = get_available_slots(self.venue, today)

        self.assertEqual(len(result["slots"]), 2)
        self.assertFalse(is_slot_time_in_past(self.morning_slot, today))
        self.assertFalse(is_slot_time_in_past(self.afternoon_slot, today))

    def test_ignores_cancelled_bookings(self):
        customer = User.objects.create_user(
            email="customer@example.com",
            password="password123",
        )
        session = BookingSession.objects.create(
            user=customer,
            venue_schedule=self.morning_slot,
            booking_date=self.target_date,
            locked_price=Decimal("1000.00"),
            status=BookingSessionStatus.COMPLETED,
            expires_at=timezone.now(),
        )
        payment = Payment.objects.create(
            booking_session=session,
            razorpay_order_id=f"order_{session.id}",
            amount=Decimal("1000.00"),
            status=PaymentStatus.SUCCESS,
        )
        Booking.objects.create(
            booking_session=session,
            payment=payment,
            user=customer,
            venue_schedule=self.morning_slot,
            booking_date=self.target_date,
            booking_amount=Decimal("1000.00"),
            status=BookingStatus.CANCELLED,
            confirmed_at=timezone.now(),
        )

        result = get_available_slots(self.venue, self.target_date)

        self.assertEqual(len(result["slots"]), 2)


class VenueAvailabilityAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="password123",
            role="venue",
        )
        self.category = VenueCategory.objects.create(name="Hall")
        self.district = District.objects.create(name="Andheri")
        self.city = City.objects.create(district=self.district, name="Mumbai")
        self.venue = Venue.objects.create(
            owner=self.owner,
            category=self.category,
            city=self.city,
            name="API Venue",
            slug="api-venue",
            address="123 Test St",
            capacity=100,
            contact_name="Owner",
            contact_phone="9999999999",
            contact_email="owner@example.com",
            status=VenueStatus.APPROVED,
            booking_type=BookingType.HOURLY,
        )
        self.group = VenueScheduleGroup.objects.create(
            venue=self.venue,
            name="Weekdays",
            is_active=True,
        )
        VenueScheduleGroupDay.objects.create(group=self.group, day_of_week=0)
        self.schedule = VenueSchedule.objects.create(
            group=self.group,
            name="Morning",
            start_time=time(9, 0),
            end_time=time(12, 0),
            price=Decimal("1000.00"),
            is_available=True,
        )

    def test_availability_endpoint_returns_slots(self):
        response = self.client.get(
            "/venues/api-venue/availability/",
            {"date": "2026-06-29"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["venue_slug"], "api-venue")
        self.assertEqual(len(response.data["slots"]), 1)

    def test_availability_endpoint_requires_date(self):
        response = self.client.get("/venues/api-venue/availability/")

        self.assertEqual(response.status_code, 400)
        self.assertIn("date", response.data["detail"].lower())

    def test_availability_endpoint_rejects_invalid_date(self):
        response = self.client.get(
            "/venues/api-venue/availability/",
            {"date": "not-a-date"},
        )

        self.assertEqual(response.status_code, 400)


class VenueSlotAvailabilityCheckAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="password123",
            role="venue",
        )
        self.customer = User.objects.create_user(
            email="customer@example.com",
            password="password123",
        )
        self.category = VenueCategory.objects.create(name="Hall")
        self.district = District.objects.create(name="Andheri")
        self.city = City.objects.create(district=self.district, name="Mumbai")
        self.venue = Venue.objects.create(
            owner=self.owner,
            category=self.category,
            city=self.city,
            name="API Venue",
            slug="api-venue",
            address="123 Test St",
            capacity=100,
            contact_name="Owner",
            contact_phone="9999999999",
            contact_email="owner@example.com",
            status=VenueStatus.APPROVED,
            booking_type=BookingType.HOURLY,
        )
        self.group = VenueScheduleGroup.objects.create(
            venue=self.venue,
            name="Weekdays",
            is_active=True,
        )
        VenueScheduleGroupDay.objects.create(group=self.group, day_of_week=0)
        self.schedule = VenueSchedule.objects.create(
            group=self.group,
            name="Morning",
            start_time=time(9, 0),
            end_time=time(12, 0),
            price=Decimal("1000.00"),
            is_available=True,
        )
        self.target_date = "2026-06-29"

    def _check_url(self):
        return f"/venues/{self.venue.slug}/availability/check/"

    def test_returns_available_status(self):
        response = self.client.get(
            self._check_url(),
            {"date": self.target_date, "schedule_id": self.schedule.id},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["schedule_id"], self.schedule.id)
        self.assertEqual(response.data["date"], self.target_date)
        self.assertEqual(response.data["status"], "AVAILABLE")
        self.assertEqual(response.data["message"], "Available")

    def test_returns_booked_status(self):
        _create_confirmed_booking(
            self.customer,
            self.schedule,
            date(2026, 6, 29),
            Decimal("1000.00"),
        )

        response = self.client.get(
            self._check_url(),
            {"date": self.target_date, "schedule_id": self.schedule.id},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "BOOKED")
        self.assertIn("booked", response.data["message"].lower())

    def test_returns_booking_in_progress_status(self):
        BookingSession.objects.create(
            user=self.customer,
            venue_schedule=self.schedule,
            booking_date=date(2026, 6, 29),
            locked_price=Decimal("1000.00"),
            status=BookingSessionStatus.ACTIVE,
            expires_at=timezone.now() + timezone.timedelta(minutes=10),
        )

        response = self.client.get(
            self._check_url(),
            {"date": self.target_date, "schedule_id": self.schedule.id},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "BOOKING_IN_PROGRESS")
        self.assertIn("booking_session_expires_at", response.data)

    def test_returns_unavailable_status_for_non_matching_weekday(self):
        response = self.client.get(
            self._check_url(),
            {"date": "2026-07-04", "schedule_id": self.schedule.id},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "UNAVAILABLE")

    def test_requires_date_and_schedule_id(self):
        response = self.client.get(self._check_url())

        self.assertEqual(response.status_code, 400)
        self.assertIn("date", response.data["detail"].lower())

        response = self.client.get(
            self._check_url(),
            {"date": self.target_date},
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("schedule_id", response.data["detail"].lower())

    def test_returns_not_found_for_unknown_schedule(self):
        response = self.client.get(
            self._check_url(),
            {"date": self.target_date, "schedule_id": 99999},
        )

        self.assertEqual(response.status_code, 404)

    @patch("venues.availability.timezone.localtime")
    @patch("venues.availability.timezone.localdate")
    def test_check_returns_unavailable_for_past_slot_today(
        self,
        mock_localdate,
        mock_localtime,
    ):
        today = date(2026, 6, 29)
        mock_localdate.return_value = today
        mock_localtime.return_value = datetime(2026, 6, 29, 20, 0)

        response = self.client.get(
            self._check_url(),
            {"date": today.isoformat(), "schedule_id": self.schedule.id},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "UNAVAILABLE")
        self.assertIn("passed", response.data["message"].lower())

    @patch("venues.availability.timezone.localtime")
    @patch("venues.availability.timezone.localdate")
    def test_check_returns_unavailable_for_past_slot_today(
        self,
        mock_localdate,
        mock_localtime,
    ):
        today = date(2026, 6, 29)
        mock_localdate.return_value = today
        mock_localtime.return_value = datetime(2026, 6, 29, 20, 0)

        response = self.client.get(
            self._check_url(),
            {"date": today.isoformat(), "schedule_id": self.schedule.id},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "UNAVAILABLE")
        self.assertIn("passed", response.data["message"].lower())
