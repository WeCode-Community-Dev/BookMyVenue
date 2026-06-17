import AdminDashboard from "./pages/AdminDashboard";

import { ROUTES } from "../../shared/constants/routes";

export const adminRoutes = [
   {
      path: ROUTES.ADMIN,
      element: <AdminDashboard />,
   }
];