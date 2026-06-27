import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { authenticationRoutePaths, ownerRoutePaths, publicRoutePaths } from "./common/routes";
import BaseLayout from "@/layout/base-layout";
import OwnerLayout from "@/layout/owner-layout";
import AuthRoute from "./authRoute";
import ProtectedRoute from "./protectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <NuqsAdapter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          {publicRoutePaths.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        <Route element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        <Route element={<ProtectedRoute allow={["OWNER", "ADMIN"]} />}>
          <Route element={<OwnerLayout />}>
            {ownerRoutePaths.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>
      </Routes>
      </NuqsAdapter>
    </BrowserRouter>
  );
};

export default AppRoutes;
