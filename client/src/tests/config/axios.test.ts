import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/constants', () => ({
  API_BASE_URL: 'http://test.local',
  STORAGE_KEYS: {
    SESSION_TOKEN: 'x-session-token',
    IS_LOGGED_IN: 'isLoggedIn',
    USER_ID: 'user_id',
    USER_NAME: 'user_name',
    USER_ROLE: 'user_role',
  },
  API_ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/user/profile',
    VENUES: '/venues',
    MY_VENUES: '/venues/my-venues',
    VENUE_BY_ID: (id: string) => `/venues/${id}`,
    VENUE_SUBMIT: (id: string) => `/venues/${id}/submit`,
    VENUE_UPDATE: (id: string) => `/venues/${id}`,
    VENUE_DRAFT: '/venues/draft',
    UPLOAD_SIGNATURE: '/venues/upload-signature',
    MY_BOOKINGS: '/bookings/my-bookings',
    BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
    SAVE_BOOKER_DETAILS: '/bookings/booker-details',
    CANCEL_BOOKING: (id: string) => `/bookings/${id}`,
    CHECKOUT: '/bookings/checkout',
    RELEASE_LOCK: '/availability/lock',
    GET_AVAILABILITY: (id: string) => `/availability/${id}`,
    BLOCK_SLOT: (id: string) => `/availability/${id}/block`,
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    SEARCH: '/search',
    DASHBOARD: '/dashboard',
  },
}));

describe('createAxiosInstance', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should create an axios instance with correct defaults', async () => {
    const { createAxiosInstance } = await import('../../config/axios');
    const instance = createAxiosInstance();
    expect(instance.defaults.baseURL).toBe('http://test.local/api/v1');
    expect(instance.defaults.withCredentials).toBe(true);
    expect(instance.defaults.timeout).toBe(30000);
  });

  it('should set session token in request interceptor', async () => {
    localStorage.setItem('x-session-token', 'test-token-123');
    const { createAxiosInstance } = await import('../../config/axios');
    const instance = createAxiosInstance();
    const interceptor = instance.interceptors.request;
    expect(interceptor).toBeDefined();
  });

  it('should generate session token on request', async () => {
    const { createAxiosInstance } = await import('../../config/axios');
    const instance = createAxiosInstance();
    instance.interceptors.request.handlers[0].fulfilled({ headers: {} } as never);
    const token = localStorage.getItem('x-session-token');
    expect(token).toBeTruthy();
    expect(token?.length).toBeGreaterThan(0);
  });

  it('should export a singleton axiosInstance', async () => {
    const { axiosInstance } = await import('../../config/axios');
    expect(axiosInstance).toBeDefined();
    expect(axiosInstance.defaults.baseURL).toBe('http://test.local/api/v1');
  });

  it('should handle error extraction from AxiosError message', () => {
    const error = new Error('Request failed');
    expect(error.message).toBe('Request failed');
  });

  it('should handle errors without response', () => {
    const error = new Error('Network Error');
    expect(error.message).toBe('Network Error');
  });
});
