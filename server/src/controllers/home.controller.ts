import { Request, Response, NextFunction } from 'express';
import homeService from '@/services/home.service';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';

export const getHomeData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await homeService.getHomeData();

    return success(res, HTTP_STATUS.OK, data, 'Home data fetched successfully');
  } catch (error) {
    next(error);
  }
};
