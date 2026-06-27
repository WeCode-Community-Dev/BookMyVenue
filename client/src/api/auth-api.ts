import { apiClient } from "../lib/axios-client";
import type { User, UserRole } from "@/types/auth.types";

interface AuthResponse {
  message: string;
  user: User;
}

export const registerRequest = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<User> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/sign-up", payload);
  return data.user;
};

export const loginRequest = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await apiClient.post<AuthResponse>("/auth/sign-in", payload);
  return data.user;
};

export const logoutRequest = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<AuthResponse>("/auth/me");
  return data.user;
};
