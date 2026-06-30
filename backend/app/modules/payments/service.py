import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.payments.model import Payment, PaymentStatus


def get_payment_for_booking(db: Session, booking_id: int) -> Payment | None:
    return db.scalar(select(Payment).where(Payment.booking_id == booking_id))


def charge_for_booking(db: Session, booking_id: int, amount: float) -> Payment:
    existing = get_payment_for_booking(db, booking_id)
    if existing:
        return existing
    payment = Payment(
        booking_id=booking_id,
        amount=amount,
        status=PaymentStatus.mock_success,
        provider_txn_id=f"mock_{uuid.uuid4().hex[:16]}",
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


def refund_for_booking(db: Session, booking_id: int) -> Payment | None:
    payment = get_payment_for_booking(db, booking_id)
    if not payment or payment.status != PaymentStatus.mock_success:
        return payment
    payment.status = PaymentStatus.mock_refunded
    db.commit()
    db.refresh(payment)
    return payment
