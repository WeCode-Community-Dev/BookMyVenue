import {
  parsePaymentError,
  verifyPayment as verifyPaymentFromApi,
} from "../apis/payments"

export function paymentVerificationFromApi(data) {
  return {
    bookingId: data.booking_id,
    status: typeof data.status === "string" ? data.status.toLowerCase() : data.status,
  }
}

export async function verifyPayment({
  bookingSessionId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const data = await verifyPaymentFromApi({
    bookingSessionId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  })
  return paymentVerificationFromApi(data)
}

export { parsePaymentError }
