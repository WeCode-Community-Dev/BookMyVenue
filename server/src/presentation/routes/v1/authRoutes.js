import Express from 'express'
// import passport from '../../../infrastructure/config/passport.config.js'  // TODO: Google Auth - temporarily disabled
import { iAuthController } from '../../controllers/di.js'
import VendorAuthRoutes from './vendorAuthRoutes.js'
import { registerValidation, verifyOtpValidation } from '../../validators/auth.validator.js'
import { otpRateLimiter } from '../../middlewares/otpRateLimiter.js'

const router = Express.Router()

router.post('/register', registerValidation, iAuthController.register)
router.post('/verify-otp', verifyOtpValidation, otpRateLimiter, iAuthController.verifyOtp)
router.post('/resend-otp', otpRateLimiter, iAuthController.resendOtp)
router.post('/login', iAuthController.login)
router.use('/vendor', VendorAuthRoutes)
router.post('/admin-login', iAuthController.adminLogin)
router.post('/refresh-token', iAuthController.refreshToken)
router.post('/logout', iAuthController.logout)
router.post('/forgot-password', iAuthController.forgotPassword)
router.post('/reset-password', iAuthController.resetPassword)

// TODO: Google Auth - temporarily disabled
// router.get('/google',
//     passport.authenticate('google', { scope: ['profile', 'email'], session: false })
// )
// router.get('/google/callback',
//     passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`, session: false }),
//     iAuthController.googleAuthCallback
// )

export default router
