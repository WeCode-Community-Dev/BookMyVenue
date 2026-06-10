import Express from 'express'
import { ROUTES } from '../../../shared/constants/routes.js'
import { VenueQuerySchema } from '../../validators/VenderVenue.validator.js'
import { iUserVenueController } from '../../controllers/di.js'
import { validate } from '../../middlewares/validator.js'


const router = Express.Router()


//venue
router.get(ROUTES.USER.VENUE.GET_ALL, validate(VenueQuerySchema, 'query'), iUserVenueController.getAllVenues)









export default router