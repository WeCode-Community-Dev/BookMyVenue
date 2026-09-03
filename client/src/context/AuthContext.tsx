import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants';
import { useToast } from '@/hooks/useToast';
import { clearDraft, clearDraftSession } from '@/utils/venueDraft';
import { queryClient } from '@/config/queryClient';
import { resetProfileGreeting } from '@/utils/profileGreeting';

export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifySession: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clearAuthData = (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  setUser(null);
  queryClient.clear();
  localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
  localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  resetProfileGreeting();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { success: showSuccess, error: showError } = useToast();

  const isAuthenticated = !!user;

  const verifySession = async () => {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    if (isLoggedIn === 'true') {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
        const userData = response.data?.data || response.data;
        if (userData) {
          const username = userData.username ?? userData.name;
          setUser({
            id: userData._id || userData.id,
            username,
            email: userData.email,
            profilePicture: userData.profilePicture,
          });
          localStorage.setItem(STORAGE_KEYS.USER_ID, userData._id || userData.id);
          localStorage.setItem(STORAGE_KEYS.USER_NAME, username);
        } else {
          throw new Error('No user data returned');
        }
      } catch (error) {
        console.error('Failed to verify session', error);
        clearAuthData(setUser);
        throw error;
      }
    } else {
      clearAuthData(setUser);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await verifySession();
      } catch {
        // Initial session check failed; user is not authenticated
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleLogoutEvent = () => {
      clearAuthData(setUser);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    const data = response.data?.data || response.data;
    if (data) {
      resetProfileGreeting();
      setUser({
        id: data.userId || data.id,
        username: data.username,
        email: data.email,
      });
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.USER_ID, data.userId || data.id);
      localStorage.setItem(STORAGE_KEYS.USER_NAME, data.username);
    }
  };

  const updateUser = (patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const register = async (username: string, email: string, password: string) => {
    await axiosInstance.post(API_ENDPOINTS.REGISTER, {
      username,
      email,
      password,
    });
  };

  const clearSession = () => {
    if (user?.id) {
      clearDraft(user.id);
      clearDraftSession(user.id);
    }
    clearAuthData(setUser);
  };

  const logout = async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.LOGOUT);
      showSuccess('Logged out successfully.');
    } catch {
      showError('Failed to log out. Please try again.');
    } finally {
      if (user?.id) {
        clearDraft(user.id);
        clearDraftSession(user.id);
      }
      clearAuthData(setUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        verifySession,
        updateUser,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
