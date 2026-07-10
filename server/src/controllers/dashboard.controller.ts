import { HTTP_STATUS } from '@/constants/http';
import { ownerDashboardService, adminDashboardService } from '@/services/dashboard.service';
import success from '@/utils/response';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export async function ownerDashboardController(req: Request, res: Response, next: NextFunction) {
  try {
    let ownerId = req.user?.id ?? 'userId';
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      ownerId = new mongoose.Types.ObjectId().toString();
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
