from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.payment import PaymentInitiate, PaymentConfirm, PaymentOut
from app.services import payment_service

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/initiate", response_model=PaymentOut)
def initiate(
    data: PaymentInitiate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return payment_service.initiate_payment(db, current_user, data)


@router.post("/confirm", response_model=PaymentOut)
def confirm(
    data: PaymentConfirm,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return payment_service.confirm_payment(db, current_user, data)


@router.get("/{payment_id}/status", response_model=PaymentOut)
def payment_status(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return payment_service.get_payment_status(db, current_user, payment_id)
