import Express from 'express'
import { iAuthController } from '../../controllers/di.js'
import VendorAuthRoutes from './vendorAuthRoutes.js'

const router = Express.Router()

router.post('/register', iAuthController.register)
router.post('/login', iAuthController.login)
router.use('/vendor', VendorAuthRoutes)
router.post('/admin-login', iAuthController.adminLogin)
router.post('/refresh-token', iAuthController.refreshToken)
router.post('/logout', iAuthController.logout)

export default router
