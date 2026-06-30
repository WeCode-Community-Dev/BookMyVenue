import { apiClient } from "./client";
import type { Booking, BookingStatus } from "@/lib/types";

export interface BookingCreatePayload {
  venue_id: number;
  start_at: string;
  end_at: string;
}

export const bookingsApi = {
  create: (data: BookingCreatePayload) =>
    apiClient.post<Booking>("/bookings", data).then((r) => r.data),

  list: () => apiClient.get<Booking[]>("/bookings").then((r) => r.data),

  cancel: (id: number) =>
    apiClient.post<Booking>(`/bookings/${id}/cancel`).then((r) => r.data),

  ownerList: () =>
    apiClient.get<Booking[]>("/owner/bookings").then((r) => r.data),

  ownerDecide: (id: number, status: BookingStatus) =>
    apiClient
      .patch<Booking>(`/owner/bookings/${id}`, { status })
      .then((r) => r.data),
};
