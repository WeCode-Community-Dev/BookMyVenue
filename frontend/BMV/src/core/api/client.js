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
    const message = error.response?.data?.detail || "Something went wrong."
    const status = error.response?.status || 500;

    return Promise.reject({ message, status });
  },
);

export default client;
