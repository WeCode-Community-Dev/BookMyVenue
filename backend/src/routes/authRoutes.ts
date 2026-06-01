import { Router } from "express";

import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

const router = Router();

router.post("/register", validateRequest(registerSchema), authController.register);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/me", authenticate, authController.getMe);

export default router;
