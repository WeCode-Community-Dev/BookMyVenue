// Raw query-string shape accepted by the pagination middleware.
// All fields are optional strings or numbers because Express gives everything as strings.
export interface PaginationQuery {
  page?: string | number;
  limit?: string | number;
  skip?: string | number;
  sort?: string;
}

// Normalised, validated pagination parameters attached to `req.pagination`
// after the pagination middleware runs.
export interface PaginationParams {
  // 1-based current page number.
  page: number;
  // Number of documents per page.
  limit: number;
  // Number of documents to skip — derived from page/limit or an explicit skip query param.
  skip: number;
  // Mongo-style sort string, e.g. `-createdAt` or `name,-updatedAt`.
  sort: string;
}

// Pagination metadata included in every paginated API response.
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  skip: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type PaginatedResponse<T, K extends string = 'items'> = Record<K, T[]> & {
  pagination: PaginationMeta;
};

export interface PaginationMiddlewareOptions {
  defaultLimit?: number;
  maxLimit?: number;
  minLimit?: number;
  defaultSort?: string;
}
