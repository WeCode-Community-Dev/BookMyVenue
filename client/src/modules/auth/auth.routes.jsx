import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";

import { ROUTES } from "../../shared/constants/routes";

export const authRoutes = [
   {
      path: ROUTES.LOGIN,
      element: <LoginPage />,
   },
   {
      path: ROUTES.SIGNUP,
      element: <SignupPage />,
   },
   {
      path: ROUTES.ADMIN_LOGIN,
      element: <AdminLoginPage />,
   },
];