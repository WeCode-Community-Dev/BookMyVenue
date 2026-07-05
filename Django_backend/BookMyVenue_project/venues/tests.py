from datetime import timedelta

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Booking, Venue


class FeaturedVenueListAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.owner = get_user_model().objects.create_user(
            username="featured-owner",
            password="test-password",
            account_type="venue_owner",
        )

        for name in ["Alpha Hall", "Bravo Hall", "Charlie Hall", "Delta Hall"]:
            cls.create_venue(name=name, is_featured=True)

        cls.create_venue(name="Not Featured Hall", is_featured=False)
        cls.create_venue(
            name="Pending Featured Hall",
            is_featured=True,
            venue_status=Venue.Status.PENDING,
        )

    @classmethod
    def create_venue(
        cls,
        *,
        name,
        is_featured,
        venue_status=Venue.Status.APPROVED,
    ):
        return Venue.objects.create(
            owner=cls.owner,
            name=name,
            venue_type=Venue.VenueType.WEDDING_HALL,
            description="A venue used to test the featured venue endpoint.",
            max_capacity=100,
            base_price_per_day="10000.00",
            address="Test Road",
            city="Kochi",
            contact_phone="+91 90000 00000",
            contact_email="venue@example.com",
            status=venue_status,
            is_featured=is_featured,
        )

    def test_returns_first_three_approved_featured_venues(self):
        response = self.client.get(reverse("venues_api:featured-venue-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 4)
        self.assertEqual(len(response.data["results"]), 3)
        self.assertIsNotNone(response.data["next"])
        self.assertEqual(
            [venue["name"] for venue in response.data["results"]],
            ["Alpha Hall", "Bravo Hall", "Charlie Hall"],
        )

    def test_returns_remaining_featured_venues_on_next_page(self):
        response = self.client.get(
            reverse("venues_api:featured-venue-list"),
            {"page": 2},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [venue["name"] for venue in response.data["results"]],
            ["Delta Hall"],
        )
        self.assertIsNone(response.data["next"])


class BookingListCreateAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.owner = get_user_model().objects.create_user(
            username="booking-owner",
            password="test-password",
            account_type="venue_owner",
        )
        cls.venue_user = get_user_model().objects.create_user(
            username="booking-user",
            password="test-password",
            account_type="venue_user",
        )
        cls.venue = Venue.objects.create(
            owner=cls.owner,
            name="Booking Hall",
            venue_type=Venue.VenueType.WEDDING_HALL,
            description="A venue used to test booking requests.",
            max_capacity=100,
            base_price_per_day="10000.00",
            address="Test Road",
            city="Kochi",
            contact_phone="+91 90000 00000",
            contact_email="venue@example.com",
            status=Venue.Status.APPROVED,
        )

    def booking_payload(self, **overrides):
        payload = {
            "venue_id": self.venue.id,
            "event_date": timezone.localdate() + timedelta(days=7),
            "event_type": Booking.EventType.WEDDING,
            "guest_count": 50,
            "message": "Please confirm this booking.",
        }
        payload.update(overrides)
        return payload

    def test_guest_cannot_create_booking(self):
        response = self.client.post(
            reverse("venues_api:booking-list"),
            self.booking_payload(),
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Booking.objects.count(), 0)

    def test_venue_owner_cannot_create_booking(self):
        self.client.force_authenticate(user=self.owner)

        response = self.client.post(
            reverse("venues_api:booking-list"),
            self.booking_payload(),
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Booking.objects.count(), 0)

    def test_venue_user_can_create_booking(self):
        self.client.force_authenticate(user=self.venue_user)

        response = self.client.post(
            reverse("venues_api:booking-list"),
            self.booking_payload(),
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking = Booking.objects.get()
        self.assertEqual(booking.user, self.venue_user)
        self.assertEqual(booking.venue, self.venue)
        self.assertEqual(booking.status, Booking.Status.PENDING)

    def test_booking_cannot_exceed_venue_capacity(self):
        self.client.force_authenticate(user=self.venue_user)

        response = self.client.post(
            reverse("venues_api:booking-list"),
            self.booking_payload(guest_count=101),
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("guest_count", response.data)
