import { apiClient } from "@/lib/axios-client";
import type { MyBooking, VenueBooking } from "@/types/booking.types";

export const getVenueBookings = async (venueId: string): Promise<VenueBooking[]> => {
  const { data } = await apiClient.get(`/booking/venue/${venueId}`);
  return data.bookings;
};

export const getMyBookings = async (): Promise<MyBooking[]> => {
  const { data } = await apiClient.get("/booking/my");
  return data.bookings;
};
