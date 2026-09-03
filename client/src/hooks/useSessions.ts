import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/services/authService';

export const useSessions = () => {
  return useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: getSessions,
  });
};
