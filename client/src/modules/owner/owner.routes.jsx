
import { ROUTES } from "../../shared/constants/routes";

import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerVenuesPage from "./pages/OwnerVenuesPage";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import OwnerLayout from "./components/OwnerLayout";

const ownerRoutes = [
   {
      path: ROUTES.OWNER,
      element: <OwnerLayout />,
      children: [
         {
            index: true,
            element: <OwnerDashboard />,
         },

         {
            path: "venues",
            element: <OwnerVenuesPage />,
         },

         {
            path: "bookings",
            element: <OwnerBookingsPage />,
         },
      ],
   },
];

export default ownerRoutes;