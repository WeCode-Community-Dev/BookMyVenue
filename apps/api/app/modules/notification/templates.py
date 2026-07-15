"""Notification copy + email HTML, keyed by event type.

render_notification(type, context, booking_id) -> (title, body, html)
`context` keys are best-effort; missing keys degrade gracefully.
"""

import html as html_lib

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
        "Balance paid - booking fully paid",
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
        "Great news, {venue_name} has been approved and is now visible to customers on Venue404.",
    ),
    "venue_rejected": (
        "Venue submission rejected",
        "Your venue {venue_name} was not approved. Reason: {reason}",
    ),
    "venue_suspended": (
        "Venue suspended",
        "Your venue {venue_name} has been suspended and is no longer visible "
        "to customers. Reason: {reason}",
    ),
    "venue_reactivated": (
        "Venue reactivated",
        "Good news, {venue_name} has been reactivated and is visible to customers again.",
    ),
    "user_suspended": (
        "Your account has been suspended",
        "Your Venue404 account has been suspended. Reason: {reason}",
    ),
    "user_reactivated": (
        "Your account has been reactivated",
        "Your Venue404 account has been reactivated. You can log in and use Venue404 again.",
    ),
    "admin_password_reset_requested": (
        "Security alert: admin password reset requested",
        "A password reset was requested for the admin account {target_email}. "
        "If this wasn't expected, investigate immediately.",
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
# outbound email, transactional notifications above and the auth emails
# below, so all of Venue404's mail looks like it came from the same product
# instead of ad hoc <h2>/<p> fragments.
#
# No <img> logo: the icon is served from the frontend's runtime-generated
# favicon, which isn't a stable public asset email clients can fetch. The
# wordmark below is pure CSS/text so it always renders.

_BRAND = "#285A48"
_BRAND_SECONDARY = "#408A71"
_FONT = "-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif"
_SUPPORT_EMAIL = "venue404.support@gmail.com"


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
          <td style="padding:8px 40px 4px;" align="left">
            <a href="{cta_url}"
               style="display:inline-block;background:{_BRAND};color:#ffffff;
                      text-decoration:none;font-family:{_FONT};font-size:14px;
                      font-weight:600;letter-spacing:-0.01em;
                      padding:13px 30px;border-radius:10px;
                      box-shadow:0 1px 2px rgba(40,90,72,0.25);">
              {cta_text}
            </a>
          </td>
        </tr>
        """

    footnote_html = (
        f"""
        <tr>
          <td style="padding:18px 40px 0;">
            <p style="margin:0;font-family:{_FONT};font-size:12.5px;
                      line-height:1.65;color:#71717a;">
              {footnote}
            </p>
          </td>
        </tr>
        """
        if footnote
        else ""
    )

    return f"""\
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>{title}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background:#ffffff;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;
                        border:1px solid #e4e4e7;box-shadow:0 4px 16px rgba(24,24,27,0.07);">
            <tr>
              <td align="center"
                  style="background:linear-gradient(135deg,{_BRAND},{_BRAND_SECONDARY});
                         padding:40px 40px 34px;">
                <div style="font-family:{_FONT};font-size:23px;font-weight:800;
                            letter-spacing:-0.02em;color:#ffffff;">
                  Venue<span style="color:#cdeee1;">404</span>
                </div>
                <div style="margin-top:8px;font-family:{_FONT};font-size:11px;font-weight:600;
                            letter-spacing:0.08em;text-transform:uppercase;
                            color:rgba(255,255,255,0.72);">
                  Venue Discovery &amp; Booking
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px 4px;">
                <h1 style="margin:0;font-family:{_FONT};font-size:21px;
                           font-weight:700;letter-spacing:-0.01em;color:#18181b;">
                  {title}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 40px 0;font-family:{_FONT};
                         font-size:14.5px;line-height:1.7;color:#3f3f46;">
                {body_html}
              </td>
            </tr>
            {cta_html}
            {footnote_html}
            <tr>
              <td style="padding:32px 0 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                       style="background:#fafafa;border-top:1px solid #f0f0f1;">
                  <tr>
                    <td style="padding:22px 40px 26px;font-family:{_FONT};">
                      <p style="margin:0 0 4px;font-size:12px;color:#a1a1aa;">
                        Venue404, venue discovery and booking marketplace.
                      </p>
                      <p style="margin:0;font-size:12px;color:#a1a1aa;">
                        Automated message, please don't reply directly. Need help? Email
                        <a href="mailto:{_SUPPORT_EMAIL}"
                           style="color:{_BRAND};text-decoration:none;font-weight:600;">
                          {_SUPPORT_EMAIL}
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>
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


def render_owner_invite_email(
    owner_name: str | None, venue_name: str, action_link: str
) -> tuple[str, str]:
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


def render_signup_confirmation_email(action_link: str) -> tuple[str, str]:
    subject = "Confirm your Venue404 email address"
    html = _email_layout(
        title="Confirm your email",
        body_html=(
            "<p>Thanks for signing up! Confirm your email address to finish "
            "creating your Venue404 account.</p>"
        ),
        cta_text="Confirm email address",
        cta_url=action_link,
        footnote="If you didn't create this account, you can safely ignore this email.",
    )
    return subject, html


def render_password_reset_email(action_link: str) -> tuple[str, str]:
    subject = "Reset your Venue404 password"
    html = _email_layout(
        title="Reset your password",
        body_html="<p>We received a request to reset your Venue404 password.</p>",
        cta_text="Set a new password",
        cta_url=action_link,
        footnote=(
            "If you didn't request this, you can safely ignore this email. "
            "Your password won't change."
        ),
    )
    return subject, html


def render_booking_invoice_email(
    customer_name: str | None,
    venue_name: str,
    pdf_url: str,
    fully_paid: bool = False,
) -> tuple[str, str]:
    """The customer's combined confirmation/payment email — deliberately held
    back by confirm_payment / confirm_balance_payment (notify(...,
    skip_email=True)) and sent from here once the (re)generated invoice PDF
    exists, so the customer gets one email with the invoice attached rather
    than a status email followed by a separate invoice email.

    fully_paid=True is the balance-settlement case: the invoice was
    regenerated to reflect the booking going from advance_paid to
    fully_paid, so the copy reflects "fully paid" rather than "confirmed".
    """
    if fully_paid:
        subject = f"Balance paid - your updated Venue404 invoice for {venue_name}"
        title = "Your booking is fully paid"
        body_html = (
            f"<p>{customer_name or 'Hi'}, we've received your balance payment for "
            f"<strong>{venue_name}</strong>. Your booking is now fully paid. "
            "Here's your updated invoice.</p>"
        )
    else:
        subject = f"Booking confirmed - your Venue404 invoice for {venue_name}"
        title = "Your booking is confirmed"
        body_html = (
            f"<p>{customer_name or 'Hi'}, your booking for <strong>{venue_name}</strong> is "
            "confirmed. We look forward to your event!</p>"
        )

    html = _email_layout(
        title=title,
        body_html=body_html,
        cta_text="Download your invoice",
        cta_url=pdf_url,
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


def render_contact_message_email(
    name: str, email: str, subject: str, message: str
) -> tuple[str, str]:
    """The "Contact Us" form submission, forwarded to the support inbox.
    User-supplied fields are HTML-escaped since they're interpolated directly.
    """
    safe_name = html_lib.escape(name)
    safe_email = html_lib.escape(email)
    safe_subject = html_lib.escape(subject)
    safe_message = html_lib.escape(message).replace("\n", "<br />")

    email_subject = f"[Contact] {subject}"
    meta_html = f"""
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="margin:14px 0 18px;background:#fafafa;border:1px solid #f0f0f1;
                  border-radius:12px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 6px;font-size:12.5px;color:#71717a;">
            <span style="font-weight:600;color:#52525b;">From</span>
            &nbsp;{safe_name} &lt;{safe_email}&gt;
          </p>
          <p style="margin:0;font-size:12.5px;color:#71717a;">
            <span style="font-weight:600;color:#52525b;">Subject</span>
            &nbsp;{safe_subject}
          </p>
        </td>
      </tr>
    </table>
    """
    body_html = (
        "<p>New message submitted through the Venue404 Contact Us form.</p>"
        f"{meta_html}"
        f'<p style="white-space:pre-wrap;">{safe_message}</p>'
    )
    html = _email_layout(title="New contact form message", body_html=body_html)
    return email_subject, html
