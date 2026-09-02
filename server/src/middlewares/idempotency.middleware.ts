import type { NextFunction, Request, Response } from 'express';
import { IdempotencyKeyModel } from '../models/idempotency-key.model';
import { logWarn } from '../utils/logger';

export function idempotencyMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = req.headers['idempotency-key'] as string;
    if (!key) {
      next();
      return;
    }

    try {
      const existing = await IdempotencyKeyModel.findOne({ key }).lean().exec();
      if (existing) {
        logWarn('Idempotency key replay', { key, path: req.path });
        res.status(existing.response.status).json(existing.response.body);
        return;
      }

      const originalJson = res.json.bind(res);
      res.json = async function (body: unknown): Promise<Response> {
        if (res.statusCode < 500) {
          try {
            await IdempotencyKeyModel.create({
              key,
              response: { status: res.statusCode, body },
              createdAt: new Date(),
            });
          } catch (err: unknown) {
            logWarn('Failed to cache idempotency key', { key, error: err });
          }
        }
        return originalJson(body);
      } as unknown as typeof res.json;

      next();
    } catch (err) {
      logWarn('Idempotency middleware error', { key, error: err });
      next();
    }
  };
}
