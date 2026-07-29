import { Request, Response, NextFunction } from 'express';
import { wishlistService } from '../services/wishlist.service';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/http';
import success from '../utils/response';

export const toggleWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const venueId = req.params.venueId as string;

    const result = await wishlistService.toggleWishlist(userId, venueId);

    success(
      res,
      HTTP_STATUS.OK,
      result,
      result.isAdded ? 'Venue added to wishlist' : 'Venue removed from wishlist'
    );
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('Unauthorized access', HTTP_STATUS.UNAUTHORIZED);
    }

    const wishlist = await wishlistService.getWishlist(userId);

    success(res, HTTP_STATUS.OK, wishlist, 'Wishlist retrieved successfully');
  } catch (error) {
    next(error);
  }
};
