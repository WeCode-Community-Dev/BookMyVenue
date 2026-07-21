import axios from "axios";
import { API_BASE_URL } from "../config";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../auth/tokenStorage";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token to every outgoing request automatically
client.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Track if a refresh is already in progress to prevent race conditions
let isRefreshing = false;
// Queue of requests that arrived while a refresh was in flight
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Attempt refresh on 401, but never for the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      // Park this request if a refresh is already running
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available.");

        // Send refresh token in Authorization header (matches backend's HTTPBearer)
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // Preserve the original rememberMe choice by checking where the old token was
        const rememberMe = !!localStorage.getItem("bmv_access_token");
        saveTokens(data.access_token, data.refresh_token, rememberMe);

        processQueue(null, data.access_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return client(originalRequest);
      } catch (refreshError) {
        // Refresh failed — session is dead, force logout
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize all other errors into a consistent shape
    const message = error.response?.data?.detail || "Something went wrong.";
    const status = error.response?.status || 500;
    return Promise.reject({ message, status });
  },
);

export default client;