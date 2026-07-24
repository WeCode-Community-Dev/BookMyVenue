import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.payment import Payment
from app.models.booking import Booking
from app.models.venue import Venue
from app.models.user import User
from app.schemas.payment import PaymentInitiate, PaymentConfirm, PaymentOut
from app.services.razorpay_service import (
    create_order,
    get_key_id,
    verify_payment_signature,
)

ORDER_TTL_MINUTES = 30
VALID_OPTIONS = {"full", "advance", "pay_at_venue"}


def generate_payment_id() -> str:
    return "pay_" + uuid.uuid4().hex[:12]


def _amount_paise(amount: Decimal) -> int:
    return int(amount * 100)


def _quantize(amount: Decimal) -> Decimal:
    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _order_is_valid(payment: Payment) -> bool:
    if not payment.gateway_order_id:
        return False
    if payment.expires_at is None:
        return True
    return payment.expires_at > datetime.now(timezone.utc)


def payment_to_out(payment: Payment, booking: Booking | None = None) -> PaymentOut:
    key_id = None
    try:
        key_id = get_key_id()
    except HTTPException:
        pass

    amount_paid = float(booking.amount_paid) if booking else None
    balance_due = float(booking.balance_due) if booking else None
    booking_total = float(booking.amount) if booking else None

    # While an online order is open, show the balance that will remain after this charge.
    if (
        booking is not None
        and payment.status == "created"
        and payment.payment_type in ("full", "advance")
    ):
        projected_paid = _quantize(
            Decimal(str(booking.amount_paid or 0)) + Decimal(str(payment.amount))
        )
        total = _quantize(Decimal(str(booking.amount)))
        if projected_paid > total:
            projected_paid = total
        amount_paid = float(projected_paid)
        balance_due = float(_quantize(total - projected_paid))

    return PaymentOut(
        payment_id=payment.payment_id,
        booking_id=payment.booking_id,
        amount=float(payment.amount),
        currency=payment.currency,
        status=payment.status,
        payment_type=payment.payment_type,
        payment_option=booking.payment_option if booking else None,
        booking_total=booking_total,
        amount_paid=amount_paid,
        balance_due=balance_due,
        gateway_order_id=payment.gateway_order_id,
        key_id=key_id if payment.gateway == "razorpay" else None,
        paid_at=payment.paid_at,
        created_at=payment.created_at,
        expires_at=payment.expires_at,
    )


def _attach_razorpay_order(payment: Payment, booking: Booking, db: Session) -> Payment:
    amount_paise = _amount_paise(payment.amount)
    if amount_paise <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking amount",
        )

    receipt = f"booking_{booking.id}_{payment.payment_id}"
    order = create_order(amount_paise, payment.currency, receipt)

    payment.gateway_order_id = order["id"]
    payment.expires_at = datetime.now(timezone.utc) + timedelta(minutes=ORDER_TTL_MINUTES)
    db.commit()
    db.refresh(payment)
    return payment


def _charge_amount(booking: Booking, venue: Venue, payment_option: str) -> Decimal:
    total = Decimal(str(booking.amount))
    if payment_option == "full":
        return _quantize(total)
    if payment_option == "advance":
        pct = venue.advance_percent or 30
        if pct < 1 or pct > 100:
            raise HTTPException(status_code=400, detail="Venue advance percent is invalid")
        deposit = _quantize(total * Decimal(pct) / Decimal(100))
        if deposit < Decimal("1.00"):
            deposit = min(Decimal("1.00"), total)
        return deposit
    raise HTTPException(status_code=400, detail="Invalid payment option for online charge")


