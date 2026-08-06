from unittest.mock import ANY, MagicMock, patch

from django.core import mail
from django.test import TestCase, override_settings

from notifications.services.email_service import EmailService
from notifications.services.otp_service import (
    OtpMaxAttemptsExceededError,
    OtpNotFoundError,
    OtpPurpose,
    OtpResendCooldownError,
    OtpService,
)
from notifications.services.signup_otp_service import SignupOtpService


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    APP_NAME="BookMyVenue",
    APP_SUPPORT_EMAIL="support@example.com",
    OTP_LENGTH=6,
    OTP_EXPIRE_MINUTES=10,
    OTP_MAX_ATTEMPTS=3,
    OTP_RESEND_COOLDOWN_SECONDS=60,
)
class EmailServiceTests(TestCase):
    def test_send_otp_verification_email(self):
        EmailService.send(
            template_key="otp_verification",
            to="user@example.com",
            context={
                "otp_code": "123456",
                "purpose_label": "account registration",
                "expires_minutes": 10,
            },
        )

        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ["user@example.com"])
        self.assertIn("123456", message.body)
        self.assertEqual(len(message.alternatives), 1)
        html_body = message.alternatives[0][0]
        self.assertIn("123456", html_body)
        self.assertIn("BookMyVenue", message.subject)

    def test_unknown_template_raises_error(self):
        with self.assertRaises(ValueError):
            EmailService.send(
                template_key="does_not_exist",
                to="user@example.com",
            )


@override_settings(
    OTP_LENGTH=6,
    OTP_EXPIRE_MINUTES=10,
    OTP_MAX_ATTEMPTS=3,
    OTP_RESEND_COOLDOWN_SECONDS=60,
)
class OtpServiceTests(TestCase):
    def setUp(self):
        self.redis = MagicMock()
        self.redis.exists.return_value = False
        self.redis.get.return_value = None
        self.redis.ttl.return_value = 600
        self.patch = patch(
            "notifications.services.otp_service.get_redis_client",
            return_value=self.redis,
        )
        self.patch.start()
        self.addCleanup(self.patch.stop)

    def test_create_stores_hashed_otp_with_expiry(self):
        otp = OtpService.create(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination="User@Example.com",
        )

        self.assertEqual(len(otp), 6)
        self.assertTrue(otp.isdigit())
        self.redis.setex.assert_any_call(
            "bookmyvenue:otp:email_signup:user@example.com",
            600,
            ANY,
        )
        stored_payload = self.redis.setex.call_args_list[0].args[2]
        self.assertNotIn(otp, stored_payload)

    def test_verify_returns_true_for_valid_otp(self):
        otp = OtpService.create(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination="user@example.com",
        )
        stored_payload = self.redis.setex.call_args_list[0].args[2]
        self.redis.get.return_value = stored_payload

        self.assertTrue(
            OtpService.verify(
                purpose=OtpPurpose.EMAIL_SIGNUP,
                destination="user@example.com",
                otp=otp,
            ),
        )
        self.redis.delete.assert_any_call(
            "bookmyvenue:otp:email_signup:user@example.com",
        )

    def test_verify_returns_false_for_invalid_otp(self):
        otp = OtpService.create(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination="user@example.com",
        )
        stored_payload = self.redis.setex.call_args_list[0].args[2]
        self.redis.get.return_value = stored_payload

        self.assertFalse(
            OtpService.verify(
                purpose=OtpPurpose.EMAIL_SIGNUP,
                destination="user@example.com",
                otp="000000" if otp != "000000" else "111111",
            ),
        )

    def test_verify_raises_when_otp_missing_or_expired(self):
        with self.assertRaises(OtpNotFoundError):
            OtpService.verify(
                purpose=OtpPurpose.EMAIL_SIGNUP,
                destination="user@example.com",
                otp="123456",
            )

    def test_exists_and_remaining_ttl(self):
        OtpService.create(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination="user@example.com",
        )

        self.assertTrue(
            OtpService.exists(
                purpose=OtpPurpose.EMAIL_SIGNUP,
                destination="user@example.com",
            ),
        )
        self.assertEqual(
            OtpService.remaining_ttl(
                purpose=OtpPurpose.EMAIL_SIGNUP,
                destination="user@example.com",
            ),
            600,
        )

    def test_resend_cooldown_blocks_new_otp(self):
        self.redis.exists.return_value = True

        with self.assertRaises(OtpResendCooldownError):
            OtpService.create(
                purpose=OtpPurpose.EMAIL_SIGNUP,
                destination="user@example.com",
            )

    def test_max_attempts_exceeded_raises_error(self):
        otp = OtpService.create(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination="user@example.com",
        )
        stored_payload = self.redis.setex.call_args_list[0].args[2]
        self.redis.get.return_value = stored_payload

        for _ in range(2):
            self.assertFalse(
                OtpService.verify(
                    purpose=OtpPurpose.EMAIL_SIGNUP,
                    destination="user@example.com",
                    otp="000000" if otp != "000000" else "111111",
                ),
            )

        with self.assertRaises(OtpMaxAttemptsExceededError):
            OtpService.verify(
                purpose=OtpPurpose.EMAIL_SIGNUP,
                destination="user@example.com",
                otp="000000" if otp != "000000" else "111111",
            )


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    OTP_LENGTH=6,
    OTP_EXPIRE_MINUTES=10,
    OTP_MAX_ATTEMPTS=3,
    OTP_RESEND_COOLDOWN_SECONDS=60,
)
class SignupOtpServiceTests(TestCase):
    def setUp(self):
        self.redis = MagicMock()
        self.redis.exists.return_value = False
        self.redis.get.return_value = None
        self.redis.ttl.return_value = 600
        self.patch = patch(
            "notifications.services.otp_service.get_redis_client",
            return_value=self.redis,
        )
        self.patch.start()
        self.addCleanup(self.patch.stop)

    def test_send_email_otp_sync(self):
        SignupOtpService.send_email_otp("user@example.com", async_send=False)

        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("account registration", mail.outbox[0].body)

    @patch("notifications.services.signup_otp_service.send_otp_verification_email")
    def test_send_email_otp_async(self, mock_task):
        SignupOtpService.send_email_otp("user@example.com", async_send=True)

        mock_task.delay.assert_called_once()
        self.assertEqual(mock_task.delay.call_args.kwargs["to"], "user@example.com")
        self.assertEqual(len(mail.outbox), 0)
