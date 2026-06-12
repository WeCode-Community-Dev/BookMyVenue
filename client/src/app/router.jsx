import { createBrowserRouter } from 'react-router-dom';
import SignupPage from '../modules/auth/pages/SignupPage';
import LoginPage from '../modules/auth/pages/LoginPage';
import { ROUTES } from '../shared/constants/routes';
import LandingPage from '../modules/landingPage/pages/LandingPage';
import OwnerDashboard from "../modules/venues/pages/OwnerDashboard";

const router = createBrowserRouter([
   {
      path: ROUTES.SIGNUP,
      element: <SignupPage />
   },
   {
      path: ROUTES.HOME,
      element: <LandingPage />
   },
   {

      path: ROUTES.LOGIN,

      element: <LoginPage />

   },
   {
      path: ROUTES.OWNER_DASHBOARD,
      element: <OwnerDashboard />,
    }
]);

export default router;