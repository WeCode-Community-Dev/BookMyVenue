import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { getNearbyVenues, getVenues, getTownSuggestions } from "../services/venueService";
import { usePageTitle } from "../hooks/usePageTitle";

function VenuePage() {
  usePageTitle("Explore Venues")
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    district: "",
    town: "",
    category: "",
    eventDate: "",
    minCapacity: "",
    maxPrice: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [townSuggestions, setTownSuggestions] = useState([]);
  const [showTownSuggestions, setShowTownSuggestions] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTownSuggestions = async () => {
      const keyword = filters.town.trim();

      if (keyword.length < 1) {
        setTownSuggestions([]);
        setShowTownSuggestions(false);
        return;
      }

      try {
        const result = await getTownSuggestions({
          district: filters.district,
          keyword,
        });

        if (isMounted) {
          setTownSuggestions(result.data || []);
          setShowTownSuggestions((result.data || []).length > 0);
        }
      } catch {
        if (isMounted) {
          setTownSuggestions([]);
          setShowTownSuggestions(false);
        }
      }
    };

    loadTownSuggestions();

    return () => {
      isMounted = false;
    };
  }, [filters.district, filters.town]);

  const handleSelectTown = (selectedTown) => {
    setFilters((prev) => ({
      ...prev,
      town: selectedTown,
    }));

    setTownSuggestions([]);
    setShowTownSuggestions(false);
  };

  const isNearbySearch =
    location.pathname.includes("/nearby") &&
    searchParams.has("lat") &&
    searchParams.has("lng");

  const getTodayDate = () => {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;

    return new Date(today.getTime() - timezoneOffset)
      .toISOString()
      .split("T")[0];
  };

  useEffect(() => {
    setFilters({
      district: searchParams.get("district") || "",
      town: searchParams.get("town") || "",
      category: searchParams.get("category") || "",
      eventDate: searchParams.get("eventDate") || "",
      minCapacity: searchParams.get("minCapacity") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadVenues = async () => {
      try {
        setLoading(true);
        setError("");

        const queryFilters = Object.fromEntries(searchParams.entries());

        const result = isNearbySearch
          ? await getNearbyVenues(queryFilters)
          : await getVenues(queryFilters);

        if (isMounted) {
          setVenues(result.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch venues");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVenues();

    return () => {
      isMounted = false;
    };
  }, [searchParams, isNearbySearch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildFilterQueryParams = (includeNearbyCoordinates = false) => {
    const queryParams = new URLSearchParams();

    if (includeNearbyCoordinates) {
      const lat = searchParams.get("lat");
      const lng = searchParams.get("lng");

      if (lat && lng) {
        queryParams.set("lat", lat);
        queryParams.set("lng", lng);
      }
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      }
    });

    return queryParams;
  };

  const handleUseCurrentLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const queryParams = buildFilterQueryParams(false);

        queryParams.set("lat", latitude);
        queryParams.set("lng", longitude);

        navigate(`/venues/nearby?${queryParams.toString()}`);
        setLocationLoading(false);
      },
      () => {
        setLocationError("Unable to access your location. Use manual filters.");
        setLocationLoading(false);
      }
    );
  };

  const handleRemoveCurrentLocation = () => {
    const queryParams = buildFilterQueryParams(false);
    const queryString = queryParams.toString();

    navigate(queryString ? `/venues?${queryString}` : "/venues");
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();

    const queryParams = buildFilterQueryParams(isNearbySearch);

    if (isNearbySearch) {
      setSearchParams(queryParams);
      return;
    }

    const queryString = queryParams.toString();

    navigate(queryString ? `/venues?${queryString}` : "/venues");
  };

  const handleClearFilters = () => {
    setFilters({
      district: "",
      town: "",
      category: "",
      eventDate: "",
      minCapacity: "",
      maxPrice: "",
    });

    navigate("/venues");
  };

  return (
    <section className="min-h-screen bg-[#faf7f5] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#4a1625]">
            Explore Venues
          </h1>

          <p className="text-gray-500 mt-2">
            Find and compare venues based on location, date, capacity and price.
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          <aside className="bg-white rounded-3xl shadow p-6 h-fit">
            <h2 className="text-2xl font-semibold text-[#4a1625]">
              Filters
            </h2>

            <form onSubmit={handleApplyFilters}
            autoComplete="off" 
            className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Current Location
                </label>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locationLoading}
                  className="w-full py-3 rounded-xl border border-[#8b1e2d] text-[#8b1e2d] font-semibold hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {locationLoading
                    ? "Getting Location..."
                    : isNearbySearch
                      ? "Refresh Current Location"
                      : "Use Current Location"}
                </button>

                {isNearbySearch && (
                  <button
                    type="button"
                    onClick={handleRemoveCurrentLocation}
                    className="w-full mt-3 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Remove Current Location
                  </button>
                )}

                {isNearbySearch && (
                  <p className="text-xs text-gray-500 mt-2">
                    Nearby results are sorted by distance.
                  </p>
                )}

                {locationError && (
                  <p className="text-xs text-red-600 mt-2">
                    {locationError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  District
                </label>

                <select
                  name="district"
                  value={filters.district}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                >
                  <option value="">Select district</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="Kollam">Kollam</option>
                  <option value="Pathanamthitta">Pathanamthitta</option>
                  <option value="Alappuzha">Alappuzha</option>
                  <option value="Kottayam">Kottayam</option>
                  <option value="Idukki">Idukki</option>
                  <option value="Ernakulam">Ernakulam</option>
                  <option value="Thrissur">Thrissur</option>
                  <option value="Palakkad">Palakkad</option>
                  <option value="Malappuram">Malappuram</option>
                  <option value="Kozhikode">Kozhikode</option>
                  <option value="Wayanad">Wayanad</option>
                  <option value="Kannur">Kannur</option>
                  <option value="Kasaragod">Kasaragod</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Town / Area
                </label>

                <input
                  type="text"
                  name="town"
                  value={filters.town}
                  onChange={(e) => {
                    handleFilterChange(e);
                    setShowTownSuggestions(true);
                  }}
                  onFocus={() => {
                    if (filters.town.trim().length > 0 && townSuggestions.length > 0) {
                      setShowTownSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowTownSuggestions(false);
                    }, 150);
                  }}
                  placeholder="Example: Kochi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                />

                {showTownSuggestions && townSuggestions.length > 0 && (
                  <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {townSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={() => handleSelectTown(suggestion)}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#8b1e2d] transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Event Date
                </label>

                <input
                  type="date"
                  name="eventDate"
                  value={filters.eventDate}
                  onChange={handleFilterChange}
                  min={getTodayDate()}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Select a date to see unavailable venues.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="banquet hall">Banquet Hall</option>
                  <option value="auditorium">Auditorium</option>
                  <option value="convention center">Convention Center</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="rooftop">Rooftop</option>
                  <option value="resort">Resort</option>
                  <option value="hotel ballroom">Hotel Ballroom</option>
                  <option value="community hall">Community Hall</option>
                  <option value="wedding hall">Wedding Hall</option>
                  <option value="conference room">Conference Room</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Minimum Capacity
                </label>

                <input
                  type="number"
                  name="minCapacity"
                  value={filters.minCapacity}
                  onChange={handleFilterChange}
                  min="1"
                  placeholder="Example: 300"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Maximum Price
                </label>

                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                  placeholder="Example: 50000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#8b1e2d] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#8b1e2d] text-white font-semibold hover:bg-[#6f1824] transition"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full py-3 rounded-xl border border-[#8b1e2d] text-[#8b1e2d] font-semibold hover:bg-red-50 transition"
              >
                Clear Filters
              </button>
            </form>
          </aside>

          <main>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {isNearbySearch ? "Nearby Venues" : "Available Venues"}
                </h2>

                <p className="text-gray-500 mt-1">
                  {loading
                    ? "Loading venues..."
                    : `${venues.length} venue${venues.length === 1 ? "" : "s"
                    } found`}
                </p>
              </div>

              {filters.eventDate && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
                  Showing availability for {filters.eventDate}
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center">
                <p className="text-gray-600 text-lg">Fetching venues...</p>
              </div>
            ) : venues.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center">
                <h3 className="text-2xl font-semibold text-gray-900">
                  No venues found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try changing your filters or clearing them.
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 px-6 py-3 rounded-xl bg-[#8b1e2d] text-white font-semibold hover:bg-[#6f1824] transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <div
                    key={venue._id}
                    className={`relative bg-white rounded-2xl shadow overflow-hidden transition ${venue.isBooked
                      ? "grayscale opacity-60 cursor-not-allowed"
                      : "hover:shadow-xl"
                      }`}
                  >
                    <div className="relative">
                      <img
                        src={venue.images?.[0] || "/placeholder-venue.jpg"}
                        alt={venue.name}
                        className="w-full h-56 object-cover"
                      />

                      {venue.isBooked && (
                        <span className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                          Unavailable
                        </span>
                      )}

                      {venue.distanceKm !== undefined && (
                        <span className="absolute bottom-4 left-4 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow">
                          {venue.distanceKm} km away
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {venue.name}
                          </h3>

                          <p className="text-gray-500 mt-1">
                            {venue.town}, {venue.district}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-500 mt-3">
                        Category: {venue.category}
                      </p>

                      <p className="text-[#8b1e2d] font-semibold mt-4">
                        Starting from ₹{venue.pricing?.basePrice || "N/A"}
                      </p>

                      <p className="text-gray-500 mt-2">
                        Capacity: Up to {venue.capacity || "N/A"} Guests
                      </p>

                      {venue.isBooked ? (
                        <button
                          type="button"
                          disabled
                          className="block w-full mt-5 py-3 rounded-xl bg-gray-300 text-gray-600 cursor-not-allowed"
                        >
                          Unavailable on Selected Date
                        </button>
                      ) : (
                        <Link
                          to={`/venues/${venue._id}`}
                          className="block text-center w-full mt-5 py-3 rounded-xl bg-[#8b1e2d] text-white hover:bg-[#6f1824] transition"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

export default VenuePage;
