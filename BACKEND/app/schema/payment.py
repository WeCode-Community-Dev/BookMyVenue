from pydantic import BaseModel

class CreateOrderRequest(BaseModel):
    user_id: int
    venue_id: int
    amount: int  # amount in rupees


class VerifyPaymentRequest(BaseModel):
    user_id: int
    venue_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str