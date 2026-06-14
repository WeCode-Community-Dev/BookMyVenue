import { Router } from 'express';
import favoriteController from '../controllers/favouriteController.js';
import { catchErrors } from '../handlers/error_handlers.js';
import { isAuthenticated } from '../middlewares/authentication.js';
import { requireRole } from '../middlewares/authentication.js';

const router = Router();

router.post(
  '/favorites/:venueId',
  isAuthenticated,
  requireRole('user'),
  catchErrors(favoriteController.addFavorite)
);

router.delete(
  '/favorites/:venueId',
  isAuthenticated,
  requireRole('user'),
  catchErrors(favoriteController.deleteFavorite)
);

router.get(
  '/favorites',
  isAuthenticated,
  requireRole('user'),
  catchErrors(favoriteController.getFavorites)
);

export default router;
