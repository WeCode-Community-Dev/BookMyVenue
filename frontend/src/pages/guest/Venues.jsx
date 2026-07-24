import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllVenues } from "../../services/venueService";
import SearchBar from "../../components/venues/SearchBar";
import VenueFilters from "../../components/venues/VenueFilters";
import VenueGrid from "../../components/venues/VenueGrid";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import { DEFAULT_VENUE_FILTERS, countActiveFilters, extractCities, filterAndSortVenues, } from "../../utils/venueFilters";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(DEFAULT_VENUE_FILTERS);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllVenues();

      if (data.success) {
        setVenues(data.data ?? []);
      } else {
        setVenues([]);
        setError(data.message || "Failed to load venues.");
      }
    } catch (err) {
      setVenues([]);
      setError(
        err.response?.data?.message ||
        "Unable to load venues. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const cities = useMemo(() => extractCities(venues), [venues]);

  const filteredVenues = useMemo(
    () => filterAndSortVenues(venues, filters),
    [venues, filters]
  );

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters),
    [filters]
  );

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_VENUE_FILTERS);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50/30 via-white to-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-red-600/90">
            Find your space
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Your Event, Our Venue - Perfectly Matched
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Search by city and venue name, then browse by category.
          </p>
        </header>

        <div className="mx-auto mt-6 max-w-2xl sm:mt-8">
          <SearchBar
            search={filters.search}
            city={filters.city}
            cities={cities}
            onSearchChange={(value) => handleFilterChange("search", value)}
            onCityChange={(value) => handleFilterChange("city", value)}
            disabled={loading}
          />
        </div>

        <div className="mt-8 sm:mt-10">
          <VenueFilters
            filters={filters}
            activeFilterCount={activeFilterCount}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            disabled={loading}
          />
        </div>

        <div className="mt-8 sm:mt-10">
          {loading && <Loader label="Loading venues..." />}

          {!loading && error && (
            <ErrorState message={error} onRetry={fetchVenues} />
          )}

          {!loading && !error && venues.length === 0 && (
            <EmptyState
              title="No venues available"
              description="Check back soon — new venues are added regularly."
            />
          )}

          {!loading && !error && venues.length > 0 && (
            <VenueGrid
              venues={filteredVenues}
              totalCount={venues.length}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Venues;
