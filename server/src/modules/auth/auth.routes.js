import { Router } from 'express';

import { signupController, loginController } from './auth.controller.js';
import { signupSchema, loginSchema } from './auth.validation.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';

const Authrouter = Router();

Authrouter.post(
   '/signup',
   validate(signupSchema),
   signupController
);

Authrouter.post(
   '/login',
   validate(loginSchema),
   loginController
);

export default Authrouter;
