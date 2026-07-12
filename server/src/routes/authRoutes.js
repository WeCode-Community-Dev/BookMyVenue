import express from "express";
import { register, login, refresh, logout, getMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout)

router.get("/me", authenticate, getMe);

export default router;