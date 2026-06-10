import { Login } from "../features/auth/Login/Login";
import Register from "../features/auth/Register/Register";
import AuthLayout from "../layouts/AuthLayout";

export const publicRoutes = {
  element: <AuthLayout />,
  children: [
    { index: true, element: <Register /> },  // 👈 index route, only matches exact "/"
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ],
};