from pydantic import BaseModel

class CreateOrderRequest(BaseModel):
    amount: int  # amount in rupees


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str