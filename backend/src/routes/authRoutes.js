import express from "express";
import {
    becomeProvider,
    forgotPassword,
    getMe,
    login,
    logout,
    register,
    resendOtp,
    resetPassword,
    updateMe,
    updateProfileImage,
    verifyEmail,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/userAuthMiddleware.js";
import upload from "../middleware/upload.js";


const authRouter = express.Router();

authRouter.post("/register", register); 
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.get("/me", authMiddleware, getMe);
authRouter.patch("/me", authMiddleware, updateMe);
authRouter.patch(
    "/me/avatar",
    authMiddleware,
    upload.single("profileImage"),
    updateProfileImage
);
authRouter.post("/logout", logout);

authRouter.patch("/become-provider", authMiddleware, becomeProvider);


export default authRouter;