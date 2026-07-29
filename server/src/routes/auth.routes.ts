import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateInputs } from '@/middlewares/validate.middleware';
import { authRoutes } from '@/constants/routes';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { signupSchema } from '@/dto/auth/register.dto';
import { verifyOtpSchema } from '@/dto/auth/verify-otp.dto';
import { resendOtpSchema } from '@/dto/auth/resent-otp.dto';
import { signinSchema } from '@/dto/auth/login.dto';
import { forgotPasswordSchema } from '@/dto/auth/forgot-password.dto';
import { resetPasswordSchema } from '@/dto/auth/reset-password.dto';

const router = Router();

router.post(authRoutes.signup, validateInputs(signupSchema), authController.signup);
router.post(authRoutes.signin, validateInputs(signinSchema), authController.signin);
router.post(authRoutes.google, authController.googleAuth);
router.post(authRoutes.verifyOtp, validateInputs(verifyOtpSchema), authController.verifyOtp);
router.post(authRoutes.resendOtp, validateInputs(resendOtpSchema), authController.resendOtp);
router.post(authRoutes.refreshToken, authController.refreshToken);
router.post(
  authRoutes.forgotPassword,
  validateInputs(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  authRoutes.verifyForgotPasswordOtp,
  validateInputs(verifyOtpSchema),
  authController.verifyForgotPasswordOtp
);
router.post(
  authRoutes.resetPassword,
  validateInputs(resetPasswordSchema),
  authController.resetPassword
);
router.post(authRoutes.logout, authMiddleware, authController.logout);

export default router;
