import Express from 'express'
import { iAdminAuthController, iUserAuthController, iVendorAuthController } from '../../controllers/di.js'
import { validate } from '../../middlewares/validator.js'
import { registerSchema, verifyOtpSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, resendOtpSchema} from '../../validators/auth.validator.js'
import { ROUTES } from '../../../shared/constants/routes.js'
const router = Express.Router()


//user
router.post(ROUTES.USER.AUTH.REGISTER, validate(registerSchema, 'body'), iUserAuthController.register)
router.post(ROUTES.USER.AUTH.VERIFY_OTP, validate(verifyOtpSchema, 'body'), iUserAuthController.verifyOtp)
router.post(ROUTES.USER.AUTH.RESEND_OTP, validate(resendOtpSchema, 'body'), iUserAuthController.resendOtp)
router.post(ROUTES.USER.AUTH.LOGIN, validate(loginSchema, 'body'), iUserAuthController.login)
router.post(ROUTES.USER.AUTH.REFRESH, iUserAuthController.refreshToken)
router.post(ROUTES.USER.AUTH.LOGOUT, iUserAuthController.logout)
router.post(ROUTES.USER.AUTH.FORGOT_PASSWORD, validate(forgotPasswordSchema, 'body'), iUserAuthController.forgotPassword)
router.post(ROUTES.USER.AUTH.RESET_PASSWORD, validate(resetPasswordSchema, 'body'), iUserAuthController.resetPassword)

//vendor
router.post(ROUTES.OWNER.AUTH.REGISTER, validate(registerSchema, 'body'), iVendorAuthController.register)
router.post(ROUTES.OWNER.AUTH.LOGIN, validate(loginSchema, 'body'), iVendorAuthController.login)
router.post(ROUTES.OWNER.AUTH.VERIFY_OTP, validate(verifyOtpSchema, 'body'), iVendorAuthController.verifyOtp)
router.post(ROUTES.OWNER.AUTH.RESEND_OTP, validate(resendOtpSchema, 'body'), iVendorAuthController.resendOtp)
router.post(ROUTES.OWNER.AUTH.REFRESH, iVendorAuthController.refreshToken)
router.post(ROUTES.OWNER.AUTH.FORGOT_PASSWORD, validate(forgotPasswordSchema, 'body', iVendorAuthController.forgotPassword))
router.post(ROUTES.OWNER.AUTH.RESET_PASSWORD, validate(resetPasswordSchema, 'body'), iVendorAuthController.resetPassword)
router.post(ROUTES.OWNER.AUTH.LOGOUT, iVendorAuthController.logout)


//admin
router.post(ROUTES.ADMIN.AUTH.LOGIN, validate(loginSchema, 'body'), iAdminAuthController.login)
router.post(ROUTES.ADMIN.AUTH.LOGOUT, iAdminAuthController.logout)
router.post(ROUTES.ADMIN.AUTH.REFRESH, iAdminAuthController.refreshToken)


export default router