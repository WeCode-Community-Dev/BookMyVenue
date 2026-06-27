import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { Permissions } from "../utils/role-permission";
import {
  getAllUsersController,
  updateUserRoleController,
  deleteUserController,
} from "../controllers/user.controller";

const userRoute = Router();

userRoute.get("/", isAuthenticated, authorize(Permissions.MANAGE_USERS), getAllUsersController);

userRoute.patch(
  "/:userId/role",
  isAuthenticated,
  authorize(Permissions.MANAGE_USERS),
  updateUserRoleController,
);

userRoute.delete(
  "/:userId",
  isAuthenticated,
  authorize(Permissions.MANAGE_USERS),
  deleteUserController,
);

export default userRoute;
