import type { z } from 'zod';
import type { Request, Response } from 'express';
import { ResponseUtil } from '../../utils/responseUtils';
import { handleError } from '../../utils/errors';
import type {
  blockDatesSchema,
  unblockDatesSchema,
  offlineBookingSchema,
  ownerReplySchema,
  reportReviewSchema,
  inactivityRequestSchema,
  deleteRequestSchema,
} from './owner.validator';
import * as service from './owner.service';
import * as workflow from './owner.workflow';
import * as reviewService from '../review/review.service';
import { getVenueActivityLogs } from '../moderation/moderationActivity.service';

// GET /api/v1/owner/analytics/:venueId
export const getVenueAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;
    const result = await service.getVenueAnalyticsService(venueId);
    ResponseUtil.success(res, 'Analytics retrieved successfully', result);
  } catch (e) {
    handleError(res, e, 'getVenueAnalytics');
  }
};

// GET /api/v1/owner/venue/:venueId/bookings
export const getVenueBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;
    const { page, limit } = req.pagination ?? { page: 1, limit: 10, skip: 0, sort: '' };

    const result = await service.getVenueBookingsService(venueId, page, limit);

    ResponseUtil.success(res, 'Venue bookings retrieved', result);
  } catch (e) {
    handleError(res, e, 'getVenueBookings');
  }
};

// POST /api/v1/owner/bookings/offline
export const createOfflineBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      ResponseUtil.unauthorized(res, 'User not authenticated');
      return;
    }
    const dto = req.validated?.body as z.infer<typeof offlineBookingSchema>;

    const result = await service.createOfflineBookingService(req.user.userId, dto);

    ResponseUtil.created(res, 'Offline booking created', result);
  } catch (e) {
    handleError(res, e, 'createOfflineBooking');
  }
};

// GET /api/v1/owner/venue/:venueId/availability-calendar
export const getVenueAvailabilityCalendar = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;

    const result = await workflow.getVenueAvailabilityCalendarWorkflow(venueId);
    if (!result) {
      ResponseUtil.notFound(res, 'Venue not found');
      return;
    }

    ResponseUtil.success(res, 'Availability calendar retrieved', result);
  } catch (e) {
    handleError(res, e, 'getVenueAvailabilityCalendar');
  }
};

// POST /api/v1/owner/:venueId/block-dates
export const blockDates = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;
    const { dates } = req.validated?.body as z.infer<typeof blockDatesSchema>;

    const blockedDates = await service.blockDatesService(venueId, dates);

    ResponseUtil.success(res, 'Dates blocked successfully', blockedDates);
  } catch (e) {
    handleError(res, e, 'blockDates');
  }
};

// POST /api/v1/owner/:venueId/unblock-dates
export const unblockDates = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;
    const { dates } = req.validated?.body as z.infer<typeof unblockDatesSchema>;

    const blockedDates = await service.unblockDatesService(venueId, dates);

    ResponseUtil.success(res, 'Dates unblocked successfully', blockedDates);
  } catch (e) {
    handleError(res, e, 'unblockDates');
  }
};

// GET /api/v1/owner/venue/:venueId/reviews
export const getVenueReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;
    const { page, limit, skip } = req.pagination ?? { page: 1, limit: 10, skip: 0, sort: '' };

    const result = await reviewService.getOwnerVenueReviews(venueId, {
      page,
      limit,
      skip,
      sort: '',
    });
    ResponseUtil.paginated(
      res,
      'Venue reviews retrieved',
      result.reviews,
      result.pagination,
      'reviews'
    );
  } catch (e) {
    handleError(res, e, 'getVenueReviews');
  }
};

// POST /api/v1/owner/venue/:venueId/reviews/:reviewId/reply
export const replyToReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;
    const reviewId = req.params.reviewId as string;
    const { text } = req.validated?.body as z.infer<typeof ownerReplySchema>;

    const review = await reviewService.replyToReview(venueId, reviewId, text);
    ResponseUtil.success(res, 'Reply added successfully', review);
  } catch (e) {
    handleError(res, e, 'replyToReview');
  }
};

// POST /api/v1/owner/venue/:venueId/reviews/:reviewId/report
export const reportReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      ResponseUtil.unauthorized(res, 'Unauthorized');
      return;
    }

    const venueId = req.params.venueId as string;
    const reviewId = req.params.reviewId as string;
    const { reason, action } = req.validated?.body as z.infer<typeof reportReviewSchema>;

    let review;
    if (action === 'hide') {
      review = await reviewService.requestHideForReview(venueId, reviewId, userId, reason);
    } else {
      review = await reviewService.flagReview(reviewId, reason);
    }
    ResponseUtil.success(res, 'Report submitted successfully', review);
  } catch (e) {
    handleError(res, e, 'reportReview');
  }
};

