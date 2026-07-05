import api from "./axios";

export async function createBooking(bookingData) {
  const response = await api.post("/bookings/", bookingData, {
    requiresAuth: true,
  });
  return response.data;
}
