import { apiClient } from "./client";
import type { AuthResponse, User, UserRole } from "@/lib/types";

export const authApi = {
  signup: (data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
  }) =>
    apiClient
      .post<AuthResponse>("/auth/signup", data)
      .then((r) => r.data),

  login: (email: string, password: string) =>
    apiClient
      .post<AuthResponse>("/auth/login", { email, password })
      .then((r) => r.data),

  google: (credential: string) =>
    apiClient
      .post<AuthResponse>("/auth/google", { credential })
      .then((r) => r.data),

  logout: () => apiClient.post("/auth/logout").then((r) => r.data),

  me: () => apiClient.get<User>("/users/me").then((r) => r.data),
};
