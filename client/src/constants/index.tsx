export { FILTER_PRICE_STEPS, KERALA_DISTRICTS } from './filterConstants';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003';
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5174';
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

// Storage Keys
const STORAGE_KEYS = {
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
  USER_ROLE: 'user_role',
  IS_LOGGED_IN: 'isLoggedIn',
  THEME: 'theme',
  SESSION_TOKEN: 'x-session-token',
  WISHLIST_PREFIX: 'wishlist_',
} as const;

// API Endpoints
const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  SESSIONS: '/auth/sessions',
  SESSION_BY_ID: (id: string) => `/auth/sessions/${id}`,
  LOGOUT_OTHER_SESSIONS: '/auth/sessions/logout-others',

  // User
  PROFILE: '/user/profile',
  PROFILE_UPLOAD_SIGNATURE: '/user/profile/upload-signature',
  PROFILE_PICTURE: '/user/profile/picture',

  // Venues
  SEARCH: '/search',
  VENUES: '/venues',
  FEATURED_VENUES: '/venues/featured',
  MY_VENUES: '/venues/my-venues',
  VENUE_BY_ID: (id: string) => `/venues/${id}`,
  VENUE_SUBMIT: (id: string) => `/venues/${id}/submit`,
  VENUE_UPDATE: (id: string) => `/venues/${id}`,
  VENUE_DRAFT: '/venues/draft',
  VENUE_PINS: '/venues/pins',
  UPLOAD_SIGNATURE: '/venues/upload-signature',

  // Availability
  BLOCK_SLOT: (id: string) => `/availability/${id}/block`,
  GET_AVAILABILITY: (id: string) => `/availability/${id}`,
  RELEASE_LOCK: '/availability/lock',

  // Bookings
  CHECKOUT: '/bookings/checkout',
  VERIFY_PAYMENT: '/bookings/verify-payment',
  MY_BOOKINGS: '/bookings/my-bookings',
  BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
  SAVE_BOOKER_DETAILS: '/bookings/booker-details',
  CANCEL_BOOKING: (id: string) => `/bookings/${id}`,

  // Reviews
  VENUE_REVIEWS: (venueId: string) => `/reviews/venue/${venueId}`,
  VENUE_MY_RATING: (venueId: string) => `/reviews/venue/${venueId}/my-rating`,
  REVIEW_BY_ID: (id: string) => `/reviews/${id}`,

  // Wishlist
  WISHLIST: '/wishlist',
  WISHLIST_TOGGLE: (venueId: string) => `/wishlist/toggle/${venueId}`,
  WISHLIST_STATUS: '/wishlist/status',
  WISHLIST_SYNC: '/wishlist/sync',

  // Geo
  GEO_SEARCH: '/geo/search',

  // Misc
  DASHBOARD: '/dashboard',
} as const;

export { API_ENDPOINTS, STORAGE_KEYS, API_BASE_URL, DASHBOARD_URL, RAZORPAY_KEY_ID };
