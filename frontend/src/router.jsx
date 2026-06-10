import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { publicRoutes } from "../src/routes/publicRoutes";
import { protectedRoutes } from "../src/routes/protectedRoutes";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      ...protectedRoutes,
      publicRoutes,
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);