import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import { createOrderController, verifyPaymentController } from "../controllers/payment.controller";

const paymentRoute = Router();

paymentRoute.post(
  "/create-order",
  isAuthenticated,
  authorize(Permissions.CREATE_BOOKING),
  createOrderController,
);

paymentRoute.post(
  "/verify",
  isAuthenticated,
  authorize(Permissions.CREATE_BOOKING),
  verifyPaymentController,
);

export default paymentRoute;
