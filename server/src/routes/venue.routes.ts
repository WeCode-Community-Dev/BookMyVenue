import { Router } from 'express';
import * as publicVenueController from '@/controllers/public-venue.controller';
import { validateQuery, validateObjectId } from '@/middlewares/validate.middleware';
import { getPublicVenuesQuerySchema } from '@/dto/venue/get-public-venues.dto';
import * as categoryController from '@/controllers/category.controller';
const router = Router();

// Public venue routes (no auth required)
router.get('/', validateQuery(getPublicVenuesQuerySchema), publicVenueController.getPublicVenues);
router.get('/categories', categoryController.getCategories);
router.get('/:id', validateObjectId('id'), publicVenueController.getPublicVenueById);

export default router;
