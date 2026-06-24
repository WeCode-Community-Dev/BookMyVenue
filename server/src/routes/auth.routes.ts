import { Router } from "express";
import { loginController, registerController } from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/sign-up", registerController);
authRoute.post("/sign-in", loginController);

export default authRoute;
