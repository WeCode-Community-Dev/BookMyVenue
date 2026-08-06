from django.conf import settings

from notifications.services.email_service import EmailService
from notifications.services.otp_service import OtpPurpose, OtpService
from notifications.services.redis_client import RedisUnavailableError
from notifications.tasks import send_otp_verification_email

__all__ = ["RedisUnavailableError", "SignupOtpService"]


class SignupOtpService:
    @staticmethod
    def send_email_otp(email: str, *, async_send: bool = True) -> dict:
        normalized_email = email.strip().lower()
        otp = OtpService.create(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination=normalized_email,
        )

        if async_send:
            send_otp_verification_email.delay(
                to=normalized_email,
                otp=otp,
                purpose_label="account registration",
            )
        else:
            EmailService.send(
                template_key="otp_verification",
                to=normalized_email,
                context={
                    "otp_code": otp,
                    "purpose_label": "account registration",
                    "expires_minutes": settings.OTP_EXPIRE_MINUTES,
                },
            )

        return {
            "email": normalized_email,
            "expires_in_seconds": settings.OTP_EXPIRE_MINUTES * 60,
            "resend_cooldown_seconds": settings.OTP_RESEND_COOLDOWN_SECONDS,
        }

    @staticmethod
    def verify_email_otp(email: str, otp: str) -> bool:
        return OtpService.verify(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination=email.strip().lower(),
            otp=otp,
        )

    @staticmethod
    def get_pending_verification(email: str) -> dict | None:
        normalized_email = email.strip().lower()
        if not OtpService.exists(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination=normalized_email,
        ):
            return None

        remaining_ttl = OtpService.remaining_ttl(
            purpose=OtpPurpose.EMAIL_SIGNUP,
            destination=normalized_email,
        )
        if remaining_ttl is None:
            return None

        return {
            "email": normalized_email,
            "expires_in_seconds": remaining_ttl,
        }
