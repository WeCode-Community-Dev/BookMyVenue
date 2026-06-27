import { create } from "zustand";
import type { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoading: true,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
}));
