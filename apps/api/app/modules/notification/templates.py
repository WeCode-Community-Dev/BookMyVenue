"""Notification copy + email HTML, keyed by event type.

render_notification(type, context, booking_id) -> (title, body, html)
`context` keys are best-effort; missing keys degrade gracefully.
"""
from app.core.config import settings

# type -> (title, body template). Body templates use str.format(**context).
_TEMPLATES: dict[str, tuple[str, str]] = {
    "request_received": (
        "Booking request received",
        "We received your request for {venue_name}. The owner will respond soon.",
    ),
    "new_request_owner": (
        "New booking request",
        "You have a new booking request for {venue_name}.",
    ),
    "request_accepted": (
        "Your booking was accepted",
        "Pay the token advance within 24 hours to confirm your booking for {venue_name}.",
    ),
    "booking_rejected": (
        "Booking request declined",
        "The owner could not accept your request for {venue_name}.",
    ),
    "payment_reminder": (
        "Reminder: complete your payment",
        "Your 24-hour hold for {venue_name} is expiring soon. Pay the token advance to confirm.",
    ),
    "payment_confirmed": (
        "Booking confirmed",
        "Your booking for {venue_name} is confirmed. We look forward to your event!",
    ),
    "balance_paid": (
        "Balance paid — booking fully paid",
        "Thanks! Your balance for {venue_name} is paid and your booking is fully settled.",
    ),
    "balance_overdue": (
        "Balance payment overdue",
        "The remaining balance for {venue_name} is overdue. Please pay it to keep your booking.",
    ),
    "balance_deadline_extended": (
        "Balance deadline extended",
        "Your balance payment deadline for {venue_name} has been extended.",
    ),
    "hold_expired": (
        "Payment hold expired",
        "Your 24-hour hold for {venue_name} has expired and the slot was released.",
    ),
    "conflict_canceled": (
        "Booking unavailable",
        "Another guest confirmed {venue_name} first. Any payment you made has been refunded.",
    ),
    "booking_canceled": (
        "Booking canceled",
        "Your booking for {venue_name} was canceled.",
    ),
    "request_expired": (
        "Request expired",
        "Your booking request for {venue_name} expired before the owner responded.",
    ),
    "refund_issued": (
        "Refund issued",
        "A refund of ₹{amount_rupees} has been issued for {venue_name}.",
    ),
    "booking_completed": (
        "Booking completed",
        "Your event at {venue_name} is marked complete. Thanks for using Venue404!",
    ),
    "venue_approved": (
        "Your venue is now live",
        "Great news — {venue_name} has been approved and is now visible to customers on Venue404.",
    ),
    "venue_rejected": (
        "Venue submission rejected",
        "Your venue {venue_name} was not approved. Reason: {reason}",
    ),
    "venue_suspended": (
        "Venue suspended",
        "Your venue {venue_name} has been suspended and is no longer visible to customers. Reason: {reason}",
    ),
    "venue_reactivated": (
        "Venue reactivated",
        "Good news — {venue_name} has been reactivated and is visible to customers again.",
    ),
    "user_suspended": (
        "Your account has been suspended",
        "Your Venue404 account has been suspended. Reason: {reason}",
    ),
    "user_reactivated": (
        "Your account has been reactivated",
        "Your Venue404 account has been reactivated — you can log in and use Venue404 again.",
    ),
}

# Spelling/legacy aliases -> canonical template key. Both British and American
# spellings are valid, so either resolves to the same copy. Older raw strings
# used by callers are mapped here too, so nothing falls back to the generic copy.
_ALIASES: dict[str, str] = {
    "booking_cancelled": "booking_canceled",
    "conflict_cancelled": "conflict_canceled",
    "booking_confirmed": "payment_confirmed",
    "booking_requested": "new_request_owner",
    "booking_accepted": "request_accepted",
}


def render_notification(
    type: str, context: dict | None = None, booking_id=None
) -> tuple[str, str, str]:
    context = {"venue_name": "your venue", "reason": "No reason provided.", **(context or {})}
    type = _ALIASES.get(type, type)
    title, body_tmpl = _TEMPLATES.get(type, ("Notification", "You have a new notification."))
    try:
        body = body_tmpl.format(**context)
    except (KeyError, IndexError):
        body = body_tmpl  # leave placeholders rather than crash

    cta_url = None
    if booking_id is not None:
        cta_url = f"{settings.frontend_base_url}/bookings/{booking_id}"

    html = _email_layout(
        title=title,
        body_html=f"<p>{body}</p>",
        cta_text="View booking" if cta_url else None,
        cta_url=cta_url,
    )
    return title, body, html


