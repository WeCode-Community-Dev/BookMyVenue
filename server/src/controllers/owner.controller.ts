import { Request, Response, NextFunction } from 'express';
import { ownerService } from '../services/owner.service';

interface OwnerParams {
  id: string;
}

export const approveOwner = async (
  req: Request<OwnerParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = await ownerService.approveOwner(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Owner approved successfully',
      data: owner,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectOwner = async (req: Request<OwnerParams>, res: Response, next: NextFunction) => {
  try {
    const { reason } = req.body;

    const owner = await ownerService.rejectOwner(req.params.id, reason);

    res.status(200).json({
      success: true,
      message: 'Owner rejected successfully',
      data: owner,
    });
  } catch (error) {
    next(error);
  }
};

import { logAdminAction } from '@/utils/auditLogger';

export const freezeOwnerPayout = async (req: Request<OwnerParams>, res: Response, next: NextFunction) => {
  try {
    const { isPayoutFrozen } = req.body;
    const adminId = req.user?.id;
    const owner = await ownerService.toggleOwnerPayoutFreeze(req.params.id, Boolean(isPayoutFrozen));

    if (adminId) {
      await logAdminAction(
        adminId,
        isPayoutFrozen ? 'FREEZE_OWNER_PAYOUT' : 'UNFREEZE_OWNER_PAYOUT',
        'OWNER',
        req.params.id,
        req.body.reason || 'Admin status change'
      );
    }

    res.status(200).json({
      success: true,
      message: `Owner payout ${isPayoutFrozen ? 'frozen' : 'unfrozen'} successfully`,
      data: owner,
    });
  } catch (error) {
    next(error);
  }
};

export const resubmitOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const owner = await ownerService.resubmitOwner(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Owner application re-submitted successfully and is pending review',
      data: owner,
    });
  } catch (error) {
    next(error);
  }
};
