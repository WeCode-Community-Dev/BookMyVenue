import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchPublicVenuesAsync } from "../modules/venues/venuesSlice";
import Footer from "../components/Footer";

// ─── Icons ───────────────────────────────────────────────────────────────────

function StarIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UsersIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function SearchIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

// ─── Venue Card ──────────────────────────────────────────────────────────────

function VenueCard({ venue }) {
  return (
    <Link
      to={`/venues/${venue.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-rose-100 transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        {venue.image_url ? (
          <img
            src={venue.image_url}
            alt={venue.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <span className="text-slate-400 text-sm">No image</span>
          </div>
        )}
        {venue.average_rating && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
            <StarIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-800">
              {Number(venue.average_rating).toFixed(1)}
            </span>
            {venue.total_reviews > 0 && (
              <span className="text-[10px] text-slate-400">({venue.total_reviews})</span>
            )}
          </div>
        )}
        {venue.venue_type && (
          <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-semibold px-2 py-1 rounded-lg uppercase tracking-wide">
            {venue.venue_type.name}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-800 text-base leading-tight">{venue.name}</h3>
        <div className="flex items-center gap-1 mt-1.5 text-slate-400">
          <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs truncate">{venue.location}</span>
        </div>
        {venue.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {venue.amenities.slice(0, 3).map((a) => (
              <span key={a.id} className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded-md">
                {a.name}
              </span>
            ))}
            {venue.amenities.length > 3 && (
              <span className="text-[10px] text-slate-400">+{venue.amenities.length - 3}</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
          <div>
            <span className="text-lg font-bold text-slate-900">
              ₹{Number(venue.price_per_day).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-400"> /day</span>
          </div>
          {venue.capacity && (
            <div className="flex items-center gap-1 text-slate-400">
              <UsersIcon className="w-3.5 h-3.5" />
              <span className="text-xs">{venue.capacity} guests</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function VenueCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
      <div className="w-full h-48 bg-slate-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-2/3 mt-3" />
        <div className="flex justify-between mt-3 pt-3 border-t border-slate-50">
          <div className="h-5 bg-slate-100 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

function VenuesPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { list: venues, isLoadingList } = useSelector((state) => state.venues);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [debouncedLocation, setDebouncedLocation] = useState(location);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedLocation(location), 400);
    return () => clearTimeout(t);
  }, [location]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (debouncedLocation) params.location = debouncedLocation;
    params.limit = 20;

    dispatch(fetchPublicVenuesAsync(params));

    const urlParams = {};
    if (debouncedSearch) urlParams.search = debouncedSearch;
    if (debouncedLocation) urlParams.location = debouncedLocation;
    setSearchParams(urlParams, { replace: true });
  }, [debouncedSearch, debouncedLocation, dispatch]);

  const handleClearFilters = () => {
    setSearch("");
    setLocation("");
  };

  const hasFilters = search || location;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3.5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md shadow-rose-200">
              BMV
            </div>
            <span className="font-bold text-slate-800 text-lg hidden sm:inline">BookMyVenue</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-rose-600 transition-colors">Home</Link>
            <Link to="/venues" className="text-rose-600 font-medium">Venues</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-slate-600 hover:text-rose-600 px-3 py-1.5">Login</Link>
            <Link to="/register" className="bg-rose-600 hover:bg-rose-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ── Page Hero ── */}
      <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-rose-300 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Venues</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Browse All Venues</h1>
          <p className="text-rose-200 mt-2 text-sm">
            {isLoadingList
              ? "Loading venues..."
              : `${venues.length} venue${venues.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search venues by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            <div className="relative sm:w-64">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-slate-500 hover:text-rose-600 px-3 py-2.5 border border-slate-200 rounded-xl transition-colors whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8">
        {isLoadingList ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <VenueCardSkeleton key={i} />)}
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-slate-800 font-semibold">No venues found</h3>
            <p className="text-slate-400 text-sm mt-2">
              {hasFilters
                ? "Try adjusting your search or location filter."
                : "No approved venues are available yet."}
            </p>
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-4 text-sm text-rose-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {hasFilters && (
              <p className="text-xs text-slate-400 mb-4">
                Showing {venues.length} result{venues.length !== 1 ? "s" : ""}
                {search ? ` for "${search}"` : ""}
                {location ? ` in "${location}"` : ""}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default VenuesPage;