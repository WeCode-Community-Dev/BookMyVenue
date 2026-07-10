import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as authService from "../services/authService";
import { resolveEffectiveRoles } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roleOverride, setRoleOverride] = useState(null);
  const [loading, setLoading] = useState(true);
  const authRequestId = useRef(0);
  const isLoggingOutRef = useRef(false);

  const applyAuthResult = useCallback((requestId, nextUser) => {
    if (requestId !== authRequestId.current) return false;
    if (isLoggingOutRef.current && nextUser !== null) return false;

    setUser(nextUser);
    return true;
  }, []);

  const syncUser = useCallback(
    async ({ manageLoading = false } = {}) => {
      const requestId = ++authRequestId.current;
      isLoggingOutRef.current = false;

      if (manageLoading) {
        setLoading(true);
      }

      try {
        const data = await authService.getMe();

        if (requestId !== authRequestId.current) return null;

        const nextUser = data.success ? data.user : null;
        applyAuthResult(requestId, nextUser);
        return nextUser;
      } catch {
        if (requestId !== authRequestId.current) return null;
        applyAuthResult(requestId, null);
        return null;
      } finally {
        if (manageLoading && requestId === authRequestId.current) {
          setLoading(false);
        }
      }
    },
    [applyAuthResult]
  );

  const fetchUser = useCallback(
    () => syncUser({ manageLoading: true }),
    [syncUser]
  );

  const refreshUser = useCallback(
    () => syncUser({ manageLoading: false }),
    [syncUser]
  );

  const syncUserAfterBecomeProvider = useCallback(
    async (rolesFromApi) => {
      const nextRoles =
        Array.isArray(rolesFromApi) && rolesFromApi.length > 0
          ? rolesFromApi
          : null;

      if (nextRoles) {
        setRoleOverride(nextRoles);
      }

      await syncUser({ manageLoading: false });

      return nextRoles;
    },
    [syncUser]
  );

  const logout = useCallback(async () => {
    authRequestId.current += 1;
    isLoggingOutRef.current = true;
    setUser(null);
    setRoleOverride(null);
    setLoading(false);

    try {
      await authService.logout();
    } catch {
      // Clear local session even if the API call fails.
    } finally {
      isLoggingOutRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const userRoles = useMemo(
    () => resolveEffectiveRoles(roleOverride, user),
    [roleOverride, user]
  );

  const isAuthenticated = Boolean(user);
  const isProvider = useMemo(
    () => userRoles.includes("provider"),
    [userRoles]
  );
  const isAdmin = useMemo(
    () => userRoles.includes("admin"),
    [userRoles]
  );
  const authReady = !loading;

  const value = useMemo(
    () => ({
      user,
      userRoles,
      loading,
      authReady,
      fetchUser,
      refreshUser,
      syncUser,
      syncUserAfterBecomeProvider,
      logout,
      isAuthenticated,
      isProvider,
      isAdmin,
    }),
    [
      user,
      userRoles,
      loading,
      authReady,
      fetchUser,
      refreshUser,
      syncUser,
      syncUserAfterBecomeProvider,
      logout,
      isAuthenticated,
      isProvider,
      isAdmin,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
