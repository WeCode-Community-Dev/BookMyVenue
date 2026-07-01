import os
import razorpay
from fastapi import APIRouter, HTTPException, Depends
from app.core.config import settings
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.schema.payment import (
    CreateOrderRequest,
    VerifyPaymentRequest
)
from app.services.order_service import (
    add_order_details,
    update_order_payment_status,
)
from app.services.booking_service import create_booking
from datetime import datetime, timezone


router = APIRouter(prefix="/payments", tags=["Payments"])

client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)

@router.post("/create-order")
async def create_order(payload: CreateOrderRequest, db: Session = Depends(get_db)):
    try:
        order_data = {
            "amount": payload.amount * 100,  # ₹500 => 50000 paise
            "currency": "INR",
            "receipt": "receipt_order_001",
            "payment_capture": 1
        }

        razorpay_order = client.order.create(data=order_data)

        saved_order = await add_order_details(
            db,
            user_id=payload.user_id,    
            venue_id=payload.venue_id,
            razorpay_order_id=razorpay_order["id"],
            amount=order_data["amount"],
            currency=order_data["currency"],
            payment_time=datetime.now(timezone.utc),
            status="pending",
        )
        
        return {
            "razorpay_order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key": settings.RAZORPAY_KEY_ID,
            "order_id": saved_order.id
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/verify-payment")
async def verify_payment(payload: VerifyPaymentRequest, db: Session = Depends(get_db)):
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature
        })

        await update_order_payment_status(
            db,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            status="paid"
        )

        create_booking(
            db,
            user_id=payload.user_id,
            venue_id=payload.venue_id,
            order_id=payload.order_id,
            booking_date=datetime.now().date(),
            status="confirmed",
            start_time=payload.start_time,
            end_time=payload.end_time
        )

        return {
            "success": True,
            "message": "Payment verified successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Payment verification failed: {str(e)}"
        )