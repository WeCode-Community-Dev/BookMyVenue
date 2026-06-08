import aiosmtplib
from email.message import EmailMessage
from core.config import settings
import logging

logger = logging.getLogger(__name__)

async def send_email(to_email: str, subject: str, body: str):
    """
    Sends an email asynchronously using aiosmtplib.
    """
    message = EmailMessage()
    message["From"] = settings.SMTP_USER
    message["To"] = to_email
    message["Subject"] = subject
    message.set_content(body)

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=settings.SMTP_TLS,
        )
        logger.info(f"Email sent successfully to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")

async def notify_booking_status(user_email: str, venue_name: str, status: str):
    """
    Helper function to send booking status emails.
    """
    subject = f"BookMyVenue - Booking {status.capitalize()}"
    body = f"Hello,\n\nYour booking for {venue_name} has been {status.lower()}.\n\nThank you for using BookMyVenue!"
    
    # Send email asynchronously (fire and forget)
    import asyncio
    asyncio.create_task(send_email(user_email, subject, body))
