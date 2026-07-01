import Express from 'express'
import { ROUTES } from '../../../shared/constants/routes.js'
import { VenueParamsSchema, VenueQuerySchema } from '../../validators/VenderVenue.validator.js'
import { iUserVenueController } from '../../controllers/di.js'
import { validate } from '../../middlewares/validator.js'


const router = Express.Router()


//venue
router.get(ROUTES.USER.VENUE.GET_ALL, validate(VenueQuerySchema, 'query'), iUserVenueController.getAllVenues)
router.get(ROUTES.USER.VENUE.GET_BY_ID, validate(VenueParamsSchema, 'params'), iUserVenueController.getVenueById)
router.get(ROUTES.USER.VENUE.TOP_VENUES, iUserVenueController.getTopVenues)








export default router