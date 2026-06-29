import express from "express";
import {
  registerCustomer,
  registerOwner,
  loginUser,
  rootAdminLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/register/owner", registerOwner);
router.post("/login", loginUser);
router.post("/root-admin/login", rootAdminLogin);

export default router;