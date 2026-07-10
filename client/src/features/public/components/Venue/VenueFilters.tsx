import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import type { Category } from '@/features/categories/types';
import type { PublicVenueQuery } from '../../services/public-venues.api';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'capacity_asc', label: 'Capacity: Low to High' },
  { value: 'capacity_desc', label: 'Capacity: High to Low' },
];

interface VenueFiltersProps {
  categories: Category[];
  showFilters: boolean;
  onToggleFilters: () => void;

  sortBy: PublicVenueQuery['sort'];
  onSortChange: (sort: PublicVenueQuery['sort']) => void;

  categoryFilter: string;
  onCategoryChange: (categoryId: string) => void;

  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;

  minCapacity: string;
  maxCapacity: string;
  onMinCapacityChange: (value: string) => void;
  onMaxCapacityChange: (value: string) => void;

  activeFilterCount: number;
  onClearAll: () => void;

  errors?: {
    minPrice?: string;
    maxPrice?: string;
    minCapacity?: string;
    maxCapacity?: string;
  };
}

export default function VenueFilters({
  categories,
  showFilters,
  onToggleFilters,
  sortBy,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minCapacity,
  maxCapacity,
  onMinCapacityChange,
  onMaxCapacityChange,
  activeFilterCount,
  onClearAll,
  errors = {},
}: VenueFiltersProps) {
  return (
    <>
      {/* Filter Toggle + Sort Row */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFilters}
          className={`
            inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition-all cursor-pointer
            ${
              showFilters || activeFilterCount > 0
                ? 'border-primary/30 bg-primary/5 text-primary'
                : 'border-border bg-background text-foreground hover:bg-surface'
            }
          `}
        >
          <SlidersHorizontal size={14} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
          />
        </button>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as PublicVenueQuery['sort'])}
          className="appearance-none rounded-xl border border-border bg-background px-4 py-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer transition-all"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Expandable Filters Panel */}
      {showFilters && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Filter Venues</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-error hover:text-error/80 transition-colors cursor-pointer"
              >
                <X size={12} /> Clear All
              </button>
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer transition-all"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                Price Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => onMinPriceChange(e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <span className="text-xs text-muted font-medium">to</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              {errors.minPrice && <p className="text-xs text-red-500 mt-1">{errors.minPrice}</p>}
              {errors.maxPrice && <p className="text-xs text-red-500 mt-1">{errors.maxPrice}</p>}
            </div>

            {/* Capacity Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                Capacity (Guests)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minCapacity}
                  onChange={(e) => onMinCapacityChange(e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <span className="text-xs text-muted font-medium">to</span>
                <input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => onMaxCapacityChange(e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              {errors.minCapacity && (
                <p className="text-xs text-red-500 mt-1">{errors.minCapacity}</p>
              )}
              {errors.maxCapacity && (
                <p className="text-xs text-red-500 mt-1">{errors.maxCapacity}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
