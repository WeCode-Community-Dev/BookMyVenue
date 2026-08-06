import json
from unittest.mock import MagicMock, patch

import redis
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from venues.models import City, District
from venues.services.location_group_cache_service import LocationGroupCacheService


@override_settings(VENUE_LOCATION_GROUP_CACHE_TTL_SECONDS=3600)
class LocationGroupCacheServiceTests(TestCase):
    def setUp(self):
        self.redis = MagicMock()
        self.redis.get.return_value = None
        self.redis_patch = patch(
            "venues.services.location_group_cache_service.get_redis_client",
            return_value=self.redis,
        )
        self.redis_patch.start()
        self.addCleanup(self.redis_patch.stop)

        # Seed migrations create Kerala places; isolate fixtures for assertions.
        City.objects.all().delete()
        District.objects.all().delete()

        self.district_a = District.objects.create(name="Cache District A")
        self.district_b = District.objects.create(name="Cache District B")
        self.city_alpha = City.objects.create(
            district=self.district_a,
            name="Alpha City",
        )
        self.city_beta = City.objects.create(
            district=self.district_a,
            name="Beta City",
        )
        City.objects.create(
            district=self.district_b,
            name="Zeta City",
        )
        # District with no cities should be excluded.
        District.objects.create(name="Empty District")

        self.redis.reset_mock()
        self.redis.get.return_value = None

    def test_cache_miss_loads_from_db_and_stores_payload(self):
        payload = LocationGroupCacheService.get_location_groups()

        self.assertEqual(
            payload,
            [
                {
                    "id": self.district_a.id,
                    "name": "Cache District A",
                    "cities": [
                        {"id": self.city_alpha.id, "name": "Alpha City"},
                        {"id": self.city_beta.id, "name": "Beta City"},
                    ],
                },
                {
                    "id": self.district_b.id,
                    "name": "Cache District B",
                    "cities": [
                        {"id": City.objects.get(name="Zeta City").id, "name": "Zeta City"},
                    ],
                },
            ],
        )
        self.redis.setex.assert_called_once_with(
            LocationGroupCacheService.CACHE_KEY,
            3600,
            json.dumps(payload),
        )

    def test_cache_hit_skips_database_query(self):
        cached_payload = [
            {
                "id": 1,
                "name": "Cached District",
                "cities": [{"id": 2, "name": "Cached City"}],
            },
        ]
        self.redis.get.return_value = json.dumps(cached_payload)

        with self.assertNumQueries(0):
            payload = LocationGroupCacheService.get_location_groups()

        self.assertEqual(payload, cached_payload)
        self.redis.setex.assert_not_called()

    def test_malformed_cache_falls_back_to_db_and_refreshes(self):
        self.redis.get.return_value = "{not-json"

        payload = LocationGroupCacheService.get_location_groups()

        self.assertEqual(payload[0]["name"], "Cache District A")
        self.redis.setex.assert_called_once()

    def test_redis_read_failure_falls_back_to_db(self):
        self.redis.get.side_effect = redis.ConnectionError("down")

        payload = LocationGroupCacheService.get_location_groups()

        self.assertEqual(
            [item["name"] for item in payload],
            ["Cache District A", "Cache District B"],
        )
        self.redis.setex.assert_not_called()

    def test_redis_write_failure_still_returns_db_payload(self):
        self.redis.setex.side_effect = redis.ConnectionError("down")

        payload = LocationGroupCacheService.get_location_groups()

        self.assertEqual(len(payload), 2)

    def test_invalidate_deletes_cache_key(self):
        LocationGroupCacheService.invalidate()
        self.redis.delete.assert_called_once_with(LocationGroupCacheService.CACHE_KEY)

    def test_city_save_invalidates_cache(self):
        self.redis.reset_mock()
        self.city_alpha.name = "Alpha City Updated"
        self.city_alpha.save()
        self.redis.delete.assert_called_with(LocationGroupCacheService.CACHE_KEY)

    def test_district_delete_invalidates_cache(self):
        self.redis.reset_mock()
        # Remove cities first so district delete is allowed.
        City.objects.filter(district=self.district_b).delete()
        self.redis.reset_mock()
        self.district_b.delete()
        self.redis.delete.assert_called_with(LocationGroupCacheService.CACHE_KEY)


@override_settings(VENUE_LOCATION_GROUP_CACHE_TTL_SECONDS=3600)
class VenueLocationGroupListViewCacheTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.redis = MagicMock()
        self.redis.get.return_value = None
        self.redis_patch = patch(
            "venues.services.location_group_cache_service.get_redis_client",
            return_value=self.redis,
        )
        self.redis_patch.start()
        self.addCleanup(self.redis_patch.stop)

        City.objects.all().delete()
        District.objects.all().delete()
        district = District.objects.create(name="API District")
        City.objects.create(district=district, name="API City")
        self.redis.reset_mock()
        self.redis.get.return_value = None

    def test_list_endpoint_returns_location_groups(self):
        response = self.client.get("/venues/location-groups")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]["name"], "API District")
        self.assertEqual(payload[0]["cities"][0]["name"], "API City")
        self.assertEqual(set(payload[0].keys()), {"id", "name", "cities"})

    def test_list_endpoint_uses_cached_payload(self):
        cached_payload = [
            {
                "id": 9,
                "name": "From Cache",
                "cities": [{"id": 8, "name": "Cached"}],
            },
        ]
        self.redis.get.return_value = json.dumps(cached_payload)

        response = self.client.get("/venues/location-groups")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), cached_payload)
