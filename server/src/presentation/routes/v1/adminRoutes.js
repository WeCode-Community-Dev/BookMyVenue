import Express from 'express'
import { iAdminUserController } from '../../controllers/di.js'
import { ROUTES } from '../../../shared/constants/routes.js'

const router = Express.Router()

router.get(
    ROUTES.ADMIN.USERS,
    iAdminUserController.getAllUsers
)

router.patch(
    ROUTES.ADMIN.UPDATE_USER_STATUS,
    iAdminUserController.updateUserStatus
)

export default router