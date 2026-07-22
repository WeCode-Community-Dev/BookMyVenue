import { api } from "@/lib/api";
import { BackendBooking } from "@/types/backend";

export interface CreateBookingPayload {
  venueId: string;
  eventStart: string;
  eventEnd: string;
  eventName: string;
  guestCount: number;
  specialRequests?: string;
}

export async function getMyBookings() {
  const response = await api.get<BackendBooking[]>("/bookings/my");
  return response.data;
}

export async function createBooking(payload: CreateBookingPayload) {
  const response = await api.post<{
    message: string;
    bookingId: string;
    bookingStatus: string;
    paymentStatus: string;
    amount?: number;
    paymentExpiresAt?: string | null;
  }>("/bookings", payload);

  return response.data;
}

export async function getOwnerBookingRequests() {
  const response = await api.get<BackendBooking[]>("/bookings/owner/requests");
  return response.data;
}

export async function approveOwnerBookingRequest(bookingId: string) {
  const response = await api.patch<{
    message: string;
    bookingId: string;
    bookingStatus: string;
    paymentStatus: string;
    amount?: number;
    paymentExpiresAt?: string | null;
  }>(`/bookings/owner/requests/${bookingId}/approve`);
  return response.data;
}

export async function rejectOwnerBookingRequest(bookingId: string, reason?: string) {
  const response = await api.patch<{
    message: string;
    bookingId: string;
    bookingStatus: string;
    paymentStatus: string;
  }>(`/bookings/owner/requests/${bookingId}/reject`, { reason });
  return response.data;
}
