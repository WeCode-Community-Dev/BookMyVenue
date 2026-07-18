import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";

function SearchBar({
  searchText,
  setSearchText,
  city,
  setCity,
  categoryId,
  setCategoryId,
  availabilityType,
  setAvailabilityType,
  categories,
  onSearch,
}) {
  const handleClear = () => {
    setSearchText("");
    setCity("");
    setCategoryId("");
    setAvailabilityType("");
  };

  const hasActiveFilters = searchText || city || categoryId || availabilityType;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Search input row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* Search text */}
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Search venues
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Venue name or keyword…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {/* City */}
        <div className="w-full sm:w-48">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            City
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Any city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {/* Category */}
        <div className="w-full sm:w-48">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <button
          onClick={onSearch}
          className="flex h-10 items-center gap-2 rounded-lg bg-red-600 px-6 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {/* Active filters bar */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          <span className="text-xs font-medium text-gray-500">Filters:</span>
          {searchText && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
              {searchText}
            </span>
          )}
          {city && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <MapPin className="h-3 w-3" />
              {city}
            </span>
          )}
          {categoryId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              {categories.find((c) => c.id === categoryId)?.name || "Selected"}
            </span>
          )}
          {availabilityType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              {availabilityType}
            </span>
          )}
          <button
            onClick={handleClear}
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchBar;