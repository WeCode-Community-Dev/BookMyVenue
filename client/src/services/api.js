import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bmv_access_token') || localStorage.getItem('bmv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
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

// Handle 401 responses and automatically refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and request wasn't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we are already on login page, don't attempt to refresh
      if (window.location.pathname === '/login') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('bmv_refresh_token');
      if (!refreshToken) {
        // No refresh token, clear storage and redirect
        localStorage.removeItem('bmv_access_token');
        localStorage.removeItem('bmv_token');
        localStorage.removeItem('bmv_refresh_token');
        localStorage.removeItem('bmv_user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Request token refresh
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('bmv_access_token', accessToken);
        localStorage.setItem('bmv_token', accessToken); // backward compatibility
        localStorage.setItem('bmv_refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Refresh failed, clear session and redirect to login
        localStorage.removeItem('bmv_access_token');
        localStorage.removeItem('bmv_token');
        localStorage.removeItem('bmv_refresh_token');
        localStorage.removeItem('bmv_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
