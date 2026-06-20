import axiosInstance from "../../../shared/services/axios";
import { API_ROUTES } from "../../../shared/constants/apiRoutes";


export const createBookingApi = async (payload) => {
   const response = await axiosInstance.post(
      API_ROUTES.BOOKINGS.BASE,
      payload
   );

   return response.data;
};

export const fetchMyBookingsApi = async () => {
   const response = await axiosInstance.get(
      API_ROUTES.BOOKINGS.MY_BOOKINGS
   );

   return response.data;
};


export const fetchOwnerBookingsApi = async () => {
   const response = await axiosInstance.get(
      API_ROUTES.BOOKINGS.OWNER_BOOKINGS
   );

   return response.data;
};

export const updateBookingStatusApi = async (
   bookingId,
   payload
) => {
   const response = await axiosInstance.patch(
      `${API_ROUTES.BOOKINGS.BASE}/${bookingId}/status`,
      payload
   );

   return response.data;
};