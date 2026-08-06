import hashlib
import secrets

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from accounts.models import User
from accounts.security import decode_access_token


class JWTAuthentication(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            return None

        user_id = decode_access_token(parts[1])
        if user_id is None:
            raise AuthenticationFailed("Invalid or expired token.")

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist as exc:
            raise AuthenticationFailed("User not found.") from exc

        if not user.is_active or user.is_blocked:
            raise AuthenticationFailed("Account is disabled.")

        return (user, parts[1])


class InternalAPIKeyAuthentication(BaseAuthentication):
    """Authenticate trusted internal callers via Authorization: Bearer <INTERNAL_API_KEY>."""

    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            raise AuthenticationFailed("Authentication credentials were not provided.")

        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            raise AuthenticationFailed("Invalid authorization header.")

        expected = settings.INTERNAL_API_KEY
        if not expected:
            raise AuthenticationFailed("Internal API key is not configured.")

        provided = parts[1]
        if not self._keys_match(provided, expected):
            raise AuthenticationFailed("Invalid API key.")

        return (AnonymousUser(), provided)

    @staticmethod
    def _keys_match(provided: str, expected: str) -> bool:
        # Hash before compare so unequal lengths do not raise or leak timing.
        provided_digest = hashlib.sha256(provided.encode("utf-8")).digest()
        expected_digest = hashlib.sha256(expected.encode("utf-8")).digest()
        return secrets.compare_digest(provided_digest, expected_digest)
