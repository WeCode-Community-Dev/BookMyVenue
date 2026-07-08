import { useSelector } from 'react-redux';

import { selectIsAuthenticated, selectToken, selectUser } from '@/features/auth/stores/auth-slice';

export function useAuth() {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return {
    token,
    user,
    isAuthenticated,
    role: user?.role ?? null,
  };
}
