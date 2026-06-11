import { Router } from 'express';

import { signupController } from './auth.controller.js';
import { signupSchema } from './auth.validation.js';
import { validate } from '../../shared/middlewares/validate.middleware.js';

const Authrouter = Router();

Authrouter.post(
   '/signup',
   validate(signupSchema),
   signupController
);

export default Authrouter;