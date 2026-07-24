import client from "../../../core/api/client";
import { resolveApiError } from "../../../utils/error";

function unwrap(err) {
  const raw = err?.message || err?.response?.data?.detail || "Something went wrong.";
  throw new Error(resolveApiError(raw));
}

export const bookingService = {
  async create(data, idempotencyKey) {
    try {
      const res = await client.post("/bookings", data, {
        headers: { "Idempotency-Key": idempotencyKey },
      });
      return res.data;
    } catch (err) {
      unwrap(err);
    }
  },

  async myBookings({ status = "", page = 1, limit = 20 } = {}) {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      const res = await client.get("/bookings/my-bookings", { params });
      return res.data;
    } catch (err) {
      unwrap(err);
    }
  },

  async detail(id) {
    try {
      const res = await client.get(`/bookings/${id}`);
      return res.data;
    } catch (err) {
      unwrap(err);
    }
  },

  async cancel(id, cancellation_reason) {
    try {
      const res = await client.patch(`/bookings/${id}/cancel`, {
        cancellation_reason,
      });
      return res.data;
    } catch (err) {
      unwrap(err);
    }
  },
};
