import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("bmv_session");
      localStorage.removeItem("bmv_user");
    }
    return Promise.reject(error);
  },
);

export function getStoredUser(): import("@/lib/types").User | null {
  const raw = localStorage.getItem("bmv_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as import("@/lib/types").User;
  } catch {
    return null;
  }
}

export function setSessionUser(user: import("@/lib/types").User): void {
  localStorage.setItem("bmv_session", "1");
  localStorage.setItem("bmv_user", JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem("bmv_session");
  localStorage.removeItem("bmv_user");
}

export function hasSessionFlag(): boolean {
  return localStorage.getItem("bmv_session") === "1";
}

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { detail?: string } | undefined)?.detail ??
      error.message
    );
  }
  return "Something went wrong";
}
