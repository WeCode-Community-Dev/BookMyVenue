import { Router } from 'express';

import { signupController, loginController, adminLoginController } from './auth.controller.js';
import { signupSchema, loginSchema } from './auth.validation.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';

const authRoutes = Router();

authRoutes.post(
   '/signup',
   validate(signupSchema),
   signupController
);

authRoutes.post(
   '/login',
   validate(loginSchema),
   loginController
);

authRoutes.post(
   '/admin/login',
   validate(loginSchema),
   adminLoginController
);
export default authRoutes;
