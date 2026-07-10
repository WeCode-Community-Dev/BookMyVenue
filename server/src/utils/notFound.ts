import { Response, Request, NextFunction } from 'express';
import { AppError } from './AppError';
const notFound = (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new AppError('Route not Found', 404);
  } catch (error) {
    next(error);
  }
};
export default notFound;
