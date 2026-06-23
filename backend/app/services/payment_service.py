import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.payment import Payment
from app.models.booking import Booking
from app.models.user import User
from app.schemas.payment import PaymentInitiate, PaymentConfirm 


def generate_payment_id() :
    return "pay_" + uuid.uuid4().hex[:12] 


def initiate_payment(db: Session, current_user: User, data: PaymentInitiate) :
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
    # reuse an existing 'created' payment if one already exists
    existing = (
        db.query(Payment)
        .filter(Payment.booking_id == booking.id, Payment.status == "created")
        .first()
    )
    if existing:
        return existing
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
    return payment

# confirm the payment
def confirm_payment(db: Session, current_user: User, data: PaymentConfirm) -> Payment:
    payment = (
        db.query(Payment).filter(Payment.payment_id == data.payment_id).first()
    )
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="This is not your payment")
    if payment.status != "created":
        raise HTTPException(
            status_code=400,
            detail=f"Payment already {payment.status}",
        )
    booking = db.query(Booking).filter(Booking.id == payment.booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found for this payment")

    if data.success:
        # mock gateway success
        if booking.status != "pending_payment":
            raise HTTPException(
                status_code=400,
                detail=f"Booking is no longer awaiting payment (status: {booking.status})",
            )
        payment.status = "paid"
        payment.paid_at = datetime.now(timezone.utc)
        payment.failure_reason = None
        booking.status = "booked"
    else:
        # mock gateway failure — leave the booking as 'pending_payment' so the
        # user can initiate a new payment and try again
        payment.status = "failed"
        payment.failure_reason = "Payment failed at gateway (mock)"
    db.commit()
    db.refresh(payment)
    return payment

# get the payment status
def get_payment_status(db: Session, current_user: User, payment_id: str) -> Payment:
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    if payment.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="This is not your payment")
    return payment