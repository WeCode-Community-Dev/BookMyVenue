import express from "express";
import { forgotPassword, getMe, login, logout, register, resendOtp, resetPassword, verifyEmail} from "../controllers/authController.js";
import authMiddleware from "../middleware/userAuthMiddleware.js";


const authRouter = express.Router();

authRouter.post("/register", register); 
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/me", authMiddleware, getMe);
authRouter.post("/logout", logout); 




export default authRouter;