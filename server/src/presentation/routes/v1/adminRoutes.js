import Express from 'express'
import { iAdminUserController } from '../../controllers/di.js'
import { ROUTES } from '../../../shared/constants/routes.js'
import { getAllUsersQuerySchema, updateUserStatusSchema } from '../../validators/adminUser.validator.js'
import { validate } from '../../middlewares/validator.js'

const router = Express.Router()

router.get(
    ROUTES.ADMIN.USERS, validate(getAllUsersQuerySchema, 'query'),
    iAdminUserController.getAllUsers
)

router.patch(
    ROUTES.ADMIN.UPDATE_USER_STATUS,validate(updateUserStatusSchema,'body'),
    iAdminUserController.updateUserStatus
)

export default router