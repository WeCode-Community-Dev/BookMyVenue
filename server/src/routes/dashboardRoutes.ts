import { Router } from "express";
import {
  getAdminDashboardSummary,
  getOwnerDashboardSummary,
} from "../controllers/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = Router();

// Root admin sees full platform dashboard.
router.get(
  "/admin",
  authMiddleware,
  allowRoles("root_admin"),
  getAdminDashboardSummary
);

// Owner sees dashboard for their own venues.
router.get(
  "/owner",
  authMiddleware,
  allowRoles("owner"),
  getOwnerDashboardSummary
);

export default router;