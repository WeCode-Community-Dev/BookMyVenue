import { useQuery } from '@tanstack/react-query';
import { getBookingById } from '@/services/bookingService';

export const useBookingById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['bookings', id as string],
    queryFn: () => getBookingById(id as string),
    enabled: !!id,
  });
};
