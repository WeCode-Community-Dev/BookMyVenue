import React from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface TableFilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface TableFiltersProps {
  filters: TableFilterConfig[];
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  filterValues,
  onFilterChange,
}) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col">
          <label htmlFor={filter.key} className="text-xs font-semibold text-foreground mb-1.5 block">
            {filter.label}
          </label>
          <select
            id={filter.key}
            value={filterValues[filter.key] || ''}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="block w-full pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors cursor-pointer"
          >
            <option value="">All</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
