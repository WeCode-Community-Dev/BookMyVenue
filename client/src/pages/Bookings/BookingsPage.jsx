import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService, userService, venueService } from '../../services';
import { thumbnailUrl } from '../../utils/cloudinaryUrl';
import { 
  MdCalendarToday, 
  MdOutlineAccessTime, 
  MdCurrencyRupee, 
  MdQrCode, 
  MdPerson, 
  MdEventNote,
  MdTrendingUp,
  MdSearch,
  MdOutlineMapsHomeWork,
  MdDashboard,
  MdLocationOn,
  MdMyLocation,
  MdTune
} from 'react-icons/md';
import toast from 'react-hot-toast';

const formatTime12Hour = (timeStr) => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  const minStr = m > 0 ? `:${String(m).padStart(2, '0')}` : ':00';
  return `${h}${minStr} ${ampm}`;
};

export default function BookingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'venues');

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [venueType, setVenueType] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [useGeo, setUseGeo] = useState(false);
  const [geoLoc, setGeoLoc] = useState({ lat: null, lng: null });
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocationName, setSelectedLocationName] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const bRes = await bookingService.getMyBookings();
      setBookings(bRes.data.bookings || []);
      const vRes = await venueService.getAll();
      setVenues(vRes.data.venues || []);
    } catch {
      toast.error('Failed to load accounts and listings data');
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async (latitude = null, longitude = null) => {
    try {
      let res;
      if (latitude && longitude) {
        res = await venueService.getNearby(latitude, longitude, 50);
        setVenues(res.data || []);
      } else {
        res = await venueService.getAll();
        setVenues(res.data.venues || []);
      }
    } catch {
      toast.error('Failed to load spaces listing');
    }
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

  const handleSelectSuggestion = async (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setGeoLoc({ lat, lng });
    const displayNameShort = suggestion.display_name.split(',')[0];
    setSelectedLocationName(suggestion.display_name);
    setLocationSearch(displayNameShort);
    setLocationSuggestions([]);
    setUseGeo(true);
    toast.success(`Showing spaces near ${displayNameShort} (50km)`);
    await fetchVenues(lat, lng);
  };

  const handleClearLocation = async () => {
    setGeoLoc({ lat: null, lng: null });
    setSelectedLocationName('');
    setLocationSearch('');
    setLocationSuggestions([]);
    setUseGeo(false);
    await fetchVenues();
  };

  const handleGeoDiscovery = () => {
    if (!navigator.geolocation) return toast.error('Geolocation is not supported by your browser');
    toast.loading('Fetching your location...', { id: 'geo' });
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGeoLoc({ lat, lng });
        setUseGeo(true);
        setLocationSearch('My Location');
        setSelectedLocationName('My Location');
        toast.success('Found location! Listing spaces within 50km.', { id: 'geo' });
        await fetchVenues(lat, lng);
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

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'completed': return 'bg-blue-50 text-blue-600 border border-blue-100';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await bookingService.updateStatus(id, 'cancelled');
      toast.success('Booking cancelled successfully.');
      const bRes = await bookingService.getMyBookings();
      setBookings(bRes.data.bookings || []);
      setCancelConfirmId(null);
    } catch {
      toast.error('Failed to cancel booking.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate Guest Spending
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed');
  const totalSpent = confirmedBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);

  // Search filter venues
  const filteredVenues = venues.filter(v => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      v.venueName?.toLowerCase().includes(query) ||
      v.address?.toLowerCase().includes(query);
    const matchesType = !venueType || v.venueType === venueType;
    const matchesCapacity = !minCapacity || Number(v.capacity) >= Number(minCapacity);
    const matchesPrice = !maxPrice || Number(v.pricePerHour) <= Number(maxPrice);
    return matchesSearch && matchesType && matchesCapacity && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-20 flex">
      {/* Left Sidebar Layout */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden md:flex flex-col shrink-0 fixed bottom-0 top-20 left-0 z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <MdDashboard className="text-xl" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">User Space Center</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest Account</span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <button
            onClick={() => navigate('?tab=venues')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'venues' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdOutlineMapsHomeWork className="text-lg shrink-0" />
            Discover Venues
          </button>

          <button
            onClick={() => navigate('?tab=bookings')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'bookings' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdCalendarToday className="text-lg shrink-0" />
            My Bookings
          </button>

          <button
            onClick={() => navigate('?tab=spending')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'spending' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdTrendingUp className="text-lg shrink-0" />
            Spending Insights
          </button>
        </nav>
      </aside>

      {/* Mobile Top Tabs (Visible only on mobile devices) */}
      <div className="md:hidden w-full bg-white border-b border-slate-200/80 fixed top-20 left-0 right-0 z-10 flex overflow-x-auto gap-2 p-3">
        <button
          onClick={() => navigate('?tab=venues')}
          className={`py-2 px-4 text-xs font-bold rounded-lg border transition-all shrink-0 ${
            activeTab === 'venues'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Discover Venues
        </button>
        <button
          onClick={() => navigate('?tab=bookings')}
          className={`py-2 px-4 text-xs font-bold rounded-lg border transition-all shrink-0 ${
            activeTab === 'bookings'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          My Bookings
        </button>
        <button
          onClick={() => navigate('?tab=spending')}
          className={`py-2 px-4 text-xs font-bold rounded-lg border transition-all shrink-0 ${
            activeTab === 'spending'
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Spending Insights
        </button>
      </div>

      {/* Right Content Frame */}
      <main className="flex-grow md:ml-64 p-6 sm:p-10 overflow-x-hidden pt-36 md:pt-10">
        
        {/* Tab 1: Discover Venues */}
        {activeTab === 'venues' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Discover Verified Venues</h3>
              <p className="text-xs text-slate-400 mt-0.5">Search and reserve prime meeting spaces, party halls, or wedding spots instantly.</p>
            </div>

            {/* Main Search Row with Filters Toggle Button */}
            <div className="flex gap-3 items-center">
              {/* Search Term input */}
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <MdSearch className="text-lg" />
                </span>
                <input
                  type="text"
                  className="w-full py-2.5 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
                  placeholder="Search by space name or location keywords..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters Toggle Button */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm h-10 ${
                  showFilters
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <MdTune className="text-sm" />
                Filters
                {(venueType || minCapacity || maxPrice || locationSearch) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Expanded Filters Card (Visible only when showFilters is toggled) */}
            {showFilters && (
              <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
                {/* Row 1: Nearby Location (Geocoding) */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nearby Location (Geocoding)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <MdLocationOn className="text-lg" />
                    </span>
                    <input
                      type="text"
                      className="w-full py-2.5 pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-400"
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
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
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

                {/* Row 2: Space Type + Min Seating + Max Price + Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 items-end">
                  {/* Space Type */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Space Type</label>
                    <select
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      value={venueType}
                      onChange={e => setVenueType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="banquet_hall">Banquet Hall</option>
                      <option value="conference_room">Conference Room</option>
                      <option value="resort_hotel">Resort/Hotel</option>
                      <option value="meetup_space">Meetup Space</option>
                    </select>
                  </div>

                  {/* Min Capacity */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min Seating (pax)</label>
                    <input
                      type="number"
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-400"
                      placeholder="e.g. 50"
                      value={minCapacity}
                      onChange={e => setMinCapacity(e.target.value)}
                    />
                  </div>

                  {/* Max Price */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Price / hour (₹)</label>
                    <input
                      type="number"
                      className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-slate-400"
                      placeholder="e.g. 1500"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                    />
                  </div>

                  {/* Device GPS Discovery + Reset Actions */}
                  <div className="flex gap-2 items-center justify-end h-10">
                    <button
                      type="button"
                      onClick={handleGeoDiscovery}
                      className="h-10 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-primary/10 border border-primary"
                      title="Find venues near me using browser GPS"
                    >
                      <MdMyLocation className="text-sm animate-pulse" /> Device Location
                    </button>

                    {(searchQuery || venueType || minCapacity || maxPrice || locationSearch) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setVenueType('');
                          setMinCapacity('');
                          setMaxPrice('');
                          handleClearLocation();
                        }}
                        className="h-10 py-2.5 px-4 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {filteredVenues.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm max-w-xl mt-4">
                <span className="text-4xl mb-4 inline-block">🔍</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No venues matching search</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Try modifying your search keywords or explore other listing options.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {filteredVenues.map((v) => (
                  <div key={v.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="h-40 w-full bg-slate-100 overflow-hidden relative shrink-0">
                      {v.images?.[0] ? (
                        <img
                          src={thumbnailUrl(v.images[0])}
                          alt={v.venueName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 text-slate-300">
                          <span className="text-4xl mb-1">🏢</span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-slate-900 text-base leading-tight mb-1">{v.venueName}</h4>
                        <p className="text-xs text-slate-400 mb-3 truncate">📍 {v.address}</p>
                        
                        <div className="flex flex-wrap gap-2.5 mb-4">
                          {v.amenities?.slice(0, 3).map((am, i) => (
                            <span key={i} className="py-1 px-2 bg-slate-50 border border-slate-100 rounded-md text-[10px] text-slate-500 font-semibold">{am}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-50">
                          <span className="flex items-center gap-0.5">Hourly: <span className="font-bold text-slate-900 flex items-center"><MdCurrencyRupee className="text-emerald-600 text-sm font-black" />{v.pricePerHour}</span></span>
                          <span>Seating: <span className="font-bold text-slate-900">{v.capacity} pax</span></span>
                        </div>

                        <button
                          onClick={() => navigate(`/venues/${v.id}`)}
                          className="w-full mt-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs rounded-xl shadow-sm shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] text-center cursor-pointer"
                        >
                          View Details & Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Bookings */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">My Venue Bookings</h2>
              <p className="text-slate-500 text-sm mt-0.5">Manage your reservations, view booking details, or cancel upcoming slots.</p>
            </div>

            {bookings.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center shadow-sm">
                <span className="text-4xl mb-4 inline-block">📅</span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No bookings found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">Explore our premium venues and start booking slots for your meetings, parties, or weddings.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                    {(() => {
                      const todayStr = new Date().toLocaleDateString('en-CA');
                      const isPast = booking.bookingDate < todayStr;
                      const displayStatus = isPast && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'pending')
                        ? 'completed'
                        : booking.bookingStatus;

                      return (
                        <>
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(displayStatus)}`}>
                                {displayStatus}
                              </span>
                              <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                <MdQrCode /> {booking.bookingCode}
                              </span>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 mb-3">{booking.venue?.venueName}</h3>

                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1.5"><MdCalendarToday className="text-primary" /> {booking.bookingDate}</span>
                              <span className="flex items-center gap-1.5"><MdOutlineAccessTime className="text-secondary" /> {formatTime12Hour(booking.startTime)} - {formatTime12Hour(booking.endTime)}</span>
                              <span className="flex items-center gap-1.5"><MdCurrencyRupee className="text-emerald-600 font-bold text-sm" />{Number(booking.totalAmount).toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          <div className="w-full md:w-auto flex flex-row md:flex-col gap-2 self-stretch justify-end">
                            {!isPast && (booking.bookingStatus === 'pending' || booking.bookingStatus === 'confirmed') && (
                              <button
                                onClick={() => setCancelConfirmId(booking.id)}
                                className="px-5 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors w-full md:w-auto cursor-pointer"
                              >
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Spending Insights */}
        {activeTab === 'spending' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Spending Analysis</h2>
              <p className="text-slate-500 text-sm mt-0.5">Interactive analysis of your overall platform reservation expenditures.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between bg-primary/5">
              <span className="text-[10px] uppercase font-bold text-primary block mb-1">My Total Spending on Bookings</span>
              <span className="text-3xl font-black text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500 mt-2">Cumulative cost spent on host confirmations</span>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200/60">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Scheduled</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time Slot</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cost Paid</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {confirmedBookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                          No spent transactions registered yet.
                        </td>
                      </tr>
                    ) : (
                      confirmedBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/40">
                          <td className="px-6 py-4 text-xs font-semibold text-slate-900">
                            {b.venue?.venueName}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {b.bookingDate}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                            {formatTime12Hour(b.startTime)} - {formatTime12Hour(b.endTime)}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-900 font-bold">
                            ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase">Paid</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Sleek Custom Confirm Modal Popup for Cancellation */}
      {cancelConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop Blur Overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setCancelConfirmId(null)}
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 transform scale-100 transition-all animate-scale-up">
            <div className="flex flex-col items-center text-center">
              {/* Warning Icon Banner */}
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-2">Cancel Booking?</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Are you sure you want to cancel this booking? This reserved slot will immediately become available for other guests, and this action cannot be undone.
              </p>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setCancelConfirmId(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancelBooking(cancelConfirmId)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-all shadow-md shadow-rose-200 cursor-pointer animate-pulse"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
