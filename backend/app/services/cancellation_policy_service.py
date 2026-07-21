from datetime import date, timedelta
from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException

from app.models.booking import Booking
from app.models.venue import Venue


def venue_has_policy(venue: Venue | None) -> bool:
    if not venue:
        return False
    return (
        venue.refund_50_days_before is not None
        and venue.refund_25_days_before is not None
        and venue.cancel_cutoff_days_before is not None
    )


def validate_cancellation_policy_fields(
    refund_50_days_before: int | None,
    refund_25_days_before: int | None,
    cancel_cutoff_days_before: int | None,
) -> None:
    values = (refund_50_days_before, refund_25_days_before, cancel_cutoff_days_before)
    if all(v is None for v in values):
        return
    if any(v is None for v in values):
        raise HTTPException(
            status_code=400,
            detail="Set all three cancellation policy fields or leave all empty",
        )
    if min(values) < 1:
        raise HTTPException(
            status_code=400,
            detail="Cancellation policy days must be at least 1",
        )
    if not (refund_50_days_before > refund_25_days_before > cancel_cutoff_days_before):
        raise HTTPException(
            status_code=400,
            detail=(
                "Cancellation policy must be ordered: full-refund days > "
                "50% refund days > last-cancel days"
            ),
        )


def _deadline(check_in: date, days_before: int) -> date:
    return check_in - timedelta(days=days_before)


def _quantize_amount(amount: Decimal) -> float:
    return float(amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def evaluate_policy(
    venue: Venue | None,
    booking: Booking,
    *,
    today: date | None = None,
) -> dict:
    today = today or date.today()
    check_in = booking.check_in_date
    days_remaining = (check_in - today).days

    base = {
        "refund_50_deadline": None,
        "refund_25_deadline": None,
        "last_cancel_date": None,
        "refund_percent": 0,
        "refund_amount": 0.0,
        "can_cancel": False,
    }

    if booking.status in ("cancelled", "completed"):
        return base

    if days_remaining < 0:
        return base

    amount = Decimal(str(booking.amount))
    is_paid = booking.status == "booked"

    if not venue_has_policy(venue):
        base["can_cancel"] = True
        base["refund_percent"] = 100 if is_paid else 0
        base["refund_amount"] = _quantize_amount(amount) if is_paid else 0.0
        return base

    assert venue is not None
    base["refund_50_deadline"] = _deadline(check_in, venue.refund_50_days_before)
    base["refund_25_deadline"] = _deadline(check_in, venue.refund_25_days_before)
    base["last_cancel_date"] = _deadline(check_in, venue.cancel_cutoff_days_before)

    if days_remaining < venue.cancel_cutoff_days_before:
        return base

    base["can_cancel"] = True

    if days_remaining >= venue.refund_50_days_before:
        refund_percent = 100
    elif days_remaining >= venue.refund_25_days_before:
        refund_percent = 50
    else:
        refund_percent = 25

    base["refund_percent"] = refund_percent if is_paid else 0
    if is_paid and refund_percent > 0:
        refund_amount = amount * Decimal(refund_percent) / Decimal(100)
        base["refund_amount"] = _quantize_amount(refund_amount)
    else:
        base["refund_amount"] = 0.0

    return base
