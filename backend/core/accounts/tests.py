from unittest.mock import patch

import jwt
from django.conf import settings
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from accounts.google_auth import GoogleUserInfo
from accounts.models import AuthAccount, AuthProvider, User, UserRole


def auth_headers(client, user):
    response = client.post(
        "/users/login",
        {"email": user.email, "password": "SecurePass123!"},
        format="json",
    )
    token = response.data["access_token"]
    return {"HTTP_AUTHORIZATION": f"Bearer {token}"}


class MeViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="user@example.com",
            password="SecurePass123!",
            full_name="Old Name",
            phone="9876543210",
            role=UserRole.USER,
        )
        self.auth = auth_headers(self.client, self.user)

    def test_get_me_returns_current_user(self):
        response = self.client.get("/users/me", **self.auth)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "user@example.com")
        self.assertEqual(response.data["full_name"], "Old Name")
        self.assertEqual(response.data["phone"], "9876543210")

    def test_patch_me_updates_name_and_phone(self):
        response = self.client.patch(
            "/users/me",
            {"full_name": "New Name", "phone": "9123456789"},
            format="json",
            **self.auth,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], "New Name")
        self.assertEqual(response.data["phone"], "9123456789")
        self.assertEqual(response.data["email"], "user@example.com")

        self.user.refresh_from_db()
        self.assertEqual(self.user.full_name, "New Name")
        self.assertEqual(self.user.phone, "9123456789")

    def test_patch_me_rejects_blank_name(self):
        response = self.client.patch(
            "/users/me",
            {"full_name": "   "},
            format="json",
            **self.auth,
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("full_name", response.data)

    def test_patch_me_rejects_invalid_name(self):
        response = self.client.patch(
            "/users/me",
            {"full_name": "A"},
            format="json",
            **self.auth,
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("full_name", response.data)

    def test_patch_me_rejects_invalid_phone(self):
        response = self.client.patch(
            "/users/me",
            {"phone": "5123456789"},
            format="json",
            **self.auth,
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone", response.data)

    def test_patch_me_allows_duplicate_phone(self):
        User.objects.create_user(
            email="other@example.com",
            password="SecurePass123!",
            phone="9000000000",
            role=UserRole.USER,
        )

        response = self.client.patch(
            "/users/me",
            {"phone": "9000000000"},
            format="json",
            **self.auth,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["phone"], "9000000000")

    def test_patch_me_normalizes_phone_with_country_code(self):
        response = self.client.patch(
            "/users/me",
            {"phone": "+91 98765 43210"},
            format="json",
            **self.auth,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["phone"], "9876543210")

    def test_patch_me_requires_authentication(self):
        response = self.client.patch(
            "/users/me",
            {"full_name": "New Name"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class GoogleLoginViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.google_info = GoogleUserInfo(
            sub="google-sub-123",
            email="user@example.com",
            name="Test User",
            picture="https://example.com/avatar.jpg",
        )

    @override_settings(GOOGLE_CLIENT_ID="test-client-id")
    @patch("accounts.serializers.verify_google_id_token")
    def test_google_login_creates_user_and_auth_account(self, mock_verify):
        mock_verify.return_value = self.google_info

        response = self.client.post(
            "/users/google",
            {"token": "valid-google-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertEqual(response.data["user"]["email"], "user@example.com")
        self.assertEqual(response.data["user"]["role"], UserRole.USER)
        self.assertTrue(response.data["user"]["is_email_verified"])

        user = User.objects.get(email="user@example.com")
        auth_account = AuthAccount.objects.get(
            user=user,
            provider=AuthProvider.GOOGLE,
        )
        self.assertEqual(auth_account.provider_user_id, "google-sub-123")

    @override_settings(GOOGLE_CLIENT_ID="test-client-id")
    @patch("accounts.serializers.verify_google_id_token")
    def test_google_login_returns_existing_google_user(self, mock_verify):
        user = User.objects.create_user(
            email="user@example.com",
            role=UserRole.USER,
            is_email_verified=True,
        )
        AuthAccount.objects.create(
            user=user,
            provider=AuthProvider.GOOGLE,
            provider_user_id="google-sub-123",
        )
        mock_verify.return_value = self.google_info

        response = self.client.post(
            "/users/google",
            {"token": "valid-google-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["id"], user.id)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(AuthAccount.objects.count(), 1)

    @override_settings(GOOGLE_CLIENT_ID="test-client-id")
    @patch("accounts.serializers.verify_google_id_token")
    def test_google_login_links_existing_email_user(self, mock_verify):
        user = User.objects.create_user(
            email="user@example.com",
            password="SecurePass123!",
            role=UserRole.USER,
        )
        mock_verify.return_value = self.google_info

        response = self.client.post(
            "/users/google",
            {"token": "valid-google-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["id"], user.id)
        self.assertTrue(
            AuthAccount.objects.filter(
                user=user,
                provider=AuthProvider.GOOGLE,
                provider_user_id="google-sub-123",
            ).exists(),
        )
        user.refresh_from_db()
        self.assertTrue(user.is_email_verified)

    @override_settings(GOOGLE_CLIENT_ID="test-client-id")
    @patch("accounts.serializers.verify_google_id_token")
    def test_google_login_rejects_wrong_role(self, mock_verify):
        User.objects.create_user(
            email="user@example.com",
            role=UserRole.VENUE,
            is_email_verified=True,
        )
        mock_verify.return_value = self.google_info

        response = self.client.post(
            "/users/google",
            {"token": "valid-google-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        detail = response.data["detail"]
        if isinstance(detail, list):
            detail = detail[0]
        self.assertIn("venue", detail.lower())

    @override_settings(GOOGLE_CLIENT_ID="test-client-id")
    @patch("accounts.serializers.verify_google_id_token")
    def test_venue_google_login_creates_venue_user(self, mock_verify):
        mock_verify.return_value = self.google_info

        response = self.client.post(
            "/users/venue/google",
            {"token": "valid-google-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["role"], UserRole.VENUE)

    @override_settings(GOOGLE_CLIENT_ID="")
    def test_google_login_requires_configuration(self):
        response = self.client.post(
            "/users/google",
            {"token": "valid-google-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        detail = response.data["detail"]
        if isinstance(detail, list):
            detail = detail[0]
        self.assertIn("not configured", detail.lower())


class RefreshTokenTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="refresh@example.com",
            password="SecurePass123!",
            role=UserRole.USER,
        )

    def test_login_returns_refresh_token(self):
        response = self.client.post(
            "/users/login",
            {"email": self.user.email, "password": "SecurePass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("refresh_token", response.data)
        self.assertIn("access_token", response.data)

    def test_access_token_includes_role_and_is_active_claims(self):
        response = self.client.post(
            "/users/login",
            {"email": self.user.email, "password": "SecurePass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = jwt.decode(
            response.data["access_token"],
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        self.assertEqual(payload["sub"], str(self.user.id))
        self.assertEqual(payload["role"], UserRole.USER)
        self.assertTrue(payload["is_active"])
        self.assertEqual(payload["type"], "access")

    def test_refresh_returns_new_access_token(self):
        login_response = self.client.post(
            "/users/login",
            {"email": self.user.email, "password": "SecurePass123!"},
            format="json",
        )
        refresh_token = login_response.data["refresh_token"]

        response = self.client.post(
            "/users/refresh",
            {"refresh_token": refresh_token},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertNotIn("refresh_token", response.data)

        me_response = self.client.get(
            "/users/me",
            HTTP_AUTHORIZATION=f"Bearer {response.data['access_token']}",
        )
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data["email"], self.user.email)

    def test_refresh_rejects_invalid_token(self):
        response = self.client.post(
            "/users/refresh",
            {"refresh_token": "invalid-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_rejects_access_token(self):
        login_response = self.client.post(
            "/users/login",
            {"email": self.user.email, "password": "SecurePass123!"},
            format="json",
        )

        response = self.client.post(
            "/users/refresh",
            {"refresh_token": login_response.data["access_token"]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
