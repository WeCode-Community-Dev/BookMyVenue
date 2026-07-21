from fastapi import HTTPException, status
from app.core.config import settings
from typing import List
from sqlalchemy.orm import Session
from app.model.orders import Order
from app.model.bookings import Booking
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import func
from app.services.email_service import send_email

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



def update_order_status_refund(db: Session, order_id: str, status: str, refund_reason: Optional[str] = None):
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Order with ID {order_id} not found."
            )

        booking = db.query(Booking).filter(Booking.order_id == order_id).first()
        
        venue_booking_date = booking.booking_date
        current_date = datetime.now().date()

        date_diff = (venue_booking_date - current_date).days

        if date_diff < 1:
            print("No refund allowed")
        elif date_diff < 3:
            order.refunded_amount = int(order.amount * 0.3)
            order.refund_percentage = 30
        elif date_diff < 7:
            order.refunded_amount = int(order.amount * 0.5)
            order.refund_percentage = 50
        elif date_diff >= 7:
            order.refunded_amount = int(order.amount * 0.7)
            order.refund_percentage = 70

        ############## Need to sent mail to user about refund and refund amount ##############
        send_email(
            to_email=order.user.email,
            subject="Refund Processed",
            body=f"Your refund for order {order.id} has been processed. Refund Amount: ₹{order.refunded_amount / 100:.2f}. Reason: {refund_reason if refund_reason else 'N/A'}"
        )

        order.status = status
        if refund_reason:
            order.refund_reason = refund_reason
        db.commit()
        db.refresh(order)

        return order

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating order status: {e}"
        )


def get_earnings(db: Session, user_id: int):
    try:
        total_earnings_paise = (
            db.query(func.sum(Order.amount))
            .filter(
                # Order.user_id == user_id,
                Order.status == "paid"
            )
            .scalar()
        )

        total_earnings_paise_refunded = (
            db.query(func.sum(Order.refunded_amount))
            .filter(
                Order.status == "refunded"
            )
            .scalar()
        )

        current_date = datetime.now().date()

        amount_to_receive_paise = (
            db.query(func.sum(Order.amount))
            .join(Booking, Booking.order_id == Order.id)
            .filter(
                # Order.user_id == user_id,
                Order.status == "paid",
                Booking.booking_date <= current_date
            )
            .scalar()
        )

        total_earnings_paise = total_earnings_paise or 0
        total_earnings_rupees = total_earnings_paise / 100
        total_earnings_rupees_refunded = (total_earnings_paise_refunded or 0) / 100
        amount_to_receive_paise = amount_to_receive_paise or 0
        amount_to_receive_rupees = amount_to_receive_paise / 100

        return {
            "total_earnings": total_earnings_rupees + total_earnings_rupees_refunded,
            "amount_yet_to_receive": amount_to_receive_rupees,
            "total_refunded": total_earnings_rupees_refunded,
            "currency": "INR"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating earnings: {e}"
        )