import Express from 'express'
import { iAdminUserController } from '../../controllers/di.js'
import { iAdminVendorControlller } from '../../controllers/di.js'
import { ROUTES } from '../../../shared/constants/routes.js'
import { getAllUsersQuerySchema, updateUserStatusSchema } from '../../validators/adminUser.validator.js'
import { validate } from '../../middlewares/validator.js'
import { getAllVendorsQuerySchema, updateVendorApprovalSchema } from '../../validators/adminVendor.validator.js'

const router = Express.Router()
//User
router.get(
    ROUTES.ADMIN.USER.GET_ALL, validate(getAllUsersQuerySchema, 'query'),
    iAdminUserController.getAllUsers
)

router.patch(
    ROUTES.ADMIN.USER.UPDATE_STATUS,validate(updateUserStatusSchema,'body'),
    iAdminUserController.updateUserStatus
)
//vendor
router.get(ROUTES.ADMIN.VENDOR.GET_ALL,validate(getAllVendorsQuerySchema,'query'),iAdminVendorControlller.getAllVendors)
router.get(ROUTES.ADMIN.VENDOR.GET_BY_ID,iAdminVendorControlller.getVendorById)
router.patch(ROUTES.ADMIN.VENDOR.UPDATE_APPROVAL_STATUS,validate(updateVendorApprovalSchema,'body'),iAdminVendorControlller.updateApprovalStatus)
export default router