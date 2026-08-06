import logging

from celery import shared_task
from django.conf import settings

from notifications.services.email_service import EmailService

logger = logging.getLogger(__name__)


@shared_task(name="send_otp_verification_email")
def send_otp_verification_email(
    *,
    to: str,
    otp: str,
    purpose_label: str = "verification",
) -> int:
    sent_count = EmailService.send(
        template_key="otp_verification",
        to=to,
        context={
            "otp_code": otp,
            "purpose_label": purpose_label,
            "expires_minutes": settings.OTP_EXPIRE_MINUTES,
        },
    )
    logger.info("Queued OTP verification email delivered to %s.", to)
    return sent_count


@shared_task(name="send_contact_admin_email")
def send_contact_admin_email(
    *,
    role: str,
    full_name: str,
    email: str,
    phone: str = "",
    city: str = "",
    venue_name: str = "",
    message: str,
) -> int:
    role_label = "Venue owner" if role == "owner" else "Guest"
    location_label = "Venue name" if role == "owner" else "City"
    location_value = venue_name if role == "owner" else city

    sent_count = EmailService.send(
        template_key="contact_admin",
        to=settings.CONTACT_NOTIFICATION_EMAIL,
        reply_to=email,
        context={
            "role": role,
            "role_label": role_label,
            "full_name": full_name,
            "email": email,
            "phone": phone or "Not provided",
            "location_label": location_label,
            "location_value": location_value,
            "message": message,
        },
    )
    logger.info("Contact form email delivered for submission from %s.", email)
    return sent_count
