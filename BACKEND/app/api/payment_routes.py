import os
import razorpay
from fastapi import APIRouter, HTTPException
from app.core.config import settings

router = APIRouter(prefix="/payments", tags=["Payments"])

client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)

@router.post("/create-order")
def create_order(payload: CreateOrderRequest):
    try:
        order_data = {
            "amount": payload.amount * 100,  # ₹500 => 50000 paise
            "currency": "INR",
            "receipt": "receipt_order_001",
            "payment_capture": 1
        }

        order = client.order.create(data=order_data)

        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": settings.RAZORPAY_KEY_ID
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/verify-payment")
def verify_payment(payload: VerifyPaymentRequest):
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature
        })

        return {
            "success": True,
            "message": "Payment verified successfully"
        }

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Payment verification failed"
        )