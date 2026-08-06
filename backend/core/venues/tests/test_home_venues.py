from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase, skipUnlessDBFeature
from django.utils import timezone
from rest_framework.test import APIClient

from venues.models import (
    BookingType,
    City,
    District,
    Venue,
    VenueCategory,
    VenueStatus,
)
from venues.services.home_venue_service import HomeVenueService

User = get_user_model()


@skipUnlessDBFeature("gis_enabled")
class HomeVenueServiceTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email="home-owner@example.com",
            password="password123",
            role="venue",
        )
        district = District.objects.create(name="Home Test District")
        self.city = City.objects.create(district=district, name="Home Test City")
        self.now = timezone.now()

    def _category(self, name):
        return VenueCategory.objects.create(name=name)

    def _venue(self, *, name, slug, category, created_at=None, **kwargs):
        venue = Venue.objects.create(
            owner=self.owner,
            category=category,
            city=self.city,
            name=name,
            slug=slug,
            address="123 Test St",
            capacity=100,
            contact_name="Owner",
            contact_phone="9999999999",
            contact_email="owner@example.com",
            status=kwargs.get("status", VenueStatus.APPROVED),
            is_active=kwargs.get("is_active", True),
            booking_type=BookingType.HOURLY,
        )
        if created_at is not None:
            Venue.objects.filter(pk=venue.pk).update(created_at=created_at)
            venue.refresh_from_db()
        return venue

    def test_picks_one_newest_venue_per_category(self):
        cafe = self._category("Home Cafe")
        hall = self._category("Home Hall")

        older_cafe = self._venue(
            name="Old Cafe",
            slug="old-cafe",
            category=cafe,
            created_at=self.now - timedelta(days=3),
        )
        newest_cafe = self._venue(
            name="New Cafe",
            slug="new-cafe",
            category=cafe,
            created_at=self.now - timedelta(days=1),
        )
        newest_hall = self._venue(
            name="New Hall",
            slug="new-hall",
            category=hall,
            created_at=self.now - timedelta(days=2),
        )
        self._venue(
            name="Older Hall",
            slug="older-hall",
            category=hall,
            created_at=self.now - timedelta(days=4),
        )

        venues = HomeVenueService.list_venues(limit=12)
        slugs = [venue.slug for venue in venues]

        self.assertIn(newest_cafe.slug, slugs)
        self.assertIn(newest_hall.slug, slugs)
        self.assertNotIn(older_cafe.slug, slugs[:2])
        # First two should be the category representatives (newest picks).
        self.assertEqual(set(slugs[:2]), {newest_cafe.slug, newest_hall.slug})

    def test_fills_remaining_slots_with_newest_unused(self):
        cafe = self._category("Fill Cafe")
        hall = self._category("Fill Hall")

        self._venue(
            name="Cafe A",
            slug="fill-cafe-a",
            category=cafe,
            created_at=self.now - timedelta(days=5),
        )
        self._venue(
            name="Hall A",
            slug="fill-hall-a",
            category=hall,
            created_at=self.now - timedelta(days=4),
        )
        # Extra venues in same categories — used only as fillers.
        filler_1 = self._venue(
            name="Cafe B",
            slug="fill-cafe-b",
            category=cafe,
            created_at=self.now - timedelta(days=1),
        )
        filler_2 = self._venue(
            name="Hall B",
            slug="fill-hall-b",
            category=hall,
            created_at=self.now - timedelta(days=2),
        )

        venues = HomeVenueService.list_venues(limit=4)
        slugs = [venue.slug for venue in venues]

        self.assertEqual(len(slugs), 4)
        self.assertEqual(len(set(slugs)), 4)
        # Category picks first (newest per category): cafe-b and hall-b
        self.assertEqual(set(slugs[:2]), {filler_1.slug, filler_2.slug})

    def test_caps_at_limit_when_more_categories_than_limit(self):
        for index in range(15):
            category = self._category(f"Cap Category {index:02d}")
            self._venue(
                name=f"Cap Venue {index}",
                slug=f"cap-venue-{index}",
                category=category,
                created_at=self.now - timedelta(minutes=index),
            )

        venues = HomeVenueService.list_venues(limit=12)
        self.assertEqual(len(venues), 12)
        # Newest category picks: indices 0..11 (created_at closer to now for lower index)
        slugs = [venue.slug for venue in venues]
        self.assertEqual(slugs, [f"cap-venue-{index}" for index in range(12)])

    def test_excludes_inactive_and_non_approved(self):
        cafe = self._category("Status Cafe")
        hall = self._category("Status Hall")

        approved = self._venue(
            name="Approved Cafe",
            slug="approved-cafe",
            category=cafe,
            created_at=self.now - timedelta(days=1),
        )
        self._venue(
            name="Inactive Cafe",
            slug="inactive-cafe",
            category=cafe,
            is_active=False,
            created_at=self.now,
        )
        self._venue(
            name="Pending Hall",
            slug="pending-hall",
            category=hall,
            status=VenueStatus.PENDING_APPROVAL,
            created_at=self.now,
        )
        approved_hall = self._venue(
            name="Approved Hall",
            slug="approved-hall",
            category=hall,
            created_at=self.now - timedelta(days=2),
        )

        venues = HomeVenueService.list_venues(limit=12)
        slugs = [venue.slug for venue in venues]
        self.assertEqual(set(slugs), {approved.slug, approved_hall.slug})


