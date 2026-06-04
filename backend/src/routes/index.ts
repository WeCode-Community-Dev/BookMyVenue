import { Router } from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import venueRoutes from "./venueRoutes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/venues/auth", venueRoutes);
export default router;
