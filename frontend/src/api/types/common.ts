export interface Pagination<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PaginationFilter {
    search?: string,
    limit: number,
    page: number
}