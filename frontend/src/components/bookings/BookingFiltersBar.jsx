import { Search } from "lucide-react";
import { BOOKING_FILTERS } from "../../utils/bookingFilters";

const BookingFiltersBar = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search by venue name",
  filters = BOOKING_FILTERS,
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={[
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-red-600 text-white shadow-sm shadow-red-600/20"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900",
            ].join(" ")}
            aria-pressed={isActive}
          >
            {filter.label}
          </button>
        );
      })}
    </div>

    <label className="relative block w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
        className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-red-300 focus:ring-2 focus:ring-red-100"
      />
    </label>
  </div>
);

export default BookingFiltersBar;
