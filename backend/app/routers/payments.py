import json

from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.payment import PaymentInitiate, PaymentConfirm, PaymentOut
from app.services import payment_service
from app.services.razorpay_service import verify_webhook_signature

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


@router.post("/webhook")
async def webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_razorpay_signature: str = Header(..., alias="X-Razorpay-Signature"),
):
    body = await request.body()
    verify_webhook_signature(body, x_razorpay_signature)
    payload = json.loads(body)
    payment_service.handle_webhook_event(db, payload)
    return {"status": "ok"}


@router.get("/{payment_id}/status", response_model=PaymentOut)
def payment_status(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return payment_service.get_payment_status(db, current_user, payment_id)
