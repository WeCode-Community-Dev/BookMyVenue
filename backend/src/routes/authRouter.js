
import { Router } from "express";
import authController from "../controllers/authController.js";
import { catchErrors } from "../handlers/error_handlers.js";
import { isAuthenticated } from "../middlewares/authentication.js";

const router = Router();
console.log("Routes file loaded");

router.post('/login', catchErrors(authController.login))

router.post('/register', catchErrors(authController.register))


router.get('/me', isAuthenticated, catchErrors(authController.getCurrentUser))

export default router;