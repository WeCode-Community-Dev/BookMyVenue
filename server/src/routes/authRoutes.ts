import express from "express";
import { registerCustomer } from "../controllers/authController.js";

const router = express.Router();

router.post("/register/customer", registerCustomer);

export default router;