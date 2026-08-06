from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.test import TestCase, skipUnlessDBFeature
from rest_framework.test import APIClient

from venues.filters import apply_city_location_filter
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
class CityLocationFilterTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="password123",
            role="venue",
        )
        self.category = VenueCategory.objects.create(name="Hall")

        self.district_a = District.objects.create(name="District A")
        self.district_b = District.objects.create(name="District B")

        self.kochi = City.objects.create(
            district=self.district_a,
            name="Kochi",
            location=Point(76.2673, 9.9312, srid=4326),
        )
        self.aluva = City.objects.create(
            district=self.district_a,
            name="Aluva",
            location=Point(76.3519, 10.1076, srid=4326),
        )
        self.thrissur = City.objects.create(
            district=self.district_b,
            name="Thrissur",
            location=Point(76.2144, 10.5276, srid=4326),
        )
        self.far_city = City.objects.create(
            district=self.district_b,
            name="Kasaragod",
            location=Point(75.0, 12.5, srid=4326),
        )

        self.kochi_venue = self._create_venue("Kochi Hall", self.kochi, "kochi-hall")
        self.aluva_venue = self._create_venue("Aluva Hall", self.aluva, "aluva-hall")
        self.thrissur_venue = self._create_venue(
            "Thrissur Hall",
            self.thrissur,
            "thrissur-hall",
        )
        self.far_venue = self._create_venue(
            "Kasaragod Hall",
            self.far_city,
            "kasaragod-hall",
        )

    def _create_venue(self, name, city, slug):
        return Venue.objects.create(
            owner=self.owner,
            category=self.category,
            city=city,
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

    def test_exact_city_venues_come_first(self):
        queryset = Venue.objects.filter(status=VenueStatus.APPROVED)
        filtered, mode = apply_city_location_filter(
            queryset,
            self.kochi.id,
            radius_km=100,
        )

        self.assertEqual(mode, "distance")
        venue_ids = list(filtered.order_by("location_priority", "distance").values_list("id", flat=True))
        self.assertEqual(venue_ids[0], self.kochi_venue.id)
        self.assertIn(self.aluva_venue.id, venue_ids)
        self.assertNotIn(self.far_venue.id, venue_ids)

    def test_nearby_venues_sorted_by_distance(self):
        queryset = Venue.objects.filter(status=VenueStatus.APPROVED)
        filtered, _ = apply_city_location_filter(
            queryset,
            self.kochi.id,
            radius_km=100,
        )

        nearby_ids = list(
            filtered.filter(location_priority=1)
            .order_by("distance")
            .values_list("id", flat=True)
        )
        self.assertEqual(nearby_ids[0], self.aluva_venue.id)
        self.assertIn(self.thrissur_venue.id, nearby_ids)

    def test_city_without_coordinates_falls_back_to_exact_match(self):
        city = City.objects.create(district=self.district_a, name="No Geo City")
        exact_venue = self._create_venue("No Geo Hall", city, "no-geo-hall")

        queryset = Venue.objects.filter(status=VenueStatus.APPROVED)
        filtered, mode = apply_city_location_filter(queryset, city.id)

        self.assertEqual(mode, "exact_only")
        self.assertEqual(list(filtered.values_list("id", flat=True)), [exact_venue.id])


@skipUnlessDBFeature("gis")
class VenueListLocationFilterApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="password123",
            role="venue",
        )
        self.category = VenueCategory.objects.create(name="Hall")
        district = District.objects.create(name="Ernakulam")
        self.kochi = City.objects.create(
            district=district,
            name="Kochi",
            location=Point(76.2673, 9.9312, srid=4326),
        )
        self.aluva = City.objects.create(
            district=district,
            name="Aluva",
            location=Point(76.3519, 10.1076, srid=4326),
        )
        Venue.objects.create(
            owner=self.owner,
            category=self.category,
            city=self.kochi,
            name="Kochi Hall",
            slug="kochi-hall",
            address="Kochi",
            capacity=100,
            contact_name="Owner",
            contact_phone="9999999999",
            contact_email="owner@example.com",
            status=VenueStatus.APPROVED,
            booking_type=BookingType.HOURLY,
        )
        Venue.objects.create(
            owner=self.owner,
            category=self.category,
            city=self.aluva,
            name="Aluva Hall",
            slug="aluva-hall",
            address="Aluva",
            capacity=100,
            contact_name="Owner",
            contact_phone="9999999999",
            contact_email="owner@example.com",
            status=VenueStatus.APPROVED,
            booking_type=BookingType.HOURLY,
        )

    def test_venue_list_orders_exact_city_before_nearby(self):
        response = self.client.get(
            "/venues/",
            {"city_id": self.kochi.id, "radius_km": 50},
        )

        self.assertEqual(response.status_code, 200)
        names = [venue["name"] for venue in response.data["results"]]
        self.assertEqual(names[0], "Kochi Hall")
        self.assertIn("Aluva Hall", names)
