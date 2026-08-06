from django.contrib.auth import get_user_model
from django.db import connection
from django.test import TestCase, skipUnlessDBFeature
from rest_framework.test import APIClient

from venues.models import (
    BookingType,
    City,
    District,
    Venue,
    VenueCategory,
    VenueStatus,
)

User = get_user_model()


@skipUnlessDBFeature("gis")
class VenueTrigramSearchTests(TestCase):
    """pg_trgm-backed venue name search.

    These assertions rely on PostgreSQL's ``pg_trgm`` extension, so they are
    skipped on backends that do not report GIS support (which, in this project,
    are the same non-PostgreSQL backends used for lightweight local runs).
    """

    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="password123",
            role="venue",
        )
        self.category = VenueCategory.objects.create(name="Hall")
        district = District.objects.create(name="Ernakulam")
        self.city = City.objects.create(district=district, name="Kochi")

        self.grand = self._create_venue("Grand Regency Hall", "grand-regency-hall")
        self.royal = self._create_venue("Royal Banquet Hall", "royal-banquet-hall")
        self.seaside = self._create_venue("Seaside Convention", "seaside-convention")

    def _create_venue(self, name, slug):
        return Venue.objects.create(
            owner=self.owner,
            category=self.category,
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

    def _search(self, term):
        response = self.client.get("/venues/", {"search": term})
        self.assertEqual(response.status_code, 200)
        return [venue["name"] for venue in response.data["results"]]

    def test_exact_substring_match(self):
        names = self._search("Regency")
        self.assertEqual(names, ["Grand Regency Hall"])

    def test_fuzzy_match_tolerates_typo(self):
        if connection.vendor != "postgresql":
            self.skipTest("Fuzzy matching requires PostgreSQL pg_trgm.")

        names = self._search("Regensy")
        self.assertIn("Grand Regency Hall", names)

    def test_best_match_ranked_first(self):
        if connection.vendor != "postgresql":
            self.skipTest("Relevance ordering requires PostgreSQL pg_trgm.")

        names = self._search("Royal Banket Hall")
        self.assertEqual(names[0], "Royal Banquet Hall")

    def test_no_match_returns_empty(self):
        names = self._search("Zzxqwerty")
        self.assertEqual(names, [])
