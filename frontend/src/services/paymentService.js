import api from "./axios";
import { toPaymentRequestBody } from "../utils/booking";

const hasValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const assertRazorpayResponse = (razorpayResponse) => {
  const orderId = razorpayResponse?.razorpay_order_id;
  const paymentId = razorpayResponse?.razorpay_payment_id;
  const signature = razorpayResponse?.razorpay_signature;

  if (!hasValue(orderId) || !hasValue(paymentId) || !hasValue(signature)) {
    throw new Error("Incomplete payment response. Please try again.");
  }

  return {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  };
};

export const createOrder = async (bookingPayload) => {
  const { venueId, availabilityId } = toPaymentRequestBody(bookingPayload);

  const { data } = await api.post("/payments/create-order", {
    venueId,
    availabilityId,
  });

  return data;
};

export const verifyPayment = async (bookingPayload, razorpayResponse) => {
  const { venueId, availabilityId } = toPaymentRequestBody(bookingPayload);
  const paymentFields = assertRazorpayResponse(razorpayResponse);

  const { data } = await api.post("/payments/verify-payment", {
    ...paymentFields,
    venueId,
    availabilityId,
  });

  return data;
};
