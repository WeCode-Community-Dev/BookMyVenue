import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.payment import Payment
from app.models.booking import Booking
from app.models.user import User
from app.schemas.payment import PaymentInitiate, PaymentConfirm, PaymentOut
from app.services.razorpay_service import (
    create_order,
    get_key_id,
    verify_payment_signature,
)

ORDER_TTL_MINUTES = 30


def generate_payment_id() -> str:
    return "pay_" + uuid.uuid4().hex[:12]


def _amount_paise(amount: Decimal) -> int:
    return int(amount * 100)


def _order_is_valid(payment: Payment) -> bool:
    if not payment.gateway_order_id:
        return False
    if payment.expires_at is None:
        return True
    return payment.expires_at > datetime.now(timezone.utc)


def payment_to_out(payment: Payment) -> PaymentOut:
    key_id = None
    try:
        key_id = get_key_id()
    except HTTPException:
        pass
    return PaymentOut(
        payment_id=payment.payment_id,
        booking_id=payment.booking_id,
        amount=float(payment.amount),
        currency=payment.currency,
        status=payment.status,
        gateway_order_id=payment.gateway_order_id,
        key_id=key_id,
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


def initiate_payment(db: Session, current_user: User, data: PaymentInitiate) -> PaymentOut:
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

    existing = (
        db.query(Payment)
        .filter(Payment.booking_id == booking.id, Payment.status == "created")
        .order_by(Payment.created_at.desc())
        .first()
    )

    if existing and _order_is_valid(existing):
        return payment_to_out(existing)

    if existing and not _order_is_valid(existing):
        existing.status = "failed"
        existing.failure_reason = "Payment order expired"
        db.commit()

    payment = Payment(
        payment_id=generate_payment_id(),
        booking_id=booking.id,
        user_id=current_user.id,
        amount=booking.amount,
        currency="INR",
        status="created",
        gateway="razorpay",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)

    payment = _attach_razorpay_order(payment, booking, db)
    return payment_to_out(payment)


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

    if booking.status == "booked" and payment.status != "paid":
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

    if payment.status == "paid":
        return payment_to_out(payment)

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
    return payment_to_out(payment)


def get_payment_status(db: Session, current_user: User, payment_id: str) -> PaymentOut:
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="This is not your payment")
    return payment_to_out(payment)
