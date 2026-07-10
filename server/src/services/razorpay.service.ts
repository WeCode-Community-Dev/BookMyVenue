import Razorpay from 'razorpay';
import crypto from 'crypto';
import env from '@/configs/env.config';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (amount: number, receiptId: string) => {
  try {
    // Razorpay amount is in paise (minimum 100 paise)
    if (amount < 1) {
      throw new AppError('Minimum amount is 1 INR (100 paise)', HTTP_STATUS.BAD_REQUEST);
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt: receiptId,
    };

    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error: any) {
    throw new AppError(
      error.message || 'Failed to create Razorpay order',
      HTTP_STATUS.SERVER_ERROR
    );
  }
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  if (!orderId || !paymentId || !signature) {
    throw new AppError('Missing signature verification fields', HTTP_STATUS.BAD_REQUEST);
  }

  const generatedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  return generatedSignature === signature;
};
