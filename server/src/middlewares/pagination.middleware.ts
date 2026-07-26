import type { Request, Response, NextFunction } from 'express';
import type { PaginationMiddlewareOptions } from '../types/pagination.types';
import { parsePaginationParams } from '../utils/paginationUtils';

/**
 * Factory that returns an Express middleware which:
 * 1. Reads `page`, `limit`, `skip`, and `sort` from `req.query`.
 * 2. Normalises and validates them via {@link parsePaginationParams}.
 * 3. Attaches the result to `req.pagination`.
 *
 * Downstream controllers can then access `req.pagination` directly — it is
 * always defined on routes that use this middleware.
 *
 * @example Basic usage (project defaults)
 * ```ts
 * router.get('/venues', paginationMiddleware(), controller.listVenues);
 * ```
 *
 * @example Custom limits
 * ```ts
 * router.get('/venues', paginationMiddleware({ defaultLimit: 10, maxLimit: 50 }), controller.listVenues);
 * ```
 *
 * @example Sort by a different field by default
 * ```ts
 * router.get('/venues', paginationMiddleware({ defaultSort: '-updatedAt' }), controller.listVenues);
 * ```
 */
export function paginationMiddleware(options?: PaginationMiddlewareOptions) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.pagination = parsePaginationParams(
      {
        page: req.query.page as string | undefined,
        limit: req.query.limit as string | undefined,
        skip: req.query.skip as string | undefined,
        sort: req.query.sort as string | undefined,
      },
      options
    );

    next();
  };
}

/**
 * Ready-to-use pagination middleware with the project's default settings.
 * Equivalent to `paginationMiddleware()` with no arguments.
 *
 * Defaults: limit=20, maxLimit=200, sort=`-createdAt`
 */
export const defaultPaginationMiddleware = paginationMiddleware();
