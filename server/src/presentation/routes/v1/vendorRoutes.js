import Express from 'express'
import { ROUTES } from '../../../shared/constants/routes.js'
import cloudinaryUpload from '../../middlewares/cloudinaryUpload.js'
import {iVendorVenueController} from '../../controllers/di.js'
import { validate } from '../../middlewares/validator.js'
import { createVenueSchema, VenueParamsSchema } from '../../validators/VenderVenue.validator.js'


const router = Express.Router()

const uploadVenueImages = cloudinaryUpload("venues")

//venue
router.post(ROUTES.OWNER.VENUE.CREATE, uploadVenueImages.array("images", 10),  validate(createVenueSchema, 'body'), iVendorVenueController.createVenue)
router.post(ROUTES.OWNER.VENUE.EDIT, uploadVenueImages.array('images', 10), validate(createVenueSchema, 'body'), validate(VenueParamsSchema, 'params'), iVendorVenueController.updateVenue)


export default router