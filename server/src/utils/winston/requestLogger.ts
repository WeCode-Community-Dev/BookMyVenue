import type { NextFunction, Request, Response } from 'express';
import { logHttp } from './logger';

/**
 * Express middleware that logs every completed HTTP request at the 'http' level.
 * Attaches to res 'finish' so duration includes controller processing time.
 * Register in server.ts before the main router.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logHttp(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${String(duration)}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
};
