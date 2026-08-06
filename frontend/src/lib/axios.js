import axios from "axios";
import {
  TOKEN_KEY,
  clearAuthStorage,
  getRefreshToken,
  setAccessToken,
} from "./authStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(token);
  });
  failedQueue = [];
}

function logoutOnUnauthorized() {
  clearAuthStorage();
  window.dispatchEvent(new Event("auth:unauthorized"));
}

function shouldSkipTokenRefresh(config) {
  const url = config?.url ?? "";
  return (
    url.includes("/users/refresh") ||
    url.includes("/users/login") ||
    url.includes("/users/venue/login") ||
    url.includes("/users/register") ||
    url.includes("/users/venue/register") ||
    url.includes("/users/google") ||
    url.includes("/users/venue/google")
  );
}

function setAuthorizationHeader(config, token) {
  if (!token) return;

  if (config.headers?.set) {
    config.headers.set("Authorization", `Bearer ${token}`);
    return;
  }

  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
}

function shouldAttemptTokenRefresh(status) {
  // DRF returns 401 when a bearer token is invalid/expired, but 403 when no
  // credentials were provided. Both should trigger refresh when possible.
  return status === 401 || status === 403;
}

export default api;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    setAuthorizationHeader(config, token);
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;

    if (
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipTokenRefresh(originalRequest) ||
      !shouldAttemptTokenRefresh(status)
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      if (status === 401) {
        logoutOnUnauthorized();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        setAuthorizationHeader(originalRequest, token);
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post("/users/refresh", {
        refresh_token: refreshToken,
      });

      setAccessToken(data.access_token);
      processQueue(null, data.access_token);
      setAuthorizationHeader(originalRequest, data.access_token);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      logoutOnUnauthorized();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
