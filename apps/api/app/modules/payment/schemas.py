from typing import Literal

from pydantic import BaseModel


class CreatePaymentRequest(BaseModel):
    booking_id: str
    # "advance" (token, confirms the booking) or "balance" (settles a confirmed
    # booking). Amount is computed server-side from the venue pricing snapshot —
    # never trusted from the client.
    payment_type: Literal["advance", "balance", "full"] = "advance"


class PaymentIntentResponse(BaseModel):
    payment_id: str
    booking_id: str
    client_secret: str | None
    amount_paise: int
    currency: str
    status: str


class PaymentResponse(BaseModel):
    id: str
    booking_id: str
    amount_paise: int
    currency: str
    status: str
    stripe_payment_intent_id: str


class RefundRequest(BaseModel):
    booking_id: str
    reason: str | None = None


class RefundResponse(BaseModel):
    booking_id: str
    refunded_paise: int
    status: str


class OwnerLedgerStatsResponse(BaseModel):
    gross_volume_paise: int
    platform_fees_paise: int
    refunds_issued_paise: int
    net_revenue_paise: int
    payouts_completed_paise: int
    available_balance_paise: int


class LedgerEntryResponse(BaseModel):
    id: str
    booking_id: str
    venue_id: str
    venue_name: str | None = None
    user_full_name: str | None = None
    entry_type: str
    amount_paise: int
    direction: str
    stripe_pi_ref: str | None = None
    created_at: str
