import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { venueService } from '../../services';
import { MdSearch, MdLocationOn, MdStar, MdPeople, MdTune, MdMyLocation } from 'react-icons/md';
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
  const [radius, setRadius] = useState(50);

  // Geocoding and Location Suggestion State
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocationName, setSelectedLocationName] = useState('');

  useEffect(() => {
    const savedLat = localStorage.getItem('user_latitude');
    const savedLng = localStorage.getItem('user_longitude');
    const savedName = localStorage.getItem('user_location_name');

    if (savedLat && savedLng) {
      setGeoLoc({ lat: parseFloat(savedLat), lng: parseFloat(savedLng) });
      setUseGeo(true);
      setLocationSearch(savedName || 'My Location');
      setSelectedLocationName(savedName || 'My Location');
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [searchParams, page, useGeo, geoLoc, radius]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      let res;
      if (useGeo && geoLoc.lat && geoLoc.lng) {
        res = await venueService.getNearby(geoLoc.lat, geoLoc.lng, radius);
        const sorted = (res.data || []).sort((a, b) => Number(a.distance || 0) - Number(b.distance || 0));
        setVenues(sorted);
        setTotal(sorted.length);
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

  const handleLocationSearchChange = async (val) => {
    setLocationSearch(val);
    if (val.trim().length < 3) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const res = await venueService.geocode(val);
      setLocationSuggestions(res.data || []);
    } catch (err) {
      console.error('Failed to geocode location:', err);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setGeoLoc({ lat, lng });
    const displayNameShort = suggestion.display_name.split(',')[0];
    setSelectedLocationName(suggestion.display_name);
    setLocationSearch(displayNameShort);
    setLocationSuggestions([]);
    setUseGeo(true);
    setPage(1);

    localStorage.setItem('user_latitude', lat);
    localStorage.setItem('user_longitude', lng);
    localStorage.setItem('user_location_name', displayNameShort);

    toast.success(`Showing spaces near ${displayNameShort} (${radius}km)`);
  };

  const handleClearLocation = () => {
    setGeoLoc({ lat: null, lng: null });
    setSelectedLocationName('');
    setLocationSearch('');
    setLocationSuggestions([]);
    setUseGeo(false);

    localStorage.removeItem('user_latitude');
    localStorage.removeItem('user_longitude');
    localStorage.removeItem('user_location_name');
  };

  const handleGeoDiscovery = () => {
    if (!navigator.geolocation) return toast.error('Geolocation is not supported by your browser');
    toast.loading('Fetching your location...', { id: 'geo' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGeoLoc({ lat, lng });
        setUseGeo(true);
        setLocationSearch('My Location');
        setSelectedLocationName('My Location');

        localStorage.setItem('user_latitude', lat);
        localStorage.setItem('user_longitude', lng);
        localStorage.setItem('user_location_name', 'My Location');

        toast.success(`Found location! Listing spaces within ${radius}km.`, { id: 'geo' });
      },
      (err) => {
        console.warn('Geolocation error:', err);
        toast.error(err.code === 1 ? 'Location permission denied.' : 'Failed to retrieve precise location.', { id: 'geo' });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
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
    setGeoLoc({ lat: null, lng: null });
    setRadius(50);
    setSelectedLocationName('');
    setLocationSearch('');
    setLocationSuggestions([]);
    setSearchParams({});
    setPage(1);

    localStorage.removeItem('user_latitude');
    localStorage.removeItem('user_longitude');
    localStorage.removeItem('user_location_name');
  };

  return (
    <div className="min-h-screen bg-bg-primary pt-28 pb-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 sticky top-28 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MdTune className="text-primary text-base" /> Filters
                </h2>
                <button onClick={handleClearFilters} className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                  Clear All
                </button>
              </div>

              <form onSubmit={handleApplyFilters} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      className="w-full py-2 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="e.g. Banquet, Chennai..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 relative">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nearby Location</label>
                  <div className="relative">
                    <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      className="w-full py-2 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                      placeholder="e.g. Manimala, Charuvely..."
                      value={locationSearch}
                      onChange={e => handleLocationSearchChange(e.target.value)}
                    />
                    {locationSearch && (
                      <button
                        type="button"
                        onClick={handleClearLocation}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  {/* Location suggestions dropdown */}
                  {locationSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {locationSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(item)}
                          className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-0 truncate block cursor-pointer"
                        >
                          {item.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Venue Type</label>
                  <select
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    value={venueType}
                    onChange={e => setVenueType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="banquet_hall">Banquet Hall</option>
                    <option value="conference_room">Conference Room</option>
                    <option value="resort">Resort</option>
                    <option value="hotel">Hotel</option>
                    <option value="meetup_space">Meetup Space</option>
                    <option value="birthday_hall">Birthday Hall</option>
                    <option value="auditorium">Auditorium</option>
                    <option value="cafe">Cafe / Resto</option>
                    <option value="outdoor_space">Outdoor Space</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Min Capacity</label>
                  <input
                    type="number"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    placeholder="e.g. 50"
                    value={minCapacity}
                    onChange={e => setMinCapacity(e.target.value)}
                  />
                </div>                 <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Max Price/hr (₹)</label>
                  <input
                    type="number"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    placeholder="e.g. 2000"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Search Radius</label>
                  <select
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-primary focus:bg-white transition-colors"
                    value={radius}
                    onChange={e => setRadius(Number(e.target.value))}
                  >
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                    <option value="50">50 km</option>
                    <option value="100">100 km</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-2.5 mt-2 font-bold rounded-xl bg-primary hover:bg-primary-dark text-white text-xs transition-colors shadow-sm shadow-primary/10 cursor-pointer">
                  Apply Filters
                </button>
              </form>

              <div className="border-t border-slate-100 mt-5 pt-5">
                <button
                  onClick={handleGeoDiscovery}
                  className={`w-full py-2.5 font-bold rounded-xl flex items-center justify-center gap-1.5 border text-xs transition-colors cursor-pointer ${
                    useGeo
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary'
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
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">Available Spaces</h1>
              <p className="text-slate-500 text-xs mt-1 font-medium">
                {selectedLocationName ? (
                  <span>Showing spaces within {radius}km of <strong className="text-primary">{selectedLocationName.split(',')[0]}</strong> ({total} found)</span>
                ) : useGeo ? (
                  <span>Showing spaces within {radius}km of <strong className="text-primary">My Location</strong> ({total} found)</span>
                ) : (
                  <span>{total} spaces available. Set your location for distance-sorted results.</span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="matte-card h-80 animate-pulse bg-slate-100 border border-slate-200" />
                ))}
              </div>
            ) : venues.length === 0 ? (
              <div className="matte-card p-12 text-center bg-white border border-slate-200">
                <span className="text-3xl mb-3 inline-block">🔍</span>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No spaces found</h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto mb-5">
                  Try widening search criteria or resetting filters.
                </p>
                <button onClick={handleClearFilters} className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer">
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <Link
                    key={venue.id}
                    to={`/venues/${venue.id}`}
                    className="matte-card overflow-hidden flex flex-col group bg-white border border-slate-200 rounded-2xl"
                  >
                    <div className="h-44 overflow-hidden relative bg-slate-100">
                      {venue.images?.[0] ? (
                        <img
                          src={venue.images[0]}
                          alt={venue.venueName}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
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
                          <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate group-hover:text-primary transition-colors">
                            {venue.venueName}
                          </h3>
                          <div className="flex items-center gap-0.5 text-yellow-500 text-xs font-semibold shrink-0">
                            <MdStar /> {Number(venue.rating || 0).toFixed(1)}
                          </div>
                        </div>

                        <p className="text-slate-500 text-xs truncate mb-4">
                          {venue.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-slate-400">Seating</span>
                          <span className="text-xs font-bold text-slate-700">{venue.capacity} guests</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-bold text-slate-400 font-sans">
                            {venue.pricingUnit === 'day' ? 'Price/Day' : 'Price/Hour'}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            ₹{venue.pricingUnit === 'day' ? Number(venue.pricePerDay || 0).toLocaleString('en-IN') : Number(venue.pricePerHour).toLocaleString('en-IN')}
                          </span>
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
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 px-3 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 cursor-pointer shadow-sm"
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
