import { Request, Response, NextFunction } from 'express';
import AdminAuditLog from '@/models/adminAuditLog.model';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';

/**
 * GET /admin/audit-logs
 */
export const getAdminAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const targetType = req.query.targetType as string;
    const action = req.query.action as string;

    const filter: Record<string, any> = {};
    if (targetType) filter.targetType = targetType;
    if (action) filter.action = action;

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AdminAuditLog.find(filter)
        .populate('adminId', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AdminAuditLog.countDocuments(filter),
    ]);

    return success(
      res,
      HTTP_STATUS.OK,
      {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Admin audit logs fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};
