import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

export const getVendorBookingsService = async (params) => {
  const response = await api.get(API_ROUTES.VENDOR.BOOKINGS, {
    params,
  });

  return response.data;
};

export const getBookingByIdService = async (bookingId) => {
  const response = await api.get(
    API_ROUTES.VENDOR.BOOKING_BY_ID(bookingId)
  );

  return response.data;
};