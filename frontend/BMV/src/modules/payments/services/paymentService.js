import client from "../../../core/api/client";
import { getFriendlyError } from "../../../utils/error";

export const paymentService = {
  async initiate(booking_id) {
    try {
      const res = await client.post("/payments/initiate", { booking_id });
      return res.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },

  async confirm(payment_id, success = true) {
    try {
      const res = await client.post("/payments/confirm", {
        payment_id,
        success,
      });
      return res.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },

  async status(payment_id) {
    try {
      const res = await client.get(`/payments/${payment_id}/status`);
      return res.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },
};
