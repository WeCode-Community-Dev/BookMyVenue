import { TableSearch } from './TableSearch';
import { TableFilters } from './TableFilters';
import { TableLoadingState, TableEmptyState, TableErrorState } from './TableStates';
import Pagination from '../ui/Pagination';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { TransactionTableProps } from './interfaces/table.interfaces';

export function TransactionTable<T>({
  data,
  columns,
  isLoading,
  isError,
  onRetry,
  emptyMessage,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  filterValues = {},
  onFilterChange,
  sortKey,
  sortDirection,
  onSortChange,
  pagination,
  onPageChange,
}: TransactionTableProps<T>) {
  return (
    <div className="flex flex-col space-y-4">
      {/* Header controls: Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-surface p-4 rounded-xl shadow-sm border border-border">
        <div className="w-full md:w-1/3">
          <label className="text-xs font-semibold text-foreground mb-1.5 block">
            Search
          </label>
          <TableSearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>

        {filters.length > 0 && onFilterChange && (
          <div className="w-full md:w-auto">
            <TableFilters
              filters={filters}
              filterValues={filterValues}
              onFilterChange={onFilterChange}
            />
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-muted/20 transition-colors' : ''
                      }`}
                    onClick={() => col.sortable && onSortChange && onSortChange(col.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.header}</span>
                      {col.sortable && sortKey === col.key && (
                        sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length}>
                    <TableLoadingState />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length}>
                    <TableErrorState onRetry={onRetry} />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <TableEmptyState message={emptyMessage} />
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-muted/10 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && data.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={onPageChange}
          itemName="transaction"
        />
      )}
    </div>
  );
}
