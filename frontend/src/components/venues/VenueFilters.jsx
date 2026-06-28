import { useState } from "react";
import {
  Briefcase,
  Cake,
  Camera,
  ChevronDown,
  Clapperboard,
  Flower2,
  Gem,
  Heart,
  LayoutGrid,
  PartyPopper,
  Presentation,
  SlidersHorizontal,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import {
  VENUE_CATEGORIES,
  SORT_OPTIONS,
} from "../../utils/venueFilters";

const CATEGORY_ICONS = {
  all: LayoutGrid,
  wedding: Heart,
  engagement: Gem,
  reception: UtensilsCrossed,
  corporate: Briefcase,
  conference: Presentation,
  meeting: Users,
  birthday: Cake,
  party: PartyPopper,
  photoshoot: Camera,
  film: Clapperboard,
  yoga: Flower2,
};

const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 transition-colors focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100 sm:py-2.5";

const VenueFilters = ({
  filters,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
  disabled = false,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const handleChange = (name) => (event) => {
    onFilterChange(name, event.target.value);
  };

  const advancedCount =
    activeFilterCount -
    (filters.search.trim() ? 1 : 0) -
    (filters.category !== "all" ? 1 : 0) -
    (filters.city !== "all" ? 1 : 0);

  return (
    <section className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-red-600 sm:text-sm">
          Browse by Venue Categories
        </h2>

        <div
          className="-mx-1 mt-4 flex gap-4 overflow-x-auto px-1 pb-1 sm:mt-5 sm:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Venue categories"
        >
          {VENUE_CATEGORIES.map(({ value, label }) => {
            const Icon = CATEGORY_ICONS[value] ?? LayoutGrid;
            const isActive = filters.category === value;

            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={disabled}
                onClick={() => onFilterChange("category", value)}
                className="group flex w-[4.25rem] shrink-0 flex-col items-center gap-2 sm:w-[5rem]"
              >
                <span
                  className={[
                    "flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white shadow-sm transition-all duration-200 sm:h-[4.5rem] sm:w-[4.5rem]",
                    isActive
                      ? "border-red-500 shadow-md shadow-red-600/10"
                      : "border-gray-100 group-hover:border-red-200",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-6 w-6 transition-colors sm:h-7 sm:w-7",
                      isActive
                        ? "text-red-600"
                        : "text-gray-500 group-hover:text-red-500",
                    ].join(" ")}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>

                <span
                  className={[
                    "max-w-full truncate text-center text-[9px] font-bold uppercase leading-tight tracking-wide sm:text-[10px]",
                    isActive ? "text-gray-900" : "text-gray-600",
                  ].join(" ")}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 border-t border-gray-100 pt-5 sm:space-y-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              className={[
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors sm:min-h-0 sm:rounded-full sm:px-4 sm:py-2",
                moreOpen
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:text-red-600",
              ].join(" ")}
              aria-expanded={moreOpen}
            >
              <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">More filters</span>
              {advancedCount > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                  {advancedCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClearFilters();
                  setMoreOpen(false);
                }}
                disabled={disabled}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-600 transition-colors hover:border-red-200 hover:text-red-600 disabled:opacity-40 sm:min-h-0 sm:rounded-full sm:border-transparent sm:bg-transparent sm:px-4 sm:py-2"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto sm:min-w-[11rem]">
            <label
              htmlFor="venue-sort"
              className="mb-1.5 block text-xs font-medium text-gray-500 sm:sr-only"
            >
              Sort by
            </label>

            <div className="relative">
              <select
                id="venue-sort"
                value={filters.sort}
                onChange={handleChange("sort")}
                disabled={disabled}
                aria-label="Sort venues"
                className={`${fieldClass} appearance-none pr-9`}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {moreOpen && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Refine results
                </h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Narrow by venue type, pricing unit, or capacity.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="filter-venue-type"
                  className="mb-1.5 block text-xs font-medium text-gray-600"
                >
                  Venue type
                </label>
                <select
                  id="filter-venue-type"
                  value={filters.venueType}
                  onChange={handleChange("venueType")}
                  disabled={disabled}
                  className={fieldClass}
                >
                  <option value="all">All types</option>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-pricing-unit"
                  className="mb-1.5 block text-xs font-medium text-gray-600"
                >
                  Pricing unit
                </label>
                <select
                  id="filter-pricing-unit"
                  value={filters.pricingUnit}
                  onChange={handleChange("pricingUnit")}
                  disabled={disabled}
                  className={fieldClass}
                >
                  <option value="all">All units</option>
                  <option value="perhour">Per hour</option>
                  <option value="perday">Per day</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="filter-min-capacity"
                  className="mb-1.5 block text-xs font-medium text-gray-600"
                >
                  Min capacity
                </label>
                <input
                  id="filter-min-capacity"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={filters.minCapacity}
                  onChange={handleChange("minCapacity")}
                  disabled={disabled}
                  placeholder="e.g. 100"
                  className={fieldClass}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="mt-5 flex w-full min-h-11 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700 sm:hidden"
            >
              Apply filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VenueFilters;
