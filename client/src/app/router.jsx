import { createBrowserRouter } from 'react-router-dom';
import SignupPage from '../modules/auth/pages/SignupPage';

const router = createBrowserRouter([
   {
      path: '/signup',
      element: <SignupPage />
   }
]);

export default router;