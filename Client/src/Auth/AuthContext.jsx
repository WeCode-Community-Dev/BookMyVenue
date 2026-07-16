import {
  Children,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { authApi } from "./authApi";

export const AuthContext = createContext(null);

const TOKEN_LIFETIME_MS = 10 * 60 * 1000;
const REFRESH_BEFORE_MS = 30 * 1000;
const REFRESH_DELAY = TOKEN_LIFETIME_MS - REFRESH_BEFORE_MS;

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimer = useRef(null);

  const silentRefresh = useCallback(async () => {
    try {
      const data = await authApi.refresh();
      setAccessToken(data?.accessToken);
      setUser(data);
      scheduleRefresh();
    } catch (error) {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const scheduleRefresh = useCallback(() => {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => {
      silentRefresh();
    }, REFRESH_DELAY);
  }, [silentRefresh]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await authApi.refresh();
        setAccessToken(data.accessToken);
        setUser(data.user);
        scheduleRefresh();
      } catch (error) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
    return () => clearTimeout(refreshTimer.current);
  }, [silentRefresh]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    console.log("data from auth..", data);
    setAccessToken(data.accessToken);
    setUser(data.user);
    scheduleRefresh();
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
      clearTimeout(refreshTimer.current);
    }
  };

  const authFetch = useCallback(
    async (url, options = {}) => {
      const doFetch = (token) =>
        fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });

      let res = await doFetch(accessToken);

      if (res.status === 401) {
        try {
          const data = await authApi.refresh();
          setAccessToken(data.accessToken);
          setUser(data.user);
          scheduleRefresh();
        } catch (error) {
          logout();
          throw new Error("Session expired. Please log in again.");
        }
      }

      return res;
    },
    [accessToken, scheduleRefresh],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!accessToken,
        login,
        logout,
        authFetch,
        isAdmin: user?.role === "admin",
        hasRole: (requiredRole) => {
          if (!user?.role) return false;

          const userRoles = Array.isArray(user.role) ? user.role : [user.role];
          const required = Array.isArray(requiredRole)
            ? requiredRole
            : [requiredRole];

          return required.some((r) => userRoles.includes(r));
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
