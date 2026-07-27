import { Request, Response, NextFunction } from 'express';

/**
 * Higher-order function that wraps asynchronous Express route handlers
 * and forwards uncaught promise rejections to the global error middleware.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
