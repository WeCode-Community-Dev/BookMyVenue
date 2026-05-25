import { Router } from "express";
import { UserController } from "../controllers/UserController";

export function createUserRouter(controller: UserController): Router {
  const router = Router();

  router.get("/:id", controller.getById);
  router.post("/", controller.create);

  return router;
}
