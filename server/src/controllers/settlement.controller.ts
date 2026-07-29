import { Request, Response, NextFunction } from 'express';
import * as settlementService from '@/services/settlement.service';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';
import success from '@/utils/response';

// ── Admin Endpoints ─────────────────────────────────────────

// GET /admin/settlements
export const getPendingSettlements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await settlementService.getPendingSettlements(page, limit);
    success(res, HTTP_STATUS.OK, result, 'Pending settlements fetched');
  } catch (error) {
    next(error);
  }
};

// POST /admin/settlements/:bookingId/release
export const releaseSettlement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.bookingId as string;
    if (!bookingId) {
      throw new AppError('Booking ID is required', HTTP_STATUS.BAD_REQUEST);
    }
    const settlement = await settlementService.processSettlement(bookingId, 'ADMIN');
    success(res, HTTP_STATUS.OK, settlement, 'Settlement released successfully');
  } catch (error) {
    next(error);
  }
};

// ── Owner Endpoints ─────────────────────────────────────────

// GET /owners/settlements
export const getOwnerSettlements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await settlementService.getOwnerSettlements(ownerId, page, limit);
    success(res, HTTP_STATUS.OK, result, 'Owner settlements fetched');
  } catch (error) {
    next(error);
  }
};

// GET /owners/settlements/stats
export const getOwnerRevenueStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.user?.id;
    if (!ownerId) throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);

    const stats = await settlementService.getOwnerRevenueStats(ownerId);
    success(res, HTTP_STATUS.OK, stats, 'Owner revenue stats fetched');
  } catch (error) {
    next(error);
  }
};
