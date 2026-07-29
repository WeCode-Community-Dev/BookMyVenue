import { HTTP_STATUS } from '@/constants/http';
import { ownerDashboardService, adminDashboardService } from '@/services/dashboard.service';
import success from '@/utils/response';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export async function ownerDashboardController(req: Request, res: Response, next: NextFunction) {
  try {
    const ownerId = req.user?.id;
    if (!ownerId || !mongoose.Types.ObjectId.isValid(ownerId)) {
      return next(new Error('Unauthorized access'));
    }

    const ownerDashboardData = await ownerDashboardService(ownerId);

    return success(res, HTTP_STATUS.OK, ownerDashboardData);
  } catch (error) {
    next(error);
  }
}

export async function adminDashboardController(req: Request, res: Response, next: NextFunction) {
  try {
    const adminDashboardData = await adminDashboardService();

    return success(res, HTTP_STATUS.OK, adminDashboardData);
  } catch (error) {
    next(error);
  }
}