@skipUnlessDBFeature("gis_enabled")
class HomeVenueListApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email="home-api-owner@example.com",
            password="password123",
            role="venue",
        )
        district = District.objects.create(name="Home API District")
        self.city = City.objects.create(district=district, name="Home API City")
        self.now = timezone.now()

        self.cafe = VenueCategory.objects.create(name="API Cafe")
        self.hall = VenueCategory.objects.create(name="API Hall")

        self.cafe_new = self._venue(
            "API Cafe New",
            "api-cafe-new",
            self.cafe,
            self.now - timedelta(hours=1),
        )
        self.cafe_old = self._venue(
            "API Cafe Old",
            "api-cafe-old",
            self.cafe,
            self.now - timedelta(hours=3),
        )
        self.hall_new = self._venue(
            "API Hall New",
            "api-hall-new",
            self.hall,
            self.now - timedelta(hours=2),
        )
        self.hall_old = self._venue(
            "API Hall Old",
            "api-hall-old",
            self.hall,
            self.now - timedelta(hours=4),
        )

    def _venue(self, name, slug, category, created_at):
        venue = Venue.objects.create(
            owner=self.owner,
            category=category,
            city=self.city,
            name=name,
            slug=slug,
            address="123 Test St",
            capacity=100,
            contact_name="Owner",
            contact_phone="9999999999",
            contact_email="owner@example.com",
            status=VenueStatus.APPROVED,
            booking_type=BookingType.HOURLY,
        )
        Venue.objects.filter(pk=venue.pk).update(created_at=created_at)
        venue.refresh_from_db()
        return venue

    def test_home_true_returns_diversified_results(self):
        response = self.client.get("/venues/", {"home": "true", "limit": 12})
        self.assertEqual(response.status_code, 200)
        slugs = [row["slug"] for row in response.data["results"]]

        self.assertEqual(set(slugs[:2]), {self.cafe_new.slug, self.hall_new.slug})
        self.assertEqual(len(slugs), 4)
        self.assertEqual(len(set(slugs)), 4)

    def test_default_list_is_newest_first_without_home_flag(self):
        response = self.client.get("/venues/", {"limit": 12})
        self.assertEqual(response.status_code, 200)
        slugs = [row["slug"] for row in response.data["results"]]

        # Without home=true, pure newest-first — not one-per-category first.
        self.assertEqual(
            slugs[:4],
            [
                self.cafe_new.slug,
                self.hall_new.slug,
                self.cafe_old.slug,
                self.hall_old.slug,
            ],
        )
