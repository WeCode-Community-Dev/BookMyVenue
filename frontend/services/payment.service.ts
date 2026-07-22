import { api } from "@/lib/api";

export interface CreatePaymentOrderPayload {
  bookingId: string;
}

export interface CreatePaymentOrderResponse {
  message: string;
  bookingId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  paymentExpiresAt?: string | null;
}

export interface VerifyPaymentPayload {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  message: string;
  bookingId: string;
  bookingStatus: string;
  paymentStatus: string;
}

export async function createPaymentOrder(payload: CreatePaymentOrderPayload) {
  const response = await api.post<CreatePaymentOrderResponse>("/payments/create-order", payload);
  return response.data;
}

export async function verifyPayment(payload: VerifyPaymentPayload) {
  const response = await api.post<VerifyPaymentResponse>("/payments/verify", payload);
  return response.data;
}
