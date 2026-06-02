import { Router } from 'express';

import { signupController } from './auth.controller.js';
import { signupSchema } from './auth.validation.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';

const router = Router();

router.post(
   '/signup',
   validate(signupSchema),
   signupController
);

export default router;