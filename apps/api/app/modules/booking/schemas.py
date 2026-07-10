from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, computed_field

BookingTypeValue = Literal["full_day", "time_slot"]


class BookingRequestIn(BaseModel):
    venue_id: UUID
    venue_name: str
    venue_cover_image: str | None
    booking_type: BookingTypeValue
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    booking_date: date | None = None
    guest_count: int = Field(gt=0)
    event_type: str | None = None
    user_notes: str | None = None
    expected_total_paise: int | None = None


class PaymentOption(BaseModel):
    label: str
    amount_paise: int
    display_amount: str


class PaymentOptions(BaseModel):
    advance: PaymentOption
    full: PaymentOption


class BookingDisplay(BaseModel):
    quoted_price: str
    advance_due: str
    balance_due: str
    platform_fee: str
    owner_payout: str


class BookingOut(BaseModel):
    id: UUID
    venue_id: UUID
    venue_name: str
    venue_city: str
    venue_cover_photo_url: str | None = None
    user_id: UUID
    user_full_name: str | None = None
    user_email: str | None = None
    user_phone: str | None = None
    booking_type: str
    status: str
    payment_status: str
    starts_at: datetime
    ends_at: datetime
    created_at: datetime | None = None
    effective_starts_at: datetime
    effective_ends_at: datetime
    guest_count: int
    event_type: str | None = None
    user_notes: str | None = None
    owner_notes: str | None = None
    quoted_price_paise: int
    platform_commission_pct: float
    platform_fee_paise: int
    owner_payout_paise: int
    advance_pct: float
    advance_due_paise: int
    balance_due_paise: int
    balance_due_date: date | None = None
    hold_expires_at: datetime | None = None
    confirmed_at: datetime | None = None
    cancelled_at: datetime | None = None
    expired_at: datetime | None = None
    amount_paid_paise: int
    refund_amount_paise: int
    stripe_advance_payment_intent_id: str | None = None
    stripe_balance_payment_intent_id: str | None = None
    deadline_extension_count: int
    balance_overdue_at: datetime | None = None
    owner_action_deadline: datetime | None = None
    display: BookingDisplay
    payment_required: bool = False
    payment_options: PaymentOptions | None = None
    client_secret: str | None = None
    payment_expires_at: datetime | None = None
    auto_confirmed_at: datetime | None = None
    confirmed_by: str | None = None
    invoice_url: str | None = None

    @computed_field
    @property
    def final_owner_payout_paise(self) -> int:
        if self.status in ("user_cancelled", "owner_cancelled", "rejected"):
            net = (
                (self.amount_paid_paise or 0)
                - (self.refund_amount_paise or 0)
                - (self.platform_fee_paise or 0)
            )
            return max(0, net)
        return self.owner_payout_paise or 0


class CancellationDisplay(BaseModel):
    refund_amount: str
    penalty_amount: str


class CancellationPreviewOut(BaseModel):
    refund_amount_paise: int
    penalty_amount_paise: int
    refund_pct_applied: float
    tier_matched: str | None
    display: CancellationDisplay


class OwnerAcceptIn(BaseModel):
    pass


class OwnerRejectIn(BaseModel):
    reason: str = Field(min_length=1)


class ExtendDeadlineIn(BaseModel):
    new_due_date: date


class UpdateOwnerNotesIn(BaseModel):
    notes: str | None


BookingResponse = BookingOut
CreateBookingRequest = BookingRequestIn
