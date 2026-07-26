import type { Request, Response } from 'express';
import { ResponseUtil } from '../../utils/responseUtils';
import * as service from './wishlist.service';
import { handleError } from '../../utils/errors';

export const toggleWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const venueId = Array.isArray(req.params.venueId) ? req.params.venueId[0] : req.params.venueId;
    const result = await service.toggleWishlist(userId, venueId);

    ResponseUtil.success(
      res,
      result.wishlisted ? 'Added to wishlist' : 'Removed from wishlist',
      result
    );
  } catch (err) {
    handleError(res, err, 'toggleWishlist');
  }
};

export const syncWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const { venueIds } = req.validated?.body as { venueIds: string[] };
    const status = await service.syncWishlist(userId, venueIds);

    ResponseUtil.success(res, 'Wishlist synced successfully', status);
  } catch (err) {
    handleError(res, err, 'syncWishlist');
  }
};

export const getMyWishlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const paginationParams = req.pagination ?? { page: 1, limit: 20, skip: 0, sort: '' };
    const result = await service.getMyWishlist(userId, paginationParams);

    ResponseUtil.paginated(
      res,
      'Wishlist retrieved successfully',
      result.venues,
      result.pagination,
      'venues'
    );
  } catch (err) {
    handleError(res, err, 'getMyWishlist');
  }
};

export const getWishlistStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const { venueIds } = req.query;
    const venueIdArray = Array.isArray(venueIds)
      ? (venueIds as string[])
      : typeof venueIds === 'string'
        ? venueIds.split(',')
        : [];

    // Cap at 100 IDs to prevent abuse
    if (venueIdArray.length > 100) {
      ResponseUtil.badRequest(res, 'Maximum 100 venue IDs allowed');
      return;
    }

    const status = await service.getWishlistStatus(userId, venueIdArray);
    ResponseUtil.success(res, 'Wishlist status retrieved', status);
  } catch (err) {
    handleError(res, err, 'getWishlistStatus');
  }
};
