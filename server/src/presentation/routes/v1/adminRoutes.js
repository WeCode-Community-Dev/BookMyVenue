import Express from 'express'
import { iAdminUserController } from '../../controllers/di.js'
import { iAdminVendorControlller } from '../../controllers/di.js'
import { ROUTES } from '../../../shared/constants/routes.js'
import { getAllUsersQuerySchema, updateUserStatusSchema } from '../../validators/adminUser.validator.js'
import { validate } from '../../middlewares/validator.js'
import { getAllVendorsQuerySchema, rejectVendorBodySchema, updateVendorStatusSchema } from '../../validators/adminVendor.validator.js'

const router = Express.Router()
//User
router.get(
    ROUTES.ADMIN.USER.GET_ALL, validate(getAllUsersQuerySchema, 'query'),
    iAdminUserController.getAllUsers
)

router.patch(
    ROUTES.ADMIN.USER.UPDATE_STATUS, validate(updateUserStatusSchema, 'body'),
    iAdminUserController.updateUserStatus
)
//vendor
router.get(ROUTES.ADMIN.VENDOR.GET_ALL, validate(getAllVendorsQuerySchema, 'query'), iAdminVendorControlller.getAllVendors)
router.get(ROUTES.ADMIN.VENDOR.GET_BY_ID, iAdminVendorControlller.getVendorById)
router.patch(ROUTES.ADMIN.VENDOR.APPROVE_VENDOR, iAdminVendorControlller.approveVendor)
router.patch(ROUTES.ADMIN.VENDOR.REJECT_VENDOR,validate(rejectVendorBodySchema,'body'), iAdminVendorControlller.rejectVendor)
router.patch( ROUTES.ADMIN.VENDOR.UPDATE_STATUS, validate(updateVendorStatusSchema, 'body'),iAdminVendorControlller.updateVendorStatus)
export default router