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
