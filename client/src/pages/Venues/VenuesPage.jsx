import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { venueService } from '../../services';
import { MdSearch, MdLocationOn, MdStar, MdPeople, MdAttachMoney, MdTune, MdMyLocation } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function VenuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [venueType, setVenueType] = useState(searchParams.get('venueType') || '');
  const [minCapacity, setMinCapacity] = useState(searchParams.get('minCapacity') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [useGeo, setUseGeo] = useState(false);
  const [geoLoc, setGeoLoc] = useState({ lat: null, lng: null });

  useEffect(() => {
    fetchVenues();
  }, [searchParams, page, useGeo, geoLoc]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      let res;
      if (useGeo && geoLoc.lat && geoLoc.lng) {
        res = await venueService.getNearby(geoLoc.lat, geoLoc.lng, 25);
        setVenues(res.data || []);
        setTotal(res.data?.length || 0);
        setTotalPages(1);
      } else {
        const params = {
          page,
          limit: 12,
          search: searchParams.get('search') || undefined,
          venueType: searchParams.get('venueType') || undefined,
          minCapacity: searchParams.get('minCapacity') || undefined,
          maxPrice: searchParams.get('maxPrice') || undefined,
          minRating: searchParams.get('minRating') || undefined,
        };
        res = await venueService.getAll(params);
        setVenues(res.data.venues || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch {
      toast.error('Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = {};
    if (search) newParams.search = search;
    if (venueType) newParams.venueType = venueType;
    if (minCapacity) newParams.minCapacity = minCapacity;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (minRating) newParams.minRating = minRating;
    setSearchParams(newParams);
    setPage(1);
    setUseGeo(false);
  };

  const handleGeoDiscovery = () => {
    if (!navigator.geolocation) return toast.error('Geolocation is not supported by your browser');
    toast.loading('Fetching your location...', { id: 'geo' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUseGeo(true);
        toast.success('Found location! Listing spaces within 25km.', { id: 'geo' });
      },
      () => {
        toast.error('Location permission denied.', { id: 'geo' });
      }
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setVenueType('');
    setMinCapacity('');
    setMaxPrice('');
    setMinRating('');
    setUseGeo(false);
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-28 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-bg-card p-6 rounded-xl border border-white/8 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <MdTune className="text-primary" /> Filters
                </h2>
                <button onClick={handleClearFilters} className="text-xs font-semibold text-primary hover:text-white transition-colors">
                  Clear All
                </button>
              </div>

              <form onSubmit={handleApplyFilters} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      className="w-full py-2 pl-9 pr-3 bg-white/5 border border-white/8 rounded-lg text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-primary"
                      placeholder="e.g. Banquet, Chennai..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Venue Type</label>
                  <select
                    className="w-full py-2 px-3 bg-white/5 border border-white/8 rounded-lg text-white text-xs focus:outline-none focus:border-primary"
                    value={venueType}
                    onChange={e => setVenueType(e.target.value)}
                  >
                    <option value="" className="bg-bg-card">All Types</option>
                    <option value="banquet_hall" className="bg-bg-card">Banquet Hall</option>
                    <option value="conference_room" className="bg-bg-card">Conference Room</option>
                    <option value="resort_hotel" className="bg-bg-card">Resort/Hotel</option>
                    <option value="meetup_space" className="bg-bg-card">Meetup Space</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Min Capacity</label>
                  <input
                    type="number"
                    className="w-full py-2 px-3 bg-white/5 border border-white/8 rounded-lg text-white text-xs focus:outline-none focus:border-primary"
                    placeholder="e.g. 50"
                    value={minCapacity}
                    onChange={e => setMinCapacity(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Max Price/hr (₹)</label>
                  <input
                    type="number"
                    className="w-full py-2 px-3 bg-white/5 border border-white/8 rounded-lg text-white text-xs focus:outline-none focus:border-primary"
                    placeholder="e.g. 2000"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>

                <button type="submit" className="w-full py-2.5 mt-2 font-bold rounded-lg bg-primary hover:bg-primary-dark text-white text-xs transition-colors">
                  Apply Filters
                </button>
              </form>

              <div className="border-t border-white/8 mt-5 pt-5">
                <button
                  onClick={handleGeoDiscovery}
                  className={`w-full py-2.5 font-bold rounded-lg flex items-center justify-center gap-1.5 border text-xs transition-colors ${
                    useGeo
                      ? 'bg-primary/20 border-primary text-primary-light'
                      : 'bg-white/5 border-white/8 text-zinc-300 hover:border-primary'
                  }`}
                >
                  <MdMyLocation className="text-sm" /> Discover Nearby
                </button>
              </div>
            </div>
          </aside>

          {/* Listings */}
          <main className="flex-grow">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white">Available Spaces</h1>
              <p className="text-zinc-400 text-xs mt-1">{total} event spaces found</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="matte-card h-80 animate-pulse" />
                ))}
              </div>
            ) : venues.length === 0 ? (
              <div className="matte-card p-12 text-center">
                <span className="text-3xl mb-3 inline-block">🔍</span>
                <h3 className="text-sm font-bold text-white mb-1">No spaces found</h3>
                <p className="text-zinc-400 text-xs max-w-xs mx-auto mb-5">
                  Try widening search criteria or resetting filters.
                </p>
                <button onClick={handleClearFilters} className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 border border-white/8 text-white">
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <Link
                    key={venue.id}
                    to={`/venues/${venue.id}`}
                    className="matte-card overflow-hidden flex flex-col group"
                  >
                    <div className="h-44 overflow-hidden relative bg-zinc-900">
                      {venue.images?.[0] ? (
                        <img
                          src={venue.images[0]}
                          alt={venue.venueName}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl bg-bg-card">
                          🏢
                        </div>
                      )}
                      {venue.distance !== undefined && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-primary text-white text-[10px] font-bold shadow-md">
                          📍 {Number(venue.distance).toFixed(1)} km away
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-white text-sm tracking-tight truncate group-hover:text-primary-light transition-colors">
                            {venue.venueName}
                          </h3>
                          <div className="flex items-center gap-0.5 text-yellow-500 text-xs font-semibold shrink-0">
                            <MdStar /> {Number(venue.rating || 0).toFixed(1)}
                          </div>
                        </div>

                        <p className="text-zinc-400 text-xs truncate mb-4">
                          {venue.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-white/8">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-zinc-500">Seating</span>
                          <span className="text-xs font-semibold text-zinc-200">{venue.capacity} guests</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-zinc-500">Price/Hour</span>
                          <span className="text-xs font-semibold text-zinc-200">₹{Number(venue.pricePerHour).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!useGeo && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 text-white disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-zinc-400 px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 text-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
