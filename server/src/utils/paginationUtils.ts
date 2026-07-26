import type { PaginationMeta, PaginationParams, PaginationQuery } from '../types/pagination.types';
import type { PaginationMiddlewareOptions } from '../types/pagination.types';

// Defaults

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 200,
  MIN_LIMIT: 1,
  SORT: '-createdAt',
} as const;

// parsePaginationParams
/**
 * Parses and validates raw query-string pagination fields into a normalised
 * {@link PaginationParams} object.
 *
 * Rules:
 * - `page` must be a positive integer; falls back to 1.
 * - `limit` is clamped between `minLimit` and `maxLimit`.
 * - `skip` can be supplied directly (useful for cursor-style clients); when
 *   absent it is derived from `(page - 1) * limit`.
 * - `sort` defaults to `-createdAt` when not provided.
 */
export function parsePaginationParams(
  query: PaginationQuery,
  options?: PaginationMiddlewareOptions
): PaginationParams {
  const defaultLimit = options?.defaultLimit ?? PAGINATION_DEFAULTS.LIMIT;
  const maxLimit = options?.maxLimit ?? PAGINATION_DEFAULTS.MAX_LIMIT;
  const minLimit = options?.minLimit ?? PAGINATION_DEFAULTS.MIN_LIMIT;
  const defaultSort = options?.defaultSort ?? PAGINATION_DEFAULTS.SORT;

  // --- page ---
  let page: number = PAGINATION_DEFAULTS.PAGE;
  if (query.page !== undefined) {
    const parsed = typeof query.page === 'string' ? parseInt(query.page, 10) : query.page;
    if (!isNaN(parsed) && parsed > 0) page = parsed;
  }

  // --- limit ---
  let limit = defaultLimit;
  if (query.limit !== undefined) {
    const parsed = typeof query.limit === 'string' ? parseInt(query.limit, 10) : query.limit;
    if (!isNaN(parsed) && parsed >= minLimit) limit = Math.min(parsed, maxLimit);
  }

  // --- skip ---
  let skip: number;
  if (query.skip !== undefined) {
    const parsed = typeof query.skip === 'string' ? parseInt(query.skip, 10) : query.skip;
    skip = !isNaN(parsed) && parsed >= 0 ? parsed : (page - 1) * limit;
  } else {
    skip = (page - 1) * limit;
  }

  // --- sort ---
  const sort =
    typeof query.sort === 'string' && query.sort.trim() ? query.sort.trim() : defaultSort;

  return { page, limit, skip, sort };
}

// buildPaginationMeta

/**
 * Builds the {@link PaginationMeta} object to include in paginated API
 * responses.
 *
 * @param total  - Total document count returned by `Model.countDocuments()`.
 * @param params - The same {@link PaginationParams} used for the query.
 */
export function buildPaginationMeta(total: number, params: PaginationParams): PaginationMeta {
  const { limit, skip } = params;
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
  const currentPage = limit > 0 ? Math.floor(skip / limit) + 1 : 1;

  return {
    total,
    page: currentPage,
    limit,
    skip,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// parseSortString
/**
 * Converts a sort string into a Mongoose-compatible sort object.
 *
 * Format: comma-separated field names, prefixed with `-` for descending.
 *
 * Examples:
 * ```
 * "-createdAt"          → { createdAt: -1, _id: -1 }
 * "name"                → { name: 1, _id: 1 }
 * "-createdAt,name"     → { createdAt: -1, name: 1, _id: -1 }
 * ```
 *
 * `_id` is always appended as a tiebreaker (matching the direction of the
 * first sort field) to guarantee stable pagination across pages.
 */
export function parseSortString(sortString: string): Record<string, 1 | -1> {
  const sortObj: Record<string, 1 | -1> = {};

  if (!sortString.trim()) return sortObj;

  let primaryDirection: 1 | -1 = -1;

  for (const rawField of sortString.split(',')) {
    const field = rawField.trim();
    if (!field) continue;

    if (field.startsWith('-')) {
      const name = field.slice(1);
      sortObj[name] = -1;
      if (Object.keys(sortObj).length === 1) primaryDirection = -1;
    } else {
      sortObj[field] = 1;
      if (Object.keys(sortObj).length === 1) primaryDirection = 1;
    }
  }

  // Stable tiebreaker — only add if not already in the sort object
  if (!('_id' in sortObj)) {
    sortObj._id = primaryDirection;
  }

  return sortObj;
}
