import client from "../../../core/api/client";
import { resolveApiError } from "../../../utils/error";

function unwrap(err) {
  const raw = err?.message || err?.response?.data?.detail || "Payment failed";
  throw new Error(resolveApiError(raw), { cause: err });
}

export const paymentService = {
  async initiate(booking_id, payment_option = "full") {
    try {
      const res = await client.post("/payments/initiate", {
        booking_id,
        payment_option,
      });
      return res.data;
    } catch (err) {
      unwrap(err);
    }
  },

  async confirm({ payment_id, gateway_order_id, gateway_payment_id, gateway_signature }) {
    try {
      const res = await client.post("/payments/confirm", {
        payment_id,
        gateway_order_id,
        gateway_payment_id,
        gateway_signature,
      });
      return res.data;
    } catch (err) {
      unwrap(err);
    }
  },

  async status(payment_id) {
    try {
      const res = await client.get(`/payments/${payment_id}/status`);
      return res.data;
    } catch (err) {
      unwrap(err);
    }
  },
};
