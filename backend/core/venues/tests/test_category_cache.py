import json
from unittest.mock import MagicMock, patch

import redis
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from venues.models import VenueCategory
from venues.services.category_cache_service import CategoryCacheService


@override_settings(VENUE_CATEGORY_CACHE_TTL_SECONDS=3600)
class CategoryCacheServiceTests(TestCase):
    def setUp(self):
        self.redis = MagicMock()
        self.redis.get.return_value = None
        self.redis_patch = patch(
            "venues.services.category_cache_service.get_redis_client",
            return_value=self.redis,
        )
        self.redis_patch.start()
        self.addCleanup(self.redis_patch.stop)

        VenueCategory.objects.all().delete()
        self.cafe = VenueCategory.objects.create(
            name="Cache Cafe",
            icon_url="https://example.com/cafe.png",
            is_active=True,
        )
        self.hall = VenueCategory.objects.create(
            name="Cache Hall",
            icon_url=None,
            is_active=True,
        )
        VenueCategory.objects.create(
            name="Cache Inactive",
            is_active=False,
        )
        self.redis.reset_mock()
        self.redis.get.return_value = None

    def test_cache_miss_loads_from_db_and_stores_payload(self):
        payload = CategoryCacheService.get_active_categories()

        self.assertEqual(
            payload,
            [
                {
                    "id": self.cafe.id,
                    "name": "Cache Cafe",
                    "icon_url": "https://example.com/cafe.png",
                },
                {
                    "id": self.hall.id,
                    "name": "Cache Hall",
                    "icon_url": None,
                },
            ],
        )
        self.redis.setex.assert_called_once_with(
            CategoryCacheService.CACHE_KEY,
            3600,
            json.dumps(payload),
        )

    def test_cache_hit_skips_database_query(self):
        cached_payload = [
            {"id": 99, "name": "Cached", "icon_url": None},
        ]
        self.redis.get.return_value = json.dumps(cached_payload)

        with self.assertNumQueries(0):
            payload = CategoryCacheService.get_active_categories()

        self.assertEqual(payload, cached_payload)
        self.redis.setex.assert_not_called()

    def test_malformed_cache_falls_back_to_db_and_refreshes(self):
        self.redis.get.return_value = "{not-json"

        payload = CategoryCacheService.get_active_categories()

        self.assertEqual(len(payload), 2)
        self.assertEqual(payload[0]["name"], "Cache Cafe")
        self.redis.setex.assert_called_once()

    def test_redis_read_failure_falls_back_to_db(self):
        self.redis.get.side_effect = redis.ConnectionError("down")

        payload = CategoryCacheService.get_active_categories()

        self.assertEqual(
            [item["name"] for item in payload],
            ["Cache Cafe", "Cache Hall"],
        )
        self.redis.setex.assert_not_called()

    def test_redis_write_failure_still_returns_db_payload(self):
        self.redis.setex.side_effect = redis.ConnectionError("down")

        payload = CategoryCacheService.get_active_categories()

        self.assertEqual(
            [item["name"] for item in payload],
            ["Cache Cafe", "Cache Hall"],
        )

    def test_invalidate_deletes_cache_key(self):
        CategoryCacheService.invalidate()
        self.redis.delete.assert_called_once_with(CategoryCacheService.CACHE_KEY)

    def test_invalidate_swallows_redis_errors(self):
        self.redis.delete.side_effect = redis.ConnectionError("down")
        CategoryCacheService.invalidate()

    def test_save_invalidates_cache(self):
        self.redis.reset_mock()
        self.cafe.name = "Cache Cafe Updated"
        self.cafe.save()
        self.redis.delete.assert_called_with(CategoryCacheService.CACHE_KEY)

    def test_delete_invalidates_cache(self):
        self.redis.reset_mock()
        self.hall.delete()
        self.redis.delete.assert_called_with(CategoryCacheService.CACHE_KEY)


@override_settings(VENUE_CATEGORY_CACHE_TTL_SECONDS=3600)
class VenueCategoryListViewCacheTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.redis = MagicMock()
        self.redis.get.return_value = None
        self.redis_patch = patch(
            "venues.services.category_cache_service.get_redis_client",
            return_value=self.redis,
        )
        self.redis_patch.start()
        self.addCleanup(self.redis_patch.stop)

        VenueCategory.objects.all().delete()
        self.active = VenueCategory.objects.create(
            name="Cache Auditorium",
            icon_url="https://example.com/auditorium.png",
            is_active=True,
        )
        VenueCategory.objects.create(name="Cache Hidden", is_active=False)
        self.redis.reset_mock()
        self.redis.get.return_value = None

    def test_list_endpoint_returns_active_categories_ordered_by_name(self):
        VenueCategory.objects.create(name="Cache Zoo", is_active=True)
        VenueCategory.objects.create(name="Cache Barn", is_active=True)

        response = self.client.get("/venues/categories")

        self.assertEqual(response.status_code, 200)
        names = [row["name"] for row in response.json()]
        self.assertEqual(names, ["Cache Auditorium", "Cache Barn", "Cache Zoo"])
        self.assertEqual(
            set(response.json()[0].keys()),
            {"id", "name", "icon_url"},
        )

    def test_list_endpoint_uses_cached_payload(self):
        cached_payload = [
            {"id": 1, "name": "From Cache", "icon_url": None},
        ]
        self.redis.get.return_value = json.dumps(cached_payload)

        response = self.client.get("/venues/categories")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), cached_payload)
