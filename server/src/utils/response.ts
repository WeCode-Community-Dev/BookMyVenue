import { Response } from 'express';

const success = <T>(res: Response, statusCode = 200, data: T, message?: string) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export default success;
