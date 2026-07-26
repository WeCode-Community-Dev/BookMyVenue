import { useQuery } from '@tanstack/react-query';
import { getMyBookings } from '@/services/bookingService';

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: getMyBookings,
  });
};
