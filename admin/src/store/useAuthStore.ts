import { create } from "zustand";

export interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: "owner" | "admin" | "superAdmin";
  avatar?: string;
  phone?: string;
  status: "active" | "suspended" | "banned";
}

interface AuthState {
  profile: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  isLoading: true,
  isError: false,

  setProfile: (profile) => set({ profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (isError) => set({ isError, isLoading: false }),
  logout: () => set({ profile: null, isLoading: false, isError: false }),
}));
