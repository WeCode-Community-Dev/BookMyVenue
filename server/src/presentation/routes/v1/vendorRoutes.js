import Express from 'express'
import { ROUTES } from '../../../shared/constants/routes.js'
import cloudinaryUpload from '../../middlewares/cloudinaryUpload.js'
import {iVendorVenueController} from '../../controllers/di.js'


const router = Express.Router()

const uploadVenueImages = cloudinaryUpload("venues")

//venue
router.post(ROUTES.OWNER.VENUE.CREATE, uploadVenueImages.array("images", 10), iVendorVenueController.createVenue)

export default router