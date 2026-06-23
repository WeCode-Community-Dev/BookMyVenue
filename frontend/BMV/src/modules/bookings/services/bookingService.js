import client from "../../../core/api/client";
import { getFriendlyError } from "../../../utils/error";

export const bookingService = {
  async create(data) {
    try {
      const res = await client.post("/bookings", data);
      return res.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },

  async myBookings(page = 1, limit = 20) {
    try {
      const res = await client.get("/bookings/my-bookings", {
        params: { page, limit },
      });
      return res.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },

  async detail(id) {
    try {
      const res = await client.get(`/bookings/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },

  async cancel(id, cancellation_reason) {
    try {
      const res = await client.patch(`/bookings/${id}/cancel`, {
        cancellation_reason,
      });
      return res.data;
    } catch (err) {
      throw new Error(getFriendlyError(err.code));
    }
  },
};
