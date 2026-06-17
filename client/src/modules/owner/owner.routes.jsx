import { Outlet } from "react-router-dom";

import { ROUTES } from "../../shared/constants/routes";

import OwnerDashboard from "./pages/OwnerDashboard";

const ownerRoutes = [
   {
      path: ROUTES.OWNER,
      element: <Outlet />,
      children: [
         {
            index: true,
            element: <OwnerDashboard />,
         },

         /*
         Future routes

         {
            path: "venues",
            element: <OwnerVenuesPage />,
         },

         {
            path: "bookings",
            element: <OwnerBookingsPage />,
         },

         {
            path: "calendar",
            element: <OwnerCalendarPage />,
         },
         */
      ],
   },
];

export default ownerRoutes;