import { AUTH_ROUTES, OWNER_ROUTES, PUBLIC_ROUTES } from "./route-path";
import SignIn from "../../pages/auth/sign-in";
import SignUp from "../../pages/auth/sign-up";
import Home from "@/pages/home/home";
import VenueList from "@/pages/venues/venue-list";
import VenueDetailsPublic from "@/pages/venues/venue-details";
import OwnerDashboard from "@/pages/owner/owner-dashboard";
import CreateVenueForm from "@/pages/owner/create-venue-form";
import VenueDetails from "@/pages/owner/venue-details";
import VenueBookings from "@/pages/owner/venue-bookings";

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
