import { create } from "zustand";
import type { User } from "@/lib/types";
import {
  clearSession,
  getStoredUser,
  hasSessionFlag,
  setSessionUser,
} from "@/api/client";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  isAuthenticated: hasSessionFlag(),
  login: (user) => {
    setSessionUser(user);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    clearSession();
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user) => {
    setSessionUser(user);
    set({ user });
  },
}));
