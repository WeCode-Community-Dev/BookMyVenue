
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../api/categories";
import { getVenues, getHomepageData } from "../api/venues";
import logo from "../assets/image.png";

function Home() {
  const navigate = useNavigate();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { token, currentUser, logout, loading } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [city, setCity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [availabilityType, setAvailabilityType] = useState("");

  const [isSearchActive, setIsSearchActive] = useState(false);

  const [categories, setCategories] = useState([]);

  const [venues, setVenues] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [topRatedVenues, setTopRatedVenues] = useState([]);
  const [recentlyAddedVenues, setRecentlyAddedVenues] = useState([]);
  const [categorySections, setCategorySections] = useState([]);
  const [homepageLoading, setHomepageLoading] = useState(true);
  const [homepageError, setHomepageError] = useState("");

  const openLogin = () => { setAuthMode("login"); setAuthOpen(true); };
  const openRegister = () => { setAuthMode("register"); setAuthOpen(true); };

  const isLoggedIn = token && currentUser;
  const limit = 16;

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadHomepageData() {
      try {
        const data = await getHomepageData();
        setTopRatedVenues(data.top_rated || []);
        setRecentlyAddedVenues(data.recently_added || []);
        setCategorySections(data.by_category || []);
      } catch (err) {
        setHomepageError("Failed to load homepage data");
      } finally {
        setHomepageLoading(false);
      }
    }
    loadHomepageData();
  }, []);

  useEffect(() => {
    const allInputsCleared =
      searchText.trim() === "" &&
      city.trim() === "" &&
      categoryId === "" &&
      availabilityType === "";

    if (allInputsCleared) {
      setIsSearchActive(false);
      setVenues([]);
      setTotal(0);
      setCurrentPage(1);
    }
  }, [searchText, city, categoryId, availabilityType]);

  function goToDashboard() {
    if (currentUser.role === "booker") {
      navigate("/dashboard");
    } else if (currentUser.role === "owner") {
      navigate("/owner/dashboard");
    } else if (currentUser.role === "admin") {
      navigate("/admin/dashboard");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function buildSearchParams(pageNumber) {
    const params = { page: pageNumber, limit: limit };
    if (searchText.trim()) params.search = searchText.trim();
    if (city.trim()) params.city = city.trim();
    if (categoryId) params.category_id = categoryId;
    if (availabilityType) params.availability_type = availabilityType;
    return params;
  }

  function extractVenuesFromResponse(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.venues)) return data.venues;
    if (Array.isArray(data.items)) return data.items;
    return [];
  }

  function extractTotalFromResponse(data) {
    if (typeof data.total === "number") return data.total;
    if (typeof data.count === "number") return data.count;
    if (Array.isArray(data)) return data.length;
    return 0;
  }

  async function fetchSearchResults(pageNumber) {
    try {
      setSearchLoading(true);
      setSearchError("");
      const params = buildSearchParams(pageNumber);
      const data = await getVenues(params);
      const venueList = extractVenuesFromResponse(data);
      const totalCount = extractTotalFromResponse(data);
      setVenues(venueList);
      setTotal(totalCount);
      setCurrentPage(pageNumber);
    } catch (err) {
      setSearchError("Failed to fetch venues");
    } finally {
      setSearchLoading(false);
    }
  }

  function handleSearch() {
    const hasSearchValue =
      searchText.trim() !== "" ||
      city.trim() !== "" ||
      categoryId !== "" ||
      availabilityType !== "";

    if (!hasSearchValue) {
      setIsSearchActive(false);
      return;
    }
    setIsSearchActive(true);
    fetchSearchResults(1);
  }

  async function handlePageClick(pageNumber) {
    fetchSearchResults(pageNumber);
  }

  async function handleLoadMore(sectionName) {
    try {
      const data = await getVenues({ page: 1, limit: 8 });
      const newVenues = extractVenuesFromResponse(data);
      if (sectionName === "topRated") {
        setTopRatedVenues((prev) => [...prev, ...newVenues]);
      }
      if (sectionName === "recentlyAdded") {
        setRecentlyAddedVenues((prev) => [...prev, ...newVenues]);
      }
    } catch (err) {
      alert("Failed to load more venues");
    }
  }

  function VenueCard({ venue }) {
    return (
      <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-red-300 hover:shadow-md">
        <div className="flex h-40 items-center justify-center bg-gray-50 text-5xl font-bold text-red-600/70">
          {venue.name?.charAt(0)?.toUpperCase() || "V"}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-900">
            {venue.name}
          </h3>

          <p className="mb-3 flex items-center gap-1 text-sm text-gray-600">
            <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {venue.city || "Not available"}
          </p>

          {venue.status && (
            <span className="mb-3 inline-flex w-fit items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              {venue.status}
            </span>
          )}

          <div className="mt-auto space-y-1 border-t border-gray-100 pt-3">
            {venue.supports_hourly && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Hourly</span>
                <span className="font-semibold text-gray-900">₹{venue.hourly_price}</span>
              </div>
            )}
            {venue.supports_daily && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Daily</span>
                <span className="font-semibold text-gray-900">₹{venue.daily_price}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/venues/${venue.id}`)}
            className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            View Details
          </button>
        </div>
      </div>
    );
  }

  function VenueGrid({ venueList }) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {venueList.map((venue, index) => {
          const venueKey = venue.id || venue.venue_id || index;
          return <VenueCard key={venueKey} venue={venue} />;
        })}
      </div>
    );
  }

  function SectionHeading({ children }) {
    return (
      <div className="mb-2 flex items-end justify-between border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{children}</h2>
          <div className="mt-2 h-0.5 w-12 bg-red-600" />
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      {/* Header — full width white */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
            aria-label="BookMyVenue home"
          >
            <img src={logo} alt="BookMyVenue" className="h-12 w-auto" />
          </button>

          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-sm text-gray-500">Loading...</span>
            ) : isLoggedIn ? (
              <>
                <button
                  onClick={goToDashboard}
                  className="rounded-md px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                    onClick={openLogin}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                    Sign in
                </button>
                <button
                    onClick={openRegister}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                    Register                                            
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="w-full bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          {/* Hero */}
          {!isSearchActive && (
            <section className="mb-10 py-10 text-center sm:py-14">
              <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-black sm:text-5xl">
                Find your <span className="text-red-600">ideal venue</span> for any event
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-gray-700 sm:text-lg">
                Compare auditoriums, banquet halls, conference rooms and more, all in one place.
              </p>
            </section>
          )}

          {/* Search bar */}
          <section className="mb-12">
            <div className="mx-auto flex max-w-5xl flex-col gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm md:flex-row md:items-stretch">
              <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 md:border-r md:border-gray-200">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Venue name or keyword"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 md:border-r md:border-gray-200">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-1 items-center rounded-lg px-3 py-2 md:border-r md:border-gray-200">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 focus:outline-none"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-1 items-center rounded-lg px-3 py-2">
                <select
                  value={availabilityType}
                  onChange={(e) => setAvailabilityType(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 focus:outline-none"
                >
                  <option value="">Any availability</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </section>

          {/* Search results */}
          {isSearchActive && (
            <section className="mb-12">
              <SectionHeading>Search results</SectionHeading>
              {searchLoading && <p className="mt-6 text-sm text-gray-600">Loading results…</p>}
              {searchError && <p className="mt-6 text-sm text-red-600">{searchError}</p>}
              {!searchLoading && !searchError && venues.length === 0 && (
                <p className="mt-6 text-sm text-gray-600">No venues match your filters.</p>
              )}
              {!searchLoading && venues.length > 0 && (
                <>
                  <VenueGrid venueList={venues} />
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageClick(page)}
                          className={`h-9 w-9 rounded-md text-sm font-semibold transition-colors ${
                            currentPage === page
                              ? "bg-red-600 text-white"
                              : "border border-gray-200 bg-white text-gray-700 hover:border-red-300 hover:text-red-600"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* Homepage sections */}
          {!isSearchActive && (
            <section className="space-y-14">
              {homepageLoading && <p className="text-sm text-gray-600">Loading venues…</p>}
              {homepageError && <p className="text-sm text-red-600">{homepageError}</p>}

              {!homepageLoading && !homepageError && (
                <>
                  {topRatedVenues.length > 0 && (
                    <div>
                      <SectionHeading>Top rated venues</SectionHeading>
                      <VenueGrid venueList={topRatedVenues} />
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => handleLoadMore("topRated")}
                          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-red-300 hover:text-red-600"
                        >
                          Load more
                        </button>
                      </div>
                    </div>
                  )}

                  {recentlyAddedVenues.length > 0 && (
                    <div>
                      <SectionHeading>Recently added</SectionHeading>
                      <VenueGrid venueList={recentlyAddedVenues} />
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => handleLoadMore("recentlyAdded")}
                          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-red-300 hover:text-red-600"
                        >
                          Load more
                        </button>
                      </div>
                    </div>
                  )}

                  {categorySections.map((section) => {
                    const sectionVenues = section.venues || [];
                    if (sectionVenues.length === 0) return null;
                    return (
                      <div key={section.category_id || section.name}>
                        <SectionHeading>{section.name}</SectionHeading>
                        <VenueGrid venueList={sectionVenues} />
                      </div>
                    );
                  })}
                </>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="w-full border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
          <div className="mb-3 flex justify-center">
            <img src={logo} alt="BookMyVenue" className="h-10 w-auto opacity-80" />
          </div>
          © 2026 BookMyVenue. All rights reserved.
        </div>
      </footer>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        />
    </div>
  );
}

export default Home;
