import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import { getRevenueSummaryController } from "../controllers/analytics.controller";

const analyticsRoute = Router();

analyticsRoute.get(
  "/revenue",
  isAuthenticated,
  authorize(Permissions.VIEW_REVENUE),
  getRevenueSummaryController,
);

export default analyticsRoute;
