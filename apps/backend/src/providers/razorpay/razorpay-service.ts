import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private readonly razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(
    amount: number,
    receipt: string,
    notes?: Record<string, string>,
  ) {
    return (
      this,
      this.razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt,
        notes,
      })
    );
  }

  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    // We'll implement this while building the payment verification API.
    console.log(razorpayOrderId);
    console.log(razorpayPaymentId);
    console.log(razorpaySignature);
  }

  refundPayment(razorpayPaymentId: string, amount?: number) {
    // We'll implement this during the cancellation/refund flow.
    console.log(razorpayPaymentId);
    console.log(amount);
  }
}
