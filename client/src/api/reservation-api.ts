import { apiClient } from "@/lib/axios-client";

export interface CreateReservationPayload {
  venueId: string;
  startTime: string;
  endTime: string;
}

export interface Reservation {
  _id: string;
  venue: string;
  customer: string;
  startTime: string;
  endTime: string;
  status: string;
  expiresAt: string;
}

export const createReservationRequest = async (
  payload: CreateReservationPayload,
): Promise<Reservation> => {
  const { data } = await apiClient.post("/reservation/create", payload);
  return data.reservation;
};

export interface PaymentOrder {
  orderId: string;
  amount: number;
  paymentId: string;
}

export const createOrderRequest = async (reservationId: string): Promise<PaymentOrder> => {
  const { data } = await apiClient.post("/payment/create-order", { reservationId });
  return data.order;
};

export const verifyPaymentRequest = async (payload: { orderId: string; success: boolean }) => {
  const { data } = await apiClient.post("/payment/verify", payload);
  return data;
};
