import axios from "axios";
import { API_BASE_URL } from "../config";
import { getAccessToken } from "../auth/tokenStorage";

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

// Normalize every error into a consistent shape
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const err = error.response?.data?.error;
    const code = err?.code || "INTERNAL_ERROR";
    const message = err?.message || "Something went wrong.";
    const details = err?.details || [];
    const status = error.response?.status || 500;

    return Promise.reject({ code, message, details, status });
  },
);

export default client;
