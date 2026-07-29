import { apiClient } from '@/services/apiClient';
import type { AdminBookingQuery } from '../types/bookings/AdminBookings.types';


export const adminBookingsApi = {
  getAll: async (query: AdminBookingQuery) => {
    const res = await apiClient.get('/admin/bookings', { params: query });
    return res.data;
  },
};
