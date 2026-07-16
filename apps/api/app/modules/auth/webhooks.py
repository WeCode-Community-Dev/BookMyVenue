"""Supabase "Send Email" Auth Hook entrypoint.

Supabase itself only generates the confirmation/recovery token; instead of
sending the email through its own mailer (which needs a verified sending
domain we don't have — see auth/service.py::request_password_reset for the
same reasoning), it POSTs the token here and we send the email ourselves via
core/email.py. Configured in supabase/config.toml under
[auth.hook.send_email] to point at this endpoint.

Verification follows the Standard Webhooks spec Supabase uses for hooks:
https://www.standardwebhooks.com/ — headers webhook-id/webhook-timestamp/
webhook-signature, secret shaped "v1,whsec_<base64>".
"""

import base64
import hashlib
import hmac
import json
import logging
import time

from fastapi import HTTPException, Request

from app.core.config import settings
from app.core.email import send_email
from app.modules.notification.templates import render_signup_confirmation_email

logger = logging.getLogger(__name__)

_TOLERANCE_SECONDS = 5 * 60


def _verify_signature(request_id: str, timestamp: str, body: bytes, signature_header: str) -> None:
    secret = settings.supabase_auth_hook_secret
    if not secret:
        logger.warning("SUPABASE_AUTH_HOOK_SECRET unset — skipping signature verification")
        return

    try:
        age = abs(time.time() - int(timestamp))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid webhook-timestamp")
    if age > _TOLERANCE_SECONDS:
        raise HTTPException(status_code=400, detail="Webhook timestamp outside tolerance")

    secret_bytes = base64.b64decode(secret.removeprefix("v1,").removeprefix("whsec_"))
    signed_content = f"{request_id}.{timestamp}.{body.decode()}"
    expected = base64.b64encode(
        hmac.new(secret_bytes, signed_content.encode(), hashlib.sha256).digest()
    ).decode()

    provided = [sig.split(",", 1)[-1] for sig in signature_header.split()]
    if not any(hmac.compare_digest(expected, sig) for sig in provided):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")


async def handle_send_email(request: Request):
    body = await request.body()

    _verify_signature(
        request.headers.get("webhook-id", ""),
        request.headers.get("webhook-timestamp", ""),
        body,
        request.headers.get("webhook-signature", ""),
    )

    payload = json.loads(body)
    user = payload.get("user", {})
    email_data = payload.get("email_data", {})

    email = user.get("email")
    action_type = email_data.get("email_action_type")
    token_hash = email_data.get("token_hash")
    redirect_to = email_data.get("redirect_to", "")

    if not email or not token_hash:
        raise HTTPException(status_code=400, detail="Missing user email or token_hash")

    action_link = (
        f"{settings.supabase_url}/auth/v1/verify"
        f"?token={token_hash}&type={action_type}&redirect_to={redirect_to}"
    )

    if action_type == "signup":
        subject, html = render_signup_confirmation_email(action_link)
    else:
        # Recovery/invite already go through our own custom flows (which
        # generate a link without asking Supabase to email it), so this
        # shouldn't fire in practice — log and no-op rather than send a
        # confusing generic email.
        logger.warning(
            "Unhandled Supabase auth hook email_action_type=%r for %s", action_type, email
        )
        return {"status": "ignored"}

    try:
        send_email(email, subject, html)
    except Exception as exc:
        logger.exception("Failed to send %s confirmation email to %s", action_type, email)
        raise HTTPException(status_code=500, detail="Error sending confirmation email") from exc

    return {}