# ─── Shared branded layout ──────────────────────────────────────────────────
# One inline-styled, table-based layout (email-client-safe) used by every
# outbound email — transactional notifications above and the auth emails
# below — so all of Venue404's mail looks like it came from the same product
# instead of ad hoc <h2>/<p> fragments.

_BRAND = "#285A48"
_BRAND_SECONDARY = "#408A71"


def _email_layout(
    *,
    title: str,
    body_html: str,
    cta_text: str | None = None,
    cta_url: str | None = None,
    footnote: str | None = None,
) -> str:
    cta_html = ""
    if cta_text and cta_url:
        cta_html = f"""
        <tr>
          <td style="padding:28px 40px 4px;" align="left">
            <a href="{cta_url}"
               style="display:inline-block;background:{_BRAND};color:#ffffff;text-decoration:none;
                      font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;
                      padding:12px 28px;border-radius:8px;">
              {cta_text}
            </a>
          </td>
        </tr>
        """

    footnote_html = f"""
        <tr>
          <td style="padding:20px 40px 0;">
            <p style="margin:0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;
                      line-height:1.6;color:#71717a;">
              {footnote}
            </p>
          </td>
        </tr>
        """ if footnote else ""

    return f"""\
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;
                        box-shadow:0 1px 3px rgba(0,0,0,0.06);">
            <tr>
              <td align="center" style="background:linear-gradient(135deg,{_BRAND},{_BRAND_SECONDARY});padding:28px 40px;">
                <img src="{settings.frontend_base_url}/favicon.png" width="40" height="40" alt="Venue404"
                     style="display:block;margin:0 auto 8px;border-radius:9px;" />
                <span style="font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:18px;font-weight:700;color:#ffffff;">
                  Venue<span style="color:#d7ece3;">404</span>
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 4px;">
                <h1 style="margin:0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:20px;
                           font-weight:700;color:#18181b;">
                  {title}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 40px 0;font-family:Segoe UI,Helvetica,Arial,sans-serif;
                         font-size:14px;line-height:1.65;color:#3f3f46;">
                {body_html}
              </td>
            </tr>
            {cta_html}
            {footnote_html}
            <tr>
              <td style="padding:32px 40px 28px;">
                <hr style="border:none;border-top:1px solid #f0f0f1;margin:0 0 16px;" />
                <p style="margin:0;font-family:Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;color:#a1a1aa;">
                  Venue404 — venue discovery &amp; booking marketplace.<br />
                  This is an automated email — please don't reply directly to it.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""


# ─── Auth + owner-lifecycle emails ─────────────────────────────────────────
# Not tied to a booking_id or an in-app notification row like the templates
# above, but kept in this file so all outbound email copy lives in one place.

def render_owner_invite_email(owner_name: str | None, venue_name: str, action_link: str) -> tuple[str, str]:
    subject = "You're invited to manage your venue on Venue404"
    html = _email_layout(
        title="You've been invited to Venue404",
        body_html=(
            f"<p>{owner_name or 'Hi'}, an admin has invited you to manage "
            f"<strong>{venue_name}</strong> on Venue404.</p>"
        ),
        cta_text="Set your password and get started",
        cta_url=action_link,
        footnote="If you weren't expecting this, you can safely ignore this email.",
    )
    return subject, html


def render_password_reset_email(action_link: str) -> tuple[str, str]:
    subject = "Reset your Venue404 password"
    html = _email_layout(
        title="Reset your password",
        body_html="<p>We received a request to reset your Venue404 password.</p>",
        cta_text="Set a new password",
        cta_url=action_link,
        footnote="If you didn't request this, you can safely ignore this email — your password won't change.",
    )
    return subject, html


def render_owner_approved_email(owner_name: str | None) -> tuple[str, str]:
    subject = "You're approved as a Venue404 owner"
    html = _email_layout(
        title="Your owner account is approved",
        body_html=(
            f"<p>{owner_name or 'Hi'}, your Venue404 venue owner application has been "
            "approved. You can now list venues and start receiving booking requests.</p>"
        ),
        cta_text="Go to your owner dashboard",
        cta_url=f"{settings.owner_portal_base_url}",
    )
    return subject, html


def render_owner_rejected_email(owner_name: str | None, reason: str = "") -> tuple[str, str]:
    subject = "Update on your Venue404 owner application"
    reason_html = f"<p><strong>Reason:</strong> {reason}</p>" if reason else ""
    html = _email_layout(
        title="Your owner application wasn't approved",
        body_html=(
            f"<p>{owner_name or 'Hi'}, we've reviewed your Venue404 venue owner application "
            "and it wasn't approved this time.</p>"
            f"{reason_html}"
            "<p>You're welcome to re-apply once you've addressed the above.</p>"
        ),
    )
    return subject, html
