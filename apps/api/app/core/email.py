"""Email transport: Resend primary, SMTP fallback.

`send_email` picks a transport at call time:
  1. RESEND_API_KEY set        -> send via Resend
  2. else SMTP_HOST set        -> send via SMTP
  3. else (dev, nothing set)   -> log and no-op (never raises in dev)

Returns True if an email was actually dispatched, False if it was a dev no-op.
"""

import logging
import smtplib
import socket
from email.message import EmailMessage
from email.utils import formatdate, make_msgid

from app.core.config import settings

logger = logging.getLogger(__name__)


def _create_ipv4_connection(host: str, port: int, timeout) -> socket.socket:
    """Some hosts (observed on Render) resolve smtp.gmail.com's IPv6 address
    first with no IPv6 route at all, failing instantly with "Network is
    unreachable" before ever trying the IPv4 address that would have worked.
    Restrict resolution to IPv4 to sidestep that.
    """
    last_exc: OSError = OSError(f"No IPv4 address found for {host}:{port}")
    for family, socktype, proto, _, sockaddr in socket.getaddrinfo(
        host, port, socket.AF_INET, socket.SOCK_STREAM
    ):
        sock = socket.socket(family, socktype, proto)
        try:
            # smtplib passes its own default (socket._GLOBAL_DEFAULT_TIMEOUT, a
            # sentinel object, not a number) when no timeout= was given to the
            # constructor — settimeout() can't take that directly. Mirror what
            # socket.create_connection itself does: skip the call entirely and
            # let the socket keep its default (blocking, no timeout).
            if timeout is not socket._GLOBAL_DEFAULT_TIMEOUT:
                sock.settimeout(timeout)
            sock.connect(sockaddr)
            return sock
        except OSError as exc:
            sock.close()
            last_exc = exc
    raise last_exc


class _IPv4SMTP(smtplib.SMTP):
    def _get_socket(self, host, port, timeout):
        return _create_ipv4_connection(host, port, timeout)


def send_email(to: str, subject: str, html: str, reply_to: str | None = None) -> bool:
    if settings.resend_api_key:
        return _send_via_resend(to, subject, html, reply_to)
    if settings.smtp_host:
        return _send_via_smtp(to, subject, html, reply_to)
    logger.warning(
        "No email transport configured (RESEND_API_KEY / SMTP_HOST unset); "
        "skipping email to %s: %r",
        to,
        subject,
    )
    return False


def _send_via_resend(to: str, subject: str, html: str, reply_to: str | None = None) -> bool:
    import resend

    resend.api_key = settings.resend_api_key
    payload = {
        "from": settings.email_from,
        "to": [to],
        "subject": subject,
        "html": html,
    }
    if reply_to:
        payload["reply_to"] = [reply_to]
    resend.Emails.send(payload)
    logger.info("Sent email via Resend to %s: %r", to, subject)
    return True


def _send_via_smtp(to: str, subject: str, html: str, reply_to: str | None = None) -> bool:
    msg = EmailMessage()
    msg["From"] = settings.email_from
    msg["To"] = to
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain=settings.smtp_host)
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content("This email requires an HTML-capable client.")
    msg.add_alternative(html, subtype="html")

    with _IPv4SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
        server.starttls()
        if settings.smtp_user:
            server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(msg)
    logger.info("Sent email via SMTP to %s: %r", to, subject)
    return True
