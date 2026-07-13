export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    SIGNUP: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    REFRESH_TOKEN: '/v1/auth/refresh-token',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
    VERIFY_EMAIL: '/v1/auth/verify-email',
    RESEND_VERIFICATION: '/v1/auth/resend-verification',
    ADMIN_LOGIN: '/v1/auth/login',
  },
  CATEGORIES: {
    BASE: '/v1/categories',
  },
  USERS: {
    BASE: '/v1/users',
    PROFILE: '/v1/users/profile',
    BY_ID: (id: string) => `/v1/users/${id}`,
  },
  VENDORS: {
    // NOTE: Backend endpoints not available - do not use
    BASE: '/v1/vendor/venues',
    PROFILE: null as string | null,
    BY_ID: null as ((id: string) => string) | null,
    ANALYTICS: null as string | null,
  },
  VENUES: {
    // Public endpoints (no auth required)
    PUBLIC_BASE: '/v1/venues',
    PUBLIC_BY_ID: (id: string) => `/v1/venues/${id}`,
    AVAILABILITY: (venueId: string) => `/v1/venues/${venueId}/availability`,

    // Vendor endpoints (require VENDOR role)
    VENDOR_BASE: '/v1/vendor/venues',
    VENDOR_BY_ID: (id: string) => `/v1/vendor/venues/${id}`,
    SLOTS_BY_VENUE: (venueId: string) => `/v1/venues/${venueId}/slots`,
    DELETE_SLOT: (templateId: number) => `/v1/venues/slots/${templateId}`,
  },
  BOOKINGS: {
    BASE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    BY_USER: (userId: string) => `/users/${userId}/bookings`,
    BY_VENUE: (venueId: string) => `/venues/${venueId}/bookings`,
    BY_VENDOR: '/v1/vendor/bookings',
    MY_BOOKINGS: '/v1/bookings/my-bookings',
    CREATE_WITH_SLOT: (venueId: string, slotId: number) => `/v1/venues/${venueId}/slots/${slotId}/bookings`,
    CANCEL: (bookingId: string) => `/v1/bookings/${bookingId}/cancel`,
  },
  ADMIN: {
    DASHBOARD: '/v1/admin/dashboard',
    USERS: '/v1/admin/users',
    VENDORS: '/v1/admin/vendors',
    VENUES: '/v1/admin/venues',
    PENDING_VENUES: '/v1/admin/venues/pending',
    VENUE_APPROVE: (id: number) => `/v1/admin/venues/${id}/approve`,
    VENUE_REJECT: (id: number) => `/v1/admin/venues/${id}/reject`,
    BOOKINGS: '/v1/admin/bookings',
    ANALYTICS: '/v1/admin/analytics',
  },
  PAYMENTS: {
    CREATE: (bookingId: number) => `/v1/payments/${bookingId}`,
    VERIFY: '/v1/payments/verify',
  },
} as const;