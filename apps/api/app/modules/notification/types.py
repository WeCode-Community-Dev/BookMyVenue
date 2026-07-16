"""Canonical notification type identifiers.

Producers (booking, payment, jobs) should reference these constants instead of
raw strings so a type can never drift from a template key. Both British and
American spellings resolve to the same template (see ALIASES in templates.py),
so callers are free to use either spelling.
"""


class NotificationType:
    REQUEST_RECEIVED = "request_received"
    NEW_REQUEST_OWNER = "new_request_owner"
    REQUEST_ACCEPTED = "request_accepted"
    BOOKING_REJECTED = "booking_rejected"
    PAYMENT_REMINDER = "payment_reminder"
    PAYMENT_CONFIRMED = "payment_confirmed"
    BALANCE_PAID = "balance_paid"
    BALANCE_OVERDUE = "balance_overdue"
    BALANCE_DEADLINE_EXTENDED = "balance_deadline_extended"
    HOLD_EXPIRED = "hold_expired"
    CONFLICT_CANCELED = "conflict_canceled"
    BOOKING_CANCELED = "booking_canceled"
    REQUEST_EXPIRED = "request_expired"
    REFUND_ISSUED = "refund_issued"
    BOOKING_COMPLETED = "booking_completed"
    VENUE_APPROVED = "venue_approved"
    VENUE_REJECTED = "venue_rejected"
    VENUE_SUSPENDED = "venue_suspended"
    VENUE_REACTIVATED = "venue_reactivated"
    USER_SUSPENDED = "user_suspended"
    USER_REACTIVATED = "user_reactivated"
    ADMIN_PASSWORD_RESET_REQUESTED = "admin_password_reset_requested"
