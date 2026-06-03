import { createBrowserRouter } from 'react-router-dom';
import SignupPage from '../modules/auth/pages/SignupPage';
import { ROUTES } from '../shared/constants/routes';
import LandingPage from './components/LandingPage';


const router = createBrowserRouter([
   {
      path: ROUTES.SIGNUP,
      element: <SignupPage />
   },
   {
      path: ROUTES.HOME,
      element: <LandingPage />
   }
]);

export default router;