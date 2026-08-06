import { createContext, useContext } from 'react';

// The auth context object lives in its own (non-component) module so the
// provider file can export *only* the AuthProvider component — required for
// React Fast Refresh to work reliably.
export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
