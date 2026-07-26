import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '@/constants';

// Types
interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}

// Error message extractor
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown>;
    return (
      (data?.message as string) || (data?.error as string) || error.message || 'Request failed'
    );
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
};

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    withCredentials: true,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    paramsSerializer: {
      indexes: null,
    },
  });

  instance.interceptors.request.use((config) => {
    let sessionToken = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    if (!sessionToken) {
      sessionToken = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionToken);
    }

    // Attach to headers
    config.headers['x-session-token'] = sessionToken;

    // Bypass zrok interstitial in development
    if (import.meta.env.MODE === 'development') {
      config.headers['skip_zrok_interstitial'] = 'true';
    }

    return config;
  });

  // Response interceptor
  let isRefreshing = false;
  let failedQueue: QueuedRequest[] = [];
  let refreshPromise: Promise<unknown> | null = null;

  const processQueue = (error: Error | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(instance(prom.config));
      }
    });
    failedQueue = [];
  };

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const errorMessage = extractErrorMessage(error);
      error.message = errorMessage;

      if (!error.response || !originalRequest) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        if (
          originalRequest.url?.includes(API_ENDPOINTS.REFRESH) ||
          originalRequest.url?.includes(API_ENDPOINTS.LOGIN)
        ) {
          if (originalRequest.url?.includes(API_ENDPOINTS.REFRESH)) {
            window.dispatchEvent(
              new CustomEvent('auth:logout', {
                detail: { message: 'Session expired. Please login again.' },
              })
            );
          }
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          if (!refreshPromise) {
            refreshPromise = instance.post(API_ENDPOINTS.REFRESH);
          }
          await refreshPromise;

          processQueue(null);
          refreshPromise = null;

          return instance(originalRequest);
        } catch (refreshError) {
          const refreshErrorMessage = extractErrorMessage(refreshError);
          processQueue(new Error(refreshErrorMessage));
          refreshPromise = null;

          window.dispatchEvent(
            new CustomEvent('auth:logout', {
              detail: { message: 'Session expired. Please login again.' },
            })
          );

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response.status === 403) {
        window.dispatchEvent(
          new CustomEvent('auth:forbidden', {
            detail: { message: errorMessage || 'Access denied' },
          })
        );
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const axiosInstance = createAxiosInstance();
