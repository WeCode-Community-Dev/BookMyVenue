import type { Request, Response } from 'express';
import { ResponseUtil } from '../../utils/responseUtils';
import * as service from './review.service';
import { handleError } from '../../utils/errors';
import type { UpdateReviewDTO, ModerateReviewDTO } from './review.types';

export const submitReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const venueId = Array.isArray(req.params.venueId) ? req.params.venueId[0] : req.params.venueId;
    const { rating, comment } = req.body as { rating?: number; comment?: string };

    const review = await service.submitReview(userId, venueId, { rating, comment });
    ResponseUtil.created(res, 'Review submitted successfully', review);
  } catch (err) {
    handleError(res, err, 'submitReview');
  }
};

export const upsertRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const venueId = Array.isArray(req.params.venueId) ? req.params.venueId[0] : req.params.venueId;
    const { rating } = req.body as { rating: number };

    const review = await service.upsertRating(userId, venueId, rating);
    ResponseUtil.success(res, 'Rating updated successfully', review);
  } catch (err) {
    handleError(res, err, 'upsertRating');
  }
};

export const getMyRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const venueId = Array.isArray(req.params.venueId) ? req.params.venueId[0] : req.params.venueId;
    const rating = await service.getMyRating(userId, venueId);
    ResponseUtil.success(res, 'Rating retrieved successfully', { rating });
  } catch (err) {
    handleError(res, err, 'getMyRating');
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const dto = req.body as UpdateReviewDTO;
    const userId = user.userId;
    const requesterRole = user.role.name;
    const review = await service.updateReview(userId, id, dto, requesterRole);
    ResponseUtil.success(res, 'Review updated successfully', review);
  } catch (err) {
    handleError(res, err, 'updateReview');
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user?.userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = user.userId;
    const requesterRole = user.role.name;
    await service.deleteReview(userId, id, requesterRole);
    ResponseUtil.success(res, 'Review deleted successfully');
  } catch (err) {
    handleError(res, err, 'deleteReview');
  }
};

export const getVenueReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = Array.isArray(req.params.venueId) ? req.params.venueId[0] : req.params.venueId;
    const paginationParams = req.pagination ?? { page: 1, limit: 10, skip: 0, sort: '' };
    const result = await service.getVenueReviews(venueId, paginationParams);
    ResponseUtil.paginated(
      res,
      'Reviews retrieved successfully',
      result.reviews,
      result.pagination,
      'reviews'
    );
  } catch (err) {
    handleError(res, err, 'getVenueReviews');
  }
};

export const getFlaggedReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const paginationParams = req.pagination ?? { page: 1, limit: 20, skip: 0, sort: '' };
    const result = await service.getFlaggedReviews(paginationParams);
    ResponseUtil.paginated(
      res,
      'Flagged reviews retrieved successfully',
      result.reviews,
      result.pagination,
      'reviews'
    );
  } catch (err) {
    handleError(res, err, 'getFlaggedReviews');
  }
};

export const moderateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const validated = req.validated;
    if (!validated) {
      ResponseUtil.badRequest(res, 'Validation failed');
      return;
    }
    const dto = validated.body as ModerateReviewDTO;
    const review = await service.moderateReview(id, dto, adminId);
    ResponseUtil.success(res, 'Review moderated successfully', review);
  } catch (err) {
    handleError(res, err, 'moderateReview');
  }
};

export const getOwnerVenueReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = Array.isArray(req.params.venueId) ? req.params.venueId[0] : req.params.venueId;
    const { page, limit, skip } = req.pagination ?? { page: 1, limit: 10, skip: 0, sort: '' };

    const result = await service.getOwnerVenueReviews(venueId, { page, limit, skip, sort: '' });
    ResponseUtil.paginated(
      res,
      'Venue reviews retrieved',
      result.reviews,
      result.pagination,
      'reviews'
    );
  } catch (err) {
    handleError(res, err, 'getOwnerVenueReviews');
  }
};

export const replyToReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = Array.isArray(req.params.venueId) ? req.params.venueId[0] : req.params.venueId;
    const reviewId = Array.isArray(req.params.reviewId)
      ? req.params.reviewId[0]
      : req.params.reviewId;
    const { text } = req.body as { text: string };

    const review = await service.replyToReview(venueId, reviewId, text);
    ResponseUtil.success(res, 'Reply added successfully', review);
  } catch (err) {
    handleError(res, err, 'replyToReview');
  }
};

export const reportReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const reviewId = Array.isArray(req.params.reviewId)
      ? req.params.reviewId[0]
      : req.params.reviewId;
    const { reason } = req.body as { reason: string };

    const review = await service.flagReview(reviewId, reason);
    ResponseUtil.success(res, 'Review flagged successfully', review);
  } catch (err) {
    handleError(res, err, 'reportReview');
  }
};
