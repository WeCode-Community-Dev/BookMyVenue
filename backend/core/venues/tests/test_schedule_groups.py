from datetime import time
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from bookings.models import BookingSession, BookingSessionStatus
from venues.models import (
    BookingType,
    City,
    District,
    Venue,
    VenueCategory,
    VenueSchedule,
    VenueScheduleGroup,
    VenueScheduleGroupDay,
    VenueStatus,
)

User = get_user_model()


class VenueScheduleGroupUpdateTestCase(TestCase):
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
            name="Test Venue",
            slug="test-venue",
            address="123 Test St",
            capacity=100,
            contact_name="Owner",
            contact_phone="9999999999",
            contact_email="owner@example.com",
            status=VenueStatus.APPROVED,
            booking_type=BookingType.SESSION,
        )
        self.group = VenueScheduleGroup.objects.create(
            venue=self.venue,
            name="Every Day",
            is_active=True,
        )
        VenueScheduleGroupDay.objects.create(group=self.group, day_of_week=0)
        self.morning_slot = VenueSchedule.objects.create(
            group=self.group,
            name="Morning",
            start_time=time(8, 0),
            end_time=time(13, 0),
            price=Decimal("60000.00"),
            is_available=True,
        )
        self.evening_slot = VenueSchedule.objects.create(
            group=self.group,
            name="Evening Session",
            start_time=time(14, 0),
            end_time=time(20, 0),
            price=Decimal("60000.00"),
            is_available=True,
        )
        self.client.force_authenticate(user=self.owner)

    def _update_payload(self, **overrides):
        payload = {
            "name": "Every Day",
            "days": [0],
            "schedules": [
                {
                    "id": self.morning_slot.id,
                    "name": "Morning",
                    "start_time": "08:00:00",
                    "end_time": "13:00:00",
                    "price": "60000.00",
                    "is_available": True,
                },
                {
                    "id": self.evening_slot.id,
                    "name": "Evening Session",
                    "start_time": "14:00:00",
                    "end_time": "20:00:00",
                    "price": "60000.00",
                    "is_available": True,
                },
            ],
        }
        payload.update(overrides)
        return payload

    def test_update_preserves_schedule_ids_when_booking_sessions_exist(self):
        BookingSession.objects.create(
            user=self.customer,
            venue_schedule=self.morning_slot,
            booking_date=timezone.localdate(),
            locked_price=Decimal("60000.00"),
            status=BookingSessionStatus.FAILED,
            expires_at=timezone.now(),
        )

        response = self.client.put(
            f"/venues/{self.venue.slug}/schedule-groups/{self.group.id}/",
            self._update_payload(
                schedules=[
                    {
                        "id": self.morning_slot.id,
                        "name": "Morning Updated",
                        "start_time": "08:00:00",
                        "end_time": "13:00:00",
                        "price": "65000.00",
                        "is_available": True,
                    },
                    {
                        "id": self.evening_slot.id,
                        "name": "Evening Session",
                        "start_time": "14:00:00",
                        "end_time": "20:00:00",
                        "price": "60000.00",
                        "is_available": True,
                    },
                ],
            ),
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.morning_slot.refresh_from_db()
        self.assertEqual(self.morning_slot.name, "Morning Updated")
        self.assertEqual(self.morning_slot.price, Decimal("65000.00"))
        self.assertTrue(
            VenueSchedule.objects.filter(pk=self.morning_slot.id).exists(),
        )

    def test_update_rejects_removing_schedule_with_booking_sessions(self):
        BookingSession.objects.create(
            user=self.customer,
            venue_schedule=self.morning_slot,
            booking_date=timezone.localdate(),
            locked_price=Decimal("60000.00"),
            status=BookingSessionStatus.FAILED,
            expires_at=timezone.now(),
        )

        response = self.client.put(
            f"/venues/{self.venue.slug}/schedule-groups/{self.group.id}/",
            self._update_payload(
                schedules=[
                    {
                        "id": self.evening_slot.id,
                        "name": "Evening Session",
                        "start_time": "14:00:00",
                        "end_time": "20:00:00",
                        "price": "60000.00",
                        "is_available": True,
                    },
                ],
            ),
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("bookings", str(response.data).lower())
        self.assertTrue(
            VenueSchedule.objects.filter(pk=self.morning_slot.id).exists(),
        )
