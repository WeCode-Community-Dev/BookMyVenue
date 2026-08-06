from unittest.mock import MagicMock, patch

from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from accounts.models import AuthAccount, User, UserRole
from accounts.services.signup_session_service import (
    SignupMaxAttemptsExceededError,
    SignupResendCooldownError,
    SignupSessionError,
    SignupSessionNotFoundError,
    SignupSessionService,
)


@override_settings(
    OTP_LENGTH=6,
    OTP_EXPIRE_MINUTES=10,
    OTP_MAX_ATTEMPTS=3,
    OTP_RESEND_COOLDOWN_SECONDS=60,
)
class SignupSessionServiceTests(TestCase):
    def setUp(self):
        self.redis = MagicMock()
        self.redis.exists.return_value = False
        self.redis.get.return_value = None
        self.redis.ttl.return_value = 600
        self.patch = patch(
            "accounts.services.signup_session_service.get_redis_client",
            return_value=self.redis,
        )
        self.patch.start()
        self.addCleanup(self.patch.stop)
        self.email_patch = patch(
            "accounts.services.signup_session_service.send_otp_verification_email",
        )
        self.mock_email_task = self.email_patch.start()
        self.addCleanup(self.email_patch.stop)

    def test_start_signup_stores_hashed_password_and_otp(self):
        result = SignupSessionService.start_signup(
            email="User@Example.com",
            password="SecurePass123!",
            full_name="Test User",
            role=UserRole.USER,
        )

        self.assertEqual(result["email"], "user@example.com")
        stored_payload = self.redis.setex.call_args_list[0].args[2]
        self.assertIn("password_hash", stored_payload)
        self.assertIn("otp_hash", stored_payload)
        self.assertNotIn("SecurePass123!", stored_payload)
        self.mock_email_task.delay.assert_called_once()

    @patch("accounts.services.signup_session_service.generate_otp", return_value="123456")
    def test_verify_and_create_user_success(self, _mock_generate):
        SignupSessionService.start_signup(
            email="user@example.com",
            password="SecurePass123!",
            full_name="Test User",
            role=UserRole.USER,
        )
        stored_payload = self.redis.setex.call_args_list[0].args[2]
        self.redis.get.return_value = stored_payload

        user = SignupSessionService.verify_and_create_user(
            email="user@example.com",
            otp="123456",
            role=UserRole.USER,
        )

        self.assertEqual(user.email, "user@example.com")
        self.assertEqual(user.full_name, "Test User")
        self.assertTrue(user.is_email_verified)
        self.assertTrue(
            AuthAccount.objects.filter(user=user, provider="EMAIL").exists(),
        )
        self.redis.delete.assert_any_call("bookmyvenue:signup:user@example.com")

    def test_verify_raises_for_invalid_otp(self):
        SignupSessionService.start_signup(
            email="user@example.com",
            password="SecurePass123!",
            role=UserRole.USER,
        )
        stored_payload = self.redis.setex.call_args_list[0].args[2]
        self.redis.get.return_value = stored_payload

        with self.assertRaises(SignupSessionError):
            SignupSessionService.verify_and_create_user(
                email="user@example.com",
                otp="000000",
                role=UserRole.USER,
            )

        self.assertFalse(User.objects.filter(email="user@example.com").exists())

    def test_resend_cooldown_blocks_start_signup(self):
        self.redis.exists.return_value = True

        with self.assertRaises(SignupResendCooldownError):
            SignupSessionService.start_signup(
                email="user@example.com",
                password="SecurePass123!",
                role=UserRole.USER,
            )


@override_settings(
    OTP_LENGTH=6,
    OTP_EXPIRE_MINUTES=10,
    OTP_MAX_ATTEMPTS=3,
    OTP_RESEND_COOLDOWN_SECONDS=60,
)
class SignupWorkflowApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    @patch("accounts.views.SignupSessionService.start_signup")
    def test_register_starts_signup_and_sends_otp(self, mock_start):
        mock_start.return_value = {
            "email": "user@example.com",
            "expires_in_seconds": 600,
            "resend_cooldown_seconds": 60,
        }

        response = self.client.post(
            "/users/register",
            {
                "email": "user@example.com",
                "password": "SecurePass123!",
                "full_name": "Test User",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "user@example.com")
        mock_start.assert_called_once_with(
            email="user@example.com",
            password="SecurePass123!",
            full_name="Test User",
            role=UserRole.USER,
        )

    def test_register_rejects_registered_email(self):
        User.objects.create_user(
            email="user@example.com",
            password="SecurePass123!",
            role=UserRole.USER,
        )

        response = self.client.post(
            "/users/register",
            {
                "email": "user@example.com",
                "password": "SecurePass123!",
                "full_name": "Test User",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    @patch("accounts.views.SignupSessionService.verify_and_create_user")
    def test_verify_otp_creates_user_and_returns_token(self, mock_verify):
        user = User.objects.create_user(
            email="user@example.com",
            password="SecurePass123!",
            full_name="Test User",
            role=UserRole.USER,
            is_email_verified=True,
        )
        mock_verify.return_value = user

        response = self.client.post(
            "/users/register/verify-otp",
            {"email": "user@example.com", "otp": "123456"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access_token", response.data)
        self.assertEqual(response.data["user"]["email"], "user@example.com")
        mock_verify.assert_called_once_with(
            email="user@example.com",
            otp="123456",
            role=UserRole.USER,
        )

    @patch("accounts.views.SignupSessionService.verify_and_create_user")
    def test_verify_otp_invalid_code(self, mock_verify):
        mock_verify.side_effect = SignupSessionError("Invalid verification code.")

        response = self.client.post(
            "/users/register/verify-otp",
            {"email": "user@example.com", "otp": "123456"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    @patch("accounts.views.SignupSessionService.resend_otp")
    def test_resend_otp(self, mock_resend):
        mock_resend.return_value = {
            "email": "user@example.com",
            "expires_in_seconds": 600,
            "resend_cooldown_seconds": 60,
        }

        response = self.client.post(
            "/users/register/resend-otp",
            {"email": "user@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_resend.assert_called_once_with(
            email="user@example.com",
            role=UserRole.USER,
        )

    def test_verify_otp_rejects_non_digit_code(self):
        response = self.client.post(
            "/users/register/verify-otp",
            {"email": "user@example.com", "otp": "abcdef"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("otp", response.data)
