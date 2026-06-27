import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
  loginController,
  registerController,
  logoutController,
  getMeController,
} from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/sign-up", registerController);
authRoute.post("/sign-in", loginController);
authRoute.post("/logout", logoutController);
authRoute.get("/me", isAuthenticated, getMeController);

export default authRoute;
