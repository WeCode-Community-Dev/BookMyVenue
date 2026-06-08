import { createBrowserRouter } from 'react-router-dom';
import SignupPage from '../modules/auth/pages/SignupPage';
import LoginPage from '../modules/auth/pages/LoginPage';
import { ROUTES } from '../shared/constants/routes';

const router = createBrowserRouter([
   {
      path: ROUTES.SIGNUP,
      element: <SignupPage />
   },
   {

      path: ROUTES.LOGIN,

      element: <LoginPage />

   }
]);

export default router;