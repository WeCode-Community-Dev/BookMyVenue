"""Email transport: Resend primary, SMTP fallback.

`send_email` picks a transport at call time:
  1. RESEND_API_KEY set        -> send via Resend
  2. else SMTP_HOST set        -> send via SMTP
  3. else (dev, nothing set)   -> log and no-op (never raises in dev)

Returns True if an email was actually dispatched, False if it was a dev no-op.
"""

import logging
import smtplib
from email.message import EmailMessage
from email.utils import formatdate, make_msgid

from app.core.config import settings

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, html: str) -> bool:
    if settings.resend_api_key:
        return _send_via_resend(to, subject, html)
    if settings.smtp_host:
        return _send_via_smtp(to, subject, html)
    logger.warning(
        "No email transport configured (RESEND_API_KEY / SMTP_HOST unset); "
        "skipping email to %s: %r",
        to,
        subject,
    )
    return False


def _send_via_resend(to: str, subject: str, html: str) -> bool:
    import resend

    resend.api_key = settings.resend_api_key
    resend.Emails.send(
        {
            "from": settings.email_from,
            "to": [to],
            "subject": subject,
            "html": html,
        }
    )
    logger.info("Sent email via Resend to %s: %r", to, subject)
    return True


def _send_via_smtp(to: str, subject: str, html: str) -> bool:
    msg = EmailMessage()
    msg["From"] = settings.email_from
    msg["To"] = to
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain=settings.smtp_host)
    msg.set_content("This email requires an HTML-capable client.")
    msg.add_alternative(html, subtype="html")

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.starttls()
        if settings.smtp_user:
            server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(msg)
    logger.info("Sent email via SMTP to %s: %r", to, subject)
    return True
