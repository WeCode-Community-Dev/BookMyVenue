import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  CUSTOMER_ROUTES,
  OWNER_ROUTES,
  PUBLIC_ROUTES,
} from "./route-path";
import SignIn from "../../pages/auth/sign-in";
import SignUp from "../../pages/auth/sign-up";
import Home from "@/pages/home/home";
import VenueList from "@/pages/venues/venue-list";
import VenueDetailsPublic from "@/pages/venues/venue-details";
import MyBookings from "@/pages/customer/my-bookings";
import OwnerDashboard from "@/pages/owner/owner-dashboard";
import CreateVenueForm from "@/pages/owner/create-venue-form";
import VenueDetails from "@/pages/owner/venue-details";
import VenueBookings from "@/pages/owner/venue-bookings";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminVenues from "@/pages/admin/admin-venues";
import AdminUsers from "@/pages/admin/admin-users";
import AdminRevenue from "@/pages/admin/admin-revenue";

export const publicRoutePaths = [
  { path: PUBLIC_ROUTES.HOME, element: <Home /> },
  { path: PUBLIC_ROUTES.VENUES, element: <VenueList /> },
  { path: PUBLIC_ROUTES.VENUE_DETAILS, element: <VenueDetailsPublic /> },
];

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
];

export const ownerRoutePaths = [
  { path: OWNER_ROUTES.DASHBOARD, element: <OwnerDashboard /> },
  { path: OWNER_ROUTES.CREATE_VENUE, element: <CreateVenueForm /> },
  { path: OWNER_ROUTES.VENUE_DETAILS, element: <VenueDetails /> },
  { path: OWNER_ROUTES.BOOKINGS, element: <VenueBookings /> },
];

export const customerRoutePaths = [
  { path: CUSTOMER_ROUTES.MY_BOOKINGS, element: <MyBookings /> },
];

export const adminRoutePaths = [
  { path: ADMIN_ROUTES.DASHBOARD, element: <AdminDashboard /> },
  { path: ADMIN_ROUTES.VENUES, element: <AdminVenues /> },
  { path: ADMIN_ROUTES.USERS, element: <AdminUsers /> },
  { path: ADMIN_ROUTES.REVENUE, element: <AdminRevenue /> },
];
