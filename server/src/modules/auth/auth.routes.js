import { Router } from 'express';

import { signupController, loginController } from './auth.controller.js';
import { signupSchema, loginSchema } from './auth.validation.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';

const router = Router();

router.post(
   '/signup',
   validate(signupSchema),
   signupController
);

router.post(
   '/login',
   validate(loginSchema),
   loginController
);

export default router;