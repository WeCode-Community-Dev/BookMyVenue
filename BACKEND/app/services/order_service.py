from fastapi import HTTPException, status
from app.core.config import settings
from typing import List
from sqlalchemy.orm import Session
from app.model.orders import Order

async def add_order_details(    
    db: Session,
    user_id: int,
    venue_id: int,
    razorpay_order_id: str,
    amount: int,
    currency: str,
    payment_time: str,
    status: str
):
    try:
        new_order = Order(
            user_id=user_id,
            venue_id=venue_id,
            razorpay_order_id=razorpay_order_id,
            amount=amount,
            currency=currency,
            payment_time=payment_time,
            status=status
        )

        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        return new_order

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error adding order details: {e}"
        )


async def update_order_payment_status(
    db: Session,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    status: str
):
    try:
        order = db.query(Order).filter(Order.razorpay_order_id == razorpay_order_id).first()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )

        order.razorpay_payment_id = razorpay_payment_id
        order.status = status

        db.commit()
        db.refresh(order)

        return order

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating order payment status: {e}"
        )