import {
  Briefcase,
  Cake,
  Camera,
  ChevronDown,
  Heart,
  LayoutGrid,
  MoreHorizontal,
  PartyPopper,
  Users,
} from "lucide-react";
import {
  VENUE_CATEGORIES,
  SORT_OPTIONS,
} from "../../utils/venueFilters";

const CATEGORY_ICONS = {
  all: LayoutGrid,
  wedding: Heart,
  corporate: Briefcase,
  birthday: Cake,
  party: PartyPopper,
  function: Users,
  photoshoot: Camera,
  other: MoreHorizontal,
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
  const handleChange = (name) => (event) => {
    onFilterChange(name, event.target.value);
  };

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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
            <div className="w-full sm:w-40">
              <label
                htmlFor="filter-min-capacity"
                className="mb-1.5 block text-xs font-medium text-gray-500"
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

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearFilters}
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
      </div>
    </section>
  );
};

export default VenueFilters;
