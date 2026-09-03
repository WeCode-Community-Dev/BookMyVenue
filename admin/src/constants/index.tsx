// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3003";

export const API_TIMEOUT = 30000;

export const CLIENT_APP_URL =
  import.meta.env.VITE_CLIENT_URL || "http://localhost:5173";

// Storage Keys
export const STORAGE_KEYS = {
  USER_ID: "user_id",
  USER_NAME: "user_name",
  USER_ROLE: "user_role",
  IS_LOGGED_IN: "isLoggedIn",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  PROFILE: "/user/profile",
  DASHBOARD: "/dashboard",
  VENUES: "/venues",
  FEATURED_VENUES: "/venues/featured",
  SEARCH: "/search",
  ADMIN_VENUES: "/venues/all",
  ADMIN_BOOKINGS: "/bookings/all",
  ADMIN_USERS: "/user/all",
  RBAC_ADMINS: "/role/admins",
  RBAC_PROMOTE: "/role/promote",
  RBAC_DEMOTE: "/role/demote",
  MY_VENUES: "/venues/my-venues",
  OWNER_ANALYTICS: "/owner/analytics",
  OWNER_BLOCK_DATES: "/owner",
  OWNER_UNBLOCK_DATES: "/owner",
  OWNER_VENUE_BOOKINGS: "/owner/venue",
  OWNER_OFFLINE_BOOKING: "/owner/bookings/offline",
  OWNER_VENUE_SETTINGS: "/owner/venue",
  UPLOAD_SIGNATURE: "/venues/upload-signature",
  MODERATION_BANS: "/moderation/bans",
  MODERATION_SUMMARY: "/moderation/summary",
  MODERATION_LOGS: "/moderation/logs",
  REVIEWS: "/reviews",
  TOGGLE_USER_STATUS: "/user",
  CHANGE_PASSWORD: "/auth/change-password",
  RESET_PASSWORD: "/user",
} as const;
