import React from 'react';
import { Loader2 } from 'lucide-react';
import Pagination, { type PaginationInfo } from './Pagination';

export interface Column<T> {
  header: React.ReactNode;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  itemName?: string;
  emptyState?: React.ReactNode;
}

export default function Table<T>({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  itemName = 'item',
  emptyState,
}: TableProps<T>) {
  return (
    <div className="overflow-hidden bg-card shadow-sm rounded-2xl border border-border transition-colors duration-250">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Header */}
          <thead className="bg-background text-xs font-bold text-muted uppercase tracking-wider border-b border-border">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`p-4 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-xs font-semibold text-foreground/60">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-sm text-foreground/55">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center py-4">
                      <span className="font-semibold text-foreground/70">No {itemName}s found</span>
                      <span className="text-xs text-foreground/45 mt-0.5">Try adjusting your filters or query</span>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-border hover:bg-surface/50 transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`p-4 align-middle text-sm font-medium text-foreground/80 ${col.className || ''}`}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component integration */}
      {pagination && onPageChange && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          itemName={itemName}
        />
      )}
    </div>
  );
}