// GET /api/v1/owner/venue/:venueId/settings
export const getVenueSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;
    const result = await service.getVenueSettingsService(venueId);
    ResponseUtil.success(res, 'Venue settings retrieved successfully', result);
  } catch (e) {
    handleError(res, e, 'getVenueSettings');
  }
};

// POST /api/v1/owner/venue/:venueId/request-inactivity
export const requestInactivity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      ResponseUtil.unauthorized(res, 'User not authenticated');
      return;
    }
    const venueId = req.params.venueId as string;
    const { reason } = req.validated?.body as z.infer<typeof inactivityRequestSchema>;
    const result = await service.requestInactivityService(venueId, req.user.userId, reason);
    ResponseUtil.success(res, 'Inactivity request submitted', result);
  } catch (e) {
    handleError(res, e, 'requestInactivity');
  }
};

// DELETE /api/v1/owner/venue/:venueId/request-inactivity
export const withdrawInactivity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      ResponseUtil.unauthorized(res, 'User not authenticated');
      return;
    }
    const venueId = req.params.venueId as string;
    const result = await service.withdrawInactivityService(venueId, req.user.userId);
    ResponseUtil.success(res, 'Inactivity request withdrawn', result);
  } catch (e) {
    handleError(res, e, 'withdrawInactivity');
  }
};

// POST /api/v1/owner/venue/:venueId/block-bookings
export const blockBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      ResponseUtil.unauthorized(res, 'User not authenticated');
      return;
    }
    const venueId = req.params.venueId as string;
    const result = await service.blockBookingsService(venueId, req.user.userId);
    ResponseUtil.success(res, 'Bookings blocked successfully', result);
  } catch (e) {
    handleError(res, e, 'blockBookings');
  }
};

// DELETE /api/v1/owner/venue/:venueId/block-bookings
export const unblockBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      ResponseUtil.unauthorized(res, 'User not authenticated');
      return;
    }
    const venueId = req.params.venueId as string;
    const result = await service.unblockBookingsService(venueId, req.user.userId);
    ResponseUtil.success(res, 'Booking block removed successfully', result);
  } catch (e) {
    handleError(res, e, 'unblockBookings');
  }
};

// POST /api/v1/owner/venue/:venueId/activate
export const activateVenue = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      ResponseUtil.unauthorized(res, 'User not authenticated');
      return;
    }
    const venueId = req.params.venueId as string;
    const result = await service.activateVenueService(venueId, req.user.userId);
    ResponseUtil.success(res, 'Venue reactivated successfully', result);
  } catch (e) {
    handleError(res, e, 'activateVenue');
  }
};

// PATCH /api/v1/owner/bookings/:bookingId/mark-paid
export const markBookingAsPaid = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.bookingId as string;
    await service.markBookingAsPaidService(bookingId);
    ResponseUtil.success(res, 'Booking marked as paid');
  } catch (e) {
    handleError(res, e, 'markBookingAsPaid');
  }
};

// PATCH /api/v1/owner/bookings/:bookingId/cancel-pending
export const cancelPendingOfflineBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.bookingId as string;
    await service.cancelPendingOfflineBookingService(bookingId);
    ResponseUtil.success(res, 'Pending offline booking cancelled');
  } catch (e) {
    handleError(res, e, 'cancelPendingOfflineBooking');
  }
};

// POST /api/v1/owner/venue/:venueId/delete-request
export const requestDeleteVenue = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      ResponseUtil.unauthorized(res, 'User not authenticated');
      return;
    }
    const venueId = req.params.venueId as string;
    const { reason } = req.validated?.body as z.infer<typeof deleteRequestSchema>;
    const result = await service.requestDeleteVenueService(venueId, req.user.userId, reason);
    ResponseUtil.success(res, 'Deletion request submitted', result);
  } catch (e) {
    handleError(res, e, 'requestDeleteVenue');
  }
};

// GET /api/v1/owner/venue/:venueId/activity
export const getVenueActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const venueId = req.params.venueId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const { logs, total } = await getVenueActivityLogs(venueId, page, limit);
    ResponseUtil.success(res, 'Venue activity retrieved', {
      logs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    handleError(res, e, 'getVenueActivity');
  }
};
