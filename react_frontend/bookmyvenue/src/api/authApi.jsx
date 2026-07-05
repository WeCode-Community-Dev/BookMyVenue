import api from "./axios";

export const AUTH_CHANGED_EVENT = "bookmyvenue:auth-changed";

export function hasAuthSession() {
  return Boolean(
    localStorage.getItem("accessToken") || localStorage.getItem("refreshToken")
  );
}

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export async function signupUser(formData) {
  const response = await api.post("/signup/", formData);
  return response.data;
}

export async function loginUser(formData) {
  const response = await api.post("/login/", formData);

  localStorage.setItem("accessToken", response.data.access);
  localStorage.setItem("refreshToken", response.data.refresh);
  notifyAuthChanged();

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/me/", { requiresAuth: true });
  return response.data;
}

export function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  notifyAuthChanged();
}
