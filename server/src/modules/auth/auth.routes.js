import { Router } from 'express';

import { signupController, loginController } from './auth.controller.js';
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

export default authRoutes;
