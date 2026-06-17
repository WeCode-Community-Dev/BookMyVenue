import VenueListingPage from "./pages/VenueListingPage";
// later:
// import VenueDetailsPage from "./pages/VenueDetailsPage";

import { ROUTES } from "../../shared/constants/routes";

export const venueRoutes = [
   {
      path: ROUTES.VENUES,
      element: <VenueListingPage />,
   },

   // later
   // {
   //    path: ROUTES.VENUE_DETAILS,
   //    element: <VenueDetailsPage />,
   // },
];