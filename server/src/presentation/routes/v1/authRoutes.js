import Express from 'express'
import { iAuthController } from '../../controllers/di.js'

const router = Express.Router()

router.post('/register', iAuthController.register)
router.post('/login', iAuthController.login)
router.post('/refresh-token', iAuthController.refreshToken)
router.post('/logout', iAuthController.logout)

export default router