def _confirm_pay_at_venue(db: Session, booking: Booking, venue: Venue, user: User) -> PaymentOut:
    if not venue.allow_pay_at_venue:
        raise HTTPException(
            status_code=400,
            detail="This venue does not allow pay at venue",
        )

    booking.payment_option = "pay_at_venue"
    booking.amount_paid = Decimal("0.00")
    booking.balance_due = _quantize(Decimal(str(booking.amount)))
    booking.status = "booked"

    payment = Payment(
        payment_id=generate_payment_id(),
        booking_id=booking.id,
        user_id=user.id,
        amount=Decimal("0.00"),
        currency="INR",
        status="paid",
        payment_type="pay_at_venue",
        gateway="offline",
        paid_at=datetime.now(timezone.utc),
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    db.refresh(booking)
    return payment_to_out(payment, booking)


def initiate_payment(db: Session, current_user: User, data: PaymentInitiate) -> PaymentOut:
    if data.payment_option not in VALID_OPTIONS:
        raise HTTPException(status_code=400, detail="Invalid payment option")

    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="This is not your booking")
    if booking.status != "pending_payment":
        raise HTTPException(
            status_code=400,
            detail="Booking is not awaiting payment",
        )

    venue = db.query(Venue).filter(Venue.id == booking.venue_id).first()
    if venue is None:
        raise HTTPException(status_code=404, detail="Venue not found")

    if data.payment_option == "pay_at_venue":
        return _confirm_pay_at_venue(db, booking, venue, current_user)

    charge = _charge_amount(booking, venue, data.payment_option)
    payment_type = data.payment_option  # full | advance
    booking.payment_option = data.payment_option

    existing = (
        db.query(Payment)
        .filter(
            Payment.booking_id == booking.id,
            Payment.status == "created",
            Payment.payment_type == payment_type,
        )
        .order_by(Payment.created_at.desc())
        .first()
    )

    if existing and _order_is_valid(existing) and Decimal(str(existing.amount)) == charge:
        db.commit()
        return payment_to_out(existing, booking)

    if existing and not _order_is_valid(existing):
        existing.status = "failed"
        existing.failure_reason = "Payment order expired"
        db.commit()

    payment = Payment(
        payment_id=generate_payment_id(),
        booking_id=booking.id,
        user_id=current_user.id,
        amount=charge,
        currency="INR",
        status="created",
        payment_type=payment_type,
        gateway="razorpay",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    payment = _attach_razorpay_order(payment, booking, db)
    db.refresh(booking)
    return payment_to_out(payment, booking)


def mark_payment_paid(
    db: Session,
    payment: Payment,
    *,
    gateway_payment_id: str | None = None,
    gateway_signature: str | None = None,
) -> Payment:
    if payment.status == "paid":
        return payment

    booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found for this payment")

    if booking.status == "booked" and payment.status != "paid" and booking.balance_due <= 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="ALREADY_PAID",
        )

    payment.status = "paid"
    payment.paid_at = datetime.now(timezone.utc)
    payment.failure_reason = None
    if gateway_payment_id:
        payment.gateway_payment_id = gateway_payment_id
    if gateway_signature:
        payment.gateway_signature = gateway_signature

    paid = _quantize(Decimal(str(booking.amount_paid or 0)) + Decimal(str(payment.amount)))
    total = _quantize(Decimal(str(booking.amount)))
    if paid > total:
        paid = total
    booking.amount_paid = paid
    booking.balance_due = _quantize(total - paid)
    booking.status = "booked"

    db.commit()
    db.refresh(payment)
    return payment


def confirm_payment(db: Session, current_user: User, data: PaymentConfirm) -> PaymentOut:
    payment = db.query(Payment).filter(Payment.payment_id == data.payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="This is not your payment")

    booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()

    if payment.status == "paid":
        return payment_to_out(payment, booking)

    if payment.status != "created":
        raise HTTPException(
            status_code=400,
            detail=f"Payment already {payment.status}",
        )

    if payment.gateway_order_id != data.gateway_order_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order ID does not match this payment",
        )

    verify_payment_signature(
        data.gateway_order_id,
        data.gateway_payment_id,
        data.gateway_signature,
    )

    payment = mark_payment_paid(
        db,
        payment,
        gateway_payment_id=data.gateway_payment_id,
        gateway_signature=data.gateway_signature,
    )
    db.refresh(booking)
    return payment_to_out(payment, booking)


def get_payment_status(db: Session, current_user: User, payment_id: str) -> PaymentOut:
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="This is not your payment")

    booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
    return payment_to_out(payment, booking)


def handle_webhook_event(db: Session, payload: dict) -> None:
    event = payload.get("event", "")
    entity = payload.get("payload", {})

    order_id = None
    payment_id = None

    if event == "payment.captured":
        payment_entity = entity.get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        payment_id = payment_entity.get("id")
    elif event == "order.paid":
        order_entity = entity.get("order", {}).get("entity", {})
        order_id = order_entity.get("id")

    if not order_id:
        return

    payment = (
        db.query(Payment)
        .filter(Payment.gateway_order_id == order_id)
        .order_by(Payment.created_at.desc())
        .first()
    )
    if payment is None or payment.status == "paid":
        return

    mark_payment_paid(db, payment, gateway_payment_id=payment_id)


def collect_balance(db: Session, owner_id: int, booking_id: int) -> dict:
    booking = (
        db.query(Booking)
        .join(Venue, Booking.venue_id == Venue.id)
        .filter(Booking.id == booking_id, Venue.owner_id == owner_id)
        .first()
    )
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status not in ("booked", "completed"):
        raise HTTPException(status_code=400, detail="Booking is not confirmed")

    balance = _quantize(Decimal(str(booking.balance_due or 0)))
    if balance <= 0:
        raise HTTPException(status_code=400, detail="No balance due on this booking")

    payment_type = "balance"
    if booking.payment_option == "pay_at_venue" and Decimal(str(booking.amount_paid or 0)) == 0:
        payment_type = "pay_at_venue"

    payment = Payment(
        payment_id=generate_payment_id(),
        booking_id=booking.id,
        user_id=booking.user_id,
        amount=balance,
        currency="INR",
        status="paid",
        payment_type=payment_type,
        gateway="offline",
        paid_at=datetime.now(timezone.utc),
    )
    db.add(payment)

    total = _quantize(Decimal(str(booking.amount)))
    booking.amount_paid = total
    booking.balance_due = Decimal("0.00")

    db.commit()
    db.refresh(payment)

    return {
        "booking_id": booking.id,
        "amount_collected": float(balance),
        "amount_paid": float(booking.amount_paid),
        "balance_due": float(booking.balance_due),
        "payment_id": payment.payment_id,
        "message": f"Collected ₹{float(balance):,.2f} at venue",
    }