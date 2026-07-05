import axios from "axios";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: apiBaseUrl.replace(/\/$/, ""),
});

api.interceptors.request.use((config) => {
  if (!config.requiresAuth) {
    return config;
  }

  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshRequest = null;

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token is available.");
  }

  if (!refreshRequest) {
    refreshRequest = axios
      .post(`${apiBaseUrl.replace(/\/$/, "")}/token/refresh/`, {
        refresh: refreshToken,
      })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.access);
        return response.data.access;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401
      && originalRequest?.requiresAuth
      && !originalRequest._retriedAfterRefresh
    ) {
      originalRequest._retriedAfterRefresh = true;

      try {
        const accessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
