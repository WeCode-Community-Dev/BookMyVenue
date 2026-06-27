export const PUBLIC_ROUTES = {
  HOME: "/",
  VENUES: "/venues",
  VENUE_DETAILS: "/venues/:venueId",
};

export const AUTH_ROUTES = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
};

export const CUSTOMER_ROUTES = {
  MY_BOOKINGS: "/my-bookings",
};

export const OWNER_ROUTES = {
  DASHBOARD: "/owner-dashboard",
  CREATE_VENUE: "/create-venue",
  VENUE_DETAILS:"/venue-details",
  BOOKINGS: "/bookings",
};

export const ADMIN_ROUTES = {
  VENUES: "/admin/venues",
  USERS: "/admin/users",
};

import type { UserRole } from "@/types/auth.types";

export const getRoleLandingPath = (role: UserRole) =>
  role === "OWNER" ? OWNER_ROUTES.DASHBOARD : PUBLIC_ROUTES.HOME;
