import type { PaginationInfo } from "../../ui/Pagination";
import type { TableFilterConfig } from "../TableFilters";

export interface Column<T> {
    key: string;
    header: string;
    render: (item: T) => React.ReactNode;
    sortable?: boolean;
}

export interface TransactionTableProps<T> {
    data: T[];
    columns: Column<T>[];

    // State
    isLoading: boolean;
    isError: boolean;
    onRetry?: () => void;
    emptyMessage?: string;

    // Search
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;

    // Filters
    filters?: TableFilterConfig[];
    filterValues?: Record<string, string>;
    onFilterChange?: (key: string, value: string) => void;

    // Sort
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    onSortChange?: (key: string) => void;

    // Pagination
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
}