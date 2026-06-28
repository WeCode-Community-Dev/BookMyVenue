import { ChevronDown, MapPin, Search } from "lucide-react";

const SearchBar = ({
  search,
  city,
  cities,
  onSearchChange,
  onCityChange,
  disabled = false,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100/80">
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,11rem)_1fr] lg:grid-cols-[minmax(0,13rem)_1fr]">
        <div className="border-b border-gray-100 sm:border-b-0 sm:border-r">
          <label className="block px-4 pt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400 sm:sr-only">
            City
          </label>

          <div className="flex items-center gap-2 px-4 pb-3.5 pt-1 sm:py-3.5 sm:pl-4 sm:pr-3">
            <MapPin
              className="h-4 w-4 shrink-0 text-red-500 sm:h-5 sm:w-5"
              aria-hidden="true"
            />

            <div className="relative min-w-0 flex-1">
              <select
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                disabled={disabled}
                aria-label="Filter by city"
                className="w-full cursor-pointer appearance-none truncate border-0 bg-transparent pr-7 text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="all">All Cities</option>
                {cities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block px-4 pt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400 sm:sr-only">
            Search
          </label>

          <div className="flex items-center gap-2.5 px-4 pb-3.5 pt-1 sm:gap-3 sm:py-3.5 sm:pl-4 sm:pr-4">
            <Search
              className="h-4 w-4 shrink-0 text-gray-400 sm:h-5 sm:w-5"
              aria-hidden="true"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={disabled}
              placeholder="Search for venue, events"
              aria-label="Search venues by title"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
