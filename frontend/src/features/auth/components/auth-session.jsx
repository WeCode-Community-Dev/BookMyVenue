import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useGetMeQuery } from '@/features/auth/api/auth-api';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { logout, setUser } from '@/features/auth/stores/auth-slice';

/**
 * Keeps Redux user in sync with /auth/me when a token exists.
 * Clears session on 401 (expired/invalid token).
 */
export function AuthSession() {
  const dispatch = useDispatch();
  const { token } = useAuth();

  const {
    data: user,
    error,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (isError && error?.status === 401) {
      dispatch(logout());
    }
  }, [isError, error, dispatch]);

  return null;
}
