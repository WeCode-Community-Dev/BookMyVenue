import express from "express";
import {
  registerCustomer,
  registerOwner,
  loginUser,
  rootAdminLogin,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/owner", registerOwner);
router.post("/login", loginUser);
router.post("/root-admin/login", rootAdminLogin);

router.get("/profile", authMiddleware, (req, res) => {
  const authReq = req as AuthRequest;

  res.status(200).json({
    message: "Protected profile route accessed successfully",
    user: authReq.user,
  });
});

router.get(
  "/root-admin/test",
  authMiddleware,
  allowRoles("root_admin"),
  (req, res) => {
    const authReq = req as AuthRequest;

    res.status(200).json({
      message: "Root admin protected route accessed successfully",
      user: authReq.user,
    });
  }
);

export default router;