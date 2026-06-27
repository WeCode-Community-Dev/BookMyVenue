import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import { createReservationController } from "../controllers/reservation.controller";

const reservationRoute = Router();

reservationRoute.post(
  "/create",
  isAuthenticated,
  authorize(Permissions.CREATE_BOOKING),
  createReservationController,
);

export default reservationRoute;
