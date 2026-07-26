import { axiosInstance as api } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';
import type {
  BookingCardDTO,
  BookingDetailDTO,
  BookerInfoForm,
  CancelBookingResponse,
} from '@/types/booking.types';

export type ApiResponse<T> = { success: boolean; data: T; message?: string };

export const getMyBookings = async (): Promise<
  ApiResponse<{
    bookings: {
      upcoming: BookingCardDTO[];
      completed: BookingCardDTO[];
      cancelled: BookingCardDTO[];
    };
  }>
> => {
  const response = await api.get(API_ENDPOINTS.MY_BOOKINGS);
  return response.data;
};

export const getBookingById = async (id: string): Promise<ApiResponse<BookingDetailDTO>> => {
  const response = await api.get(API_ENDPOINTS.BOOKING_BY_ID(id));
  return response.data;
};

export const saveBookerDetails = async (
  payload: BookerInfoForm & { lockId: string }
): Promise<ApiResponse<null>> => {
  const { lockId, ...rest } = payload;
  const { guestCount, eventType, ...bookerInfo } = rest;
  const response = await api.patch(API_ENDPOINTS.SAVE_BOOKER_DETAILS, {
    lockId,
    guestCount: Number(guestCount),
    eventType,
    bookerInfo,
  });
  return response.data;
};

export const cancelBooking = async (
  id: string,
  reason?: string
): Promise<ApiResponse<CancelBookingResponse>> => {
  const response = await api.delete(API_ENDPOINTS.CANCEL_BOOKING(id), { data: { reason } });
  return response.data;
};
