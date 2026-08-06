import json
from unittest.mock import MagicMock, patch

import redis
from django.test import RequestFactory, SimpleTestCase, override_settings

from core.middleware import RateLimitMiddleware, get_client_ip


@override_settings(RATE_LIMIT_REQUESTS=3, RATE_LIMIT_WINDOW_SECONDS=60)
class RateLimitMiddlewareTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.get_response = MagicMock(return_value=MagicMock(status_code=200))
        self.middleware = RateLimitMiddleware(self.get_response)
        self.redis = MagicMock()
        self.redis_patch = patch(
            "core.middleware.get_redis_client",
            return_value=self.redis,
        )
        self.redis_patch.start()
        self.addCleanup(self.redis_patch.stop)

    def test_allows_requests_under_limit(self):
        self.redis.incr.return_value = 1
        request = self.factory.get("/api/venues/", REMOTE_ADDR="203.0.113.10")

        response = self.middleware(request)

        self.assertEqual(response.status_code, 200)
        self.get_response.assert_called_once_with(request)
        self.redis.incr.assert_called_once()
        key = self.redis.incr.call_args.args[0]
        self.redis.expire.assert_called_once_with(key, 60)
        self.assertRegex(key, r"^rate_limit:203\.0\.113\.10:\d+$")

    def test_returns_429_when_limit_exceeded(self):
        self.redis.incr.return_value = 4
        request = self.factory.get("/api/venues/")

        response = self.middleware(request)

        self.assertEqual(response.status_code, 429)
        self.assertEqual(
            json.loads(response.content),
            {"detail": "Rate limit exceeded"},
        )
        self.get_response.assert_not_called()
        self.redis.expire.assert_not_called()

    def test_keys_by_client_ip(self):
        self.redis.incr.return_value = 1
        request = self.factory.get(
            "/api/venues/",
            HTTP_X_FORWARDED_FOR="198.51.100.20, 10.0.0.1",
            REMOTE_ADDR="10.0.0.1",
        )

        self.middleware(request)

        key = self.redis.incr.call_args.args[0]
        self.assertTrue(key.startswith("rate_limit:198.51.100.20:"))

    def test_fails_open_when_redis_unavailable(self):
        self.redis.incr.side_effect = redis.ConnectionError("down")
        request = self.factory.get("/api/venues/")

        response = self.middleware(request)

        self.assertEqual(response.status_code, 200)
        self.get_response.assert_called_once_with(request)

    def test_skips_when_limit_disabled(self):
        request = self.factory.get("/api/venues/")

        with override_settings(RATE_LIMIT_REQUESTS=0):
            response = self.middleware(request)

        self.assertEqual(response.status_code, 200)
        self.redis.incr.assert_not_called()


class ClientIpHelperTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_get_client_ip_prefers_x_forwarded_for(self):
        request = self.factory.get(
            "/",
            HTTP_X_FORWARDED_FOR="203.0.113.10, 10.0.0.1",
            REMOTE_ADDR="10.0.0.1",
        )
        self.assertEqual(get_client_ip(request), "203.0.113.10")

    def test_get_client_ip_falls_back_to_remote_addr(self):
        request = self.factory.get("/", REMOTE_ADDR="198.51.100.20")
        self.assertEqual(get_client_ip(request), "198.51.100.20")
