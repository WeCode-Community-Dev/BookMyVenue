import { createContext, useContext, useEffect, useState } from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

const getDashboardPathByRole = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "owner") return "/owner/dashboard";

  return "/";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const result = await getCurrentUser();

        if (isMounted) {
          setUser(result.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const register = async (userData) => {
    const result = await registerUser(userData);

    if (result.user) {
      setUser(result.user);
    }

    return result;
  };

  const login = async (credentials) => {
    const result = await loginUser(credentials);

    if (result.user) {
      setUser(result.user);
    }

    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = {
    user,
    authLoading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    getDashboardPathByRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}