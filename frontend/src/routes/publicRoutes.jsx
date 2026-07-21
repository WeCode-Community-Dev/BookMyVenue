import { Login } from "../features/auth/Login/Login";
import Register from "../features/auth/Register/Register";
import AuthLayout from "../layouts/AuthLayout";
import LandingPage from "../features/landing/LandingPage";

export const publicRoutes = [
  { index: true, element: <LandingPage /> },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
];
