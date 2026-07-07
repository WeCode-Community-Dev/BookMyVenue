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
    context = {"venue_name": "your venue", **(context or {})}
    type = _ALIASES.get(type, type)
    title, body_tmpl = _TEMPLATES.get(type, ("Notification", "You have a new notification."))
    try:
        body = body_tmpl.format(**context)
    except (KeyError, IndexError):
        body = body_tmpl  # leave placeholders rather than crash

    link = ""
    if booking_id is not None:
        url = f"{settings.frontend_base_url}/bookings/{booking_id}"
        link = f'<p><a href="{url}">View booking</a></p>'
    html = f"<h2>{title}</h2><p>{body}</p>{link}"
    return title, body, html


# ─── Auth emails (invite / password reset) ────────────────────────────────────
# Not tied to a booking_id or an in-app notification row like the templates
# above, but kept in this file so all outbound email copy lives in one place.

def render_owner_invite_email(owner_name: str | None, venue_name: str, action_link: str) -> tuple[str, str]:
    subject = "You're invited to manage your venue on Venue404"
    html = f"""
    <h2>You've been invited to Venue404</h2>
    <p>{owner_name or 'Hi'}, an admin has invited you to manage
    <strong>{venue_name}</strong> on Venue404.</p>
    <p><a href="{action_link}">Set your password and get started</a></p>
    <p>If you weren't expecting this, you can ignore this email.</p>
    """
    return subject, html


def render_password_reset_email(action_link: str) -> tuple[str, str]:
    subject = "Reset your Venue404 password"
    html = f"""
    <h2>Reset your password</h2>
    <p>We received a request to reset your Venue404 password.</p>
    <p><a href="{action_link}">Set a new password</a></p>
    <p>If you didn't request this, you can ignore this email.</p>
    """
    return subject, html
