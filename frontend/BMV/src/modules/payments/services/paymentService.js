import client from "../../../core/api/client";
import { getFriendlyError } from "../../../utils/error";

export const paymentService = {
  async initiate(booking_id) {
    try {
      const res = await client.post("/payments/initiate", { booking_id });
      return res.data;
    } catch (err) {
      const detail = err.message || err.code;
      throw new Error(getFriendlyError(detail) || detail || "Payment failed");
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
      const detail = err.message || err.code;
      throw new Error(getFriendlyError(detail) || detail || "Payment failed");
    }
  },

  async status(payment_id) {
    try {
      const res = await client.get(`/payments/${payment_id}/status`);
      return res.data;
    } catch (err) {
      const detail = err.message || err.code;
      throw new Error(getFriendlyError(detail) || detail || "Payment failed");
    }
  },
};
