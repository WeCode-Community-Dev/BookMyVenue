import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Search, ShieldAlert, CheckCircle, Eye, Trash2, Edit, Star, X, 
  MapPin, Users, Award, Calendar
} from 'lucide-react';
import type { Venue, Booking } from '../data/mockStore';

interface VenuesViewProps {
  initialTab?: 'all' | 'pending' | 'blocked';
  onSelectBooking: (booking: Booking) => void;
}

export const VenuesView: React.FC<VenuesViewProps> = ({ initialTab = 'all', onSelectBooking }) => {
  const { 
    venues, bookings, apiState,
    approveVenue, rejectVenue, blockVenue, unblockVenue, 
    toggleFeaturedVenue, editVenueDetails, deleteVenue,
    loadMoreVenues, hasMoreVenues 
  } = useAdmin();

  const activeTab = initialTab;
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');

  // Modal & Edit states
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Venue>>({});
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Format 24h time string (e.g. "15:00:00") to 12h dot AM/PM (e.g. "3.00 PM")
  const formatTimeToAMPM = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}.${minutesStr} ${ampm}`;
  };

  const handleApprove = async (venueId: string) => {
    try {
      await approveVenue(venueId);
      if (selectedVenue && selectedVenue.id === venueId) {
        setSelectedVenue(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve venue.");
    }
  };

  const handleReject = async (venueId: string) => {
    const reason = prompt("Please enter the reason for rejecting this venue listing:");
    if (reason === null) return;
    const trimmed = reason.trim();
    if (!trimmed) {
      alert("A rejection reason is required.");
      return;
    }
    try {
      await rejectVenue(venueId, trimmed);
      if (selectedVenue && selectedVenue.id === venueId) {
        setSelectedVenue(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject venue.");
    }
  };

  const handleBlock = async (venueId: string) => {
    const reason = prompt("Please enter the reason for suspending/blocking this venue listing:");
    if (reason === null) return;
    const trimmed = reason.trim();
    if (!trimmed) {
      alert("A blocking reason is required.");
      return;
    }
    try {
      await blockVenue(venueId, trimmed);
      if (selectedVenue && selectedVenue.id === venueId) {
        setSelectedVenue(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to block venue.");
    }
  };

  const handleRestore = async (venueId: string) => {
    try {
      await unblockVenue(venueId);
      if (selectedVenue && selectedVenue.id === venueId) {
        setSelectedVenue(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to restore venue.");
    }
  };


  // Scroll Listener for Infinite Pagination
  useEffect(() => {
    const handleScroll = () => {
      if (apiState.venues.loading || !hasMoreVenues) {
        return;
      }
      
      const threshold = 150; // pixels from the bottom
      const totalHeight = document.documentElement.offsetHeight;
      const scrollPosition = window.innerHeight + window.scrollY;
      
      if (totalHeight - scrollPosition < threshold) {
        loadMoreVenues();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [apiState.venues.loading, hasMoreVenues, loadMoreVenues]);


  // Filter Venues based on search, capacity, and activeTab status
  const getFilteredVenues = () => {
    let list = venues;
    
    if (activeTab === 'all') {
      list = venues;
    } else if (activeTab === 'pending') {
      list = venues.filter(v => v.verification_status === 'pending');
    } else if (activeTab === 'blocked') {
      list = venues.filter(v => v.verification_status === 'rejected' || v.verification_status === 'suspended');
    }

    return list.filter(v => {
      const matchesSearch = 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCapacity = true;
      if (capacityFilter === 'small') matchesCapacity = v.capacity <= 150;
      else if (capacityFilter === 'medium') matchesCapacity = v.capacity > 150 && v.capacity <= 400;
      else if (capacityFilter === 'large') matchesCapacity = v.capacity > 400;

      let matchesPrice = true;
      if (priceFilter === 'budget') matchesPrice = v.pricePerDay <= 40000;
      else if (priceFilter === 'mid') matchesPrice = v.pricePerDay > 40000 && v.pricePerDay <= 80000;
      else if (priceFilter === 'premium') matchesPrice = v.pricePerDay > 80000;

      return matchesSearch && matchesCapacity && matchesPrice;
    });
  };

  const filteredVenues = getFilteredVenues();

  // Get Venue Booking History
  const getVenueBookings = (venueId: string) => {
    return bookings.filter(b => b.venueId === venueId);
  };

  // Handle Edit Action
  const startEditing = (venue: Venue) => {
    setEditForm({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity,
      pricePerDay: venue.pricePerDay,
      amenities: [...venue.amenities]
    });
    setIsEditing(true);
  };

  const saveEdit = (venueId: string) => {
    editVenueDetails(venueId, editForm);
    
    // Update active modal view with newly saved details
    if (selectedVenue) {
      setSelectedVenue(prev => prev ? { ...prev, ...editForm } as Venue : null);
    }
    
    setIsEditing(false);
  };

  const addAmenity = (text: string) => {
    if (text.trim() && editForm.amenities) {
      if (!editForm.amenities.includes(text.trim())) {
        setEditForm(prev => ({
          ...prev,
          amenities: [...(prev.amenities || []), text.trim()]
        }));
      }
    }
  };

  const removeAmenity = (idx: number) => {
    if (editForm.amenities) {
      setEditForm(prev => ({
        ...prev,
        amenities: prev.amenities?.filter((_, i) => i !== idx)
      }));
    }
  };

  const renderVenueSkeletonCards = () => (
    Array.from({ length: 6 }).map((_, idx) => (
      <div key={`venue-loading-${idx}`} className="glass-panel border border-slate-850 rounded-xl overflow-hidden flex flex-col">
        <div className="h-44 shimmer-surface" />
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 border-b border-slate-900 pb-3">
            <div className="space-y-2">
              <div className="h-2 w-12 rounded shimmer-surface" />
              <div className="h-3 w-24 rounded shimmer-surface" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-12 rounded shimmer-surface" />
              <div className="h-3 w-20 rounded shimmer-surface" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-2 w-14 rounded shimmer-surface" />
              <div className="h-4 w-28 rounded shimmer-surface" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-14 rounded shimmer-surface" />
              <div className="h-3 w-20 rounded shimmer-surface" />
            </div>
          </div>
          <div className="flex gap-2 pt-3 border-t border-slate-900">
            <div className="h-8 flex-1 rounded-lg shimmer-surface" />
            <div className="h-8 w-20 rounded-lg shimmer-surface" />
          </div>
        </div>
      </div>
    ))
  );

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Venue Management</h1>
          <p className="text-slate-400 mt-1">Review event spaces, approve pending listings, and moderate terms.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-900">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search venue names, locations, owners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 focus:border-primary rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Capacity filter */}
          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-xs rounded-lg px-3 py-2 outline-none transition"
          >
            <option value="all">Any Capacity</option>
            <option value="small">Small (&le; 150 guests)</option>
            <option value="medium">Medium (151 - 400 guests)</option>
            <option value="large">Large (&gt; 400 guests)</option>
          </select>

          {/* Pricing filter */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 focus:border-primary text-slate-300 text-xs rounded-lg px-3 py-2 outline-none transition"
          >
            <option value="all">Any Price</option>
            <option value="budget">Budget (&le; ₹40,000/day)</option>
            <option value="mid">Mid-range (₹40,001 - ₹80,000)</option>
            <option value="premium">Premium (&gt; ₹80,000/day)</option>
          </select>
        </div>
      </div>

      {/* Grid of venue cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiState.venues.loading && venues.length === 0 ? (
          renderVenueSkeletonCards()
        ) : filteredVenues.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-950/20 rounded-xl border border-slate-900 border-dashed">
            {apiState.venues.error ? `API sync failed: ${apiState.venues.error}` : 'No venues listed yet.'}
          </div>
        ) : (
          <>
            {filteredVenues.map(venue => (
            <div 
              key={venue.id} 
              className={`glass-panel border rounded-xl overflow-hidden flex flex-col hover:scale-[1.01] transition duration-300 relative group ${
                venue.featured ? 'border-primary/40 shadow-[0_0_15px_rgba(170,59,255,0.05)]' : 'border-slate-850'
              }`}
            >
              {/* Featured Ribbon */}
              {venue.featured && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-primary to-accent text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider z-10 flex items-center gap-1 shadow-sm">
                  <Award className="w-3 h-3" />
                  Featured Space
                </span>
              )}

              {/* Status Badge */}
              <span className={`absolute top-3 right-3 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider z-10 ${
                venue.verification_status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                venue.verification_status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {venue.verification_status}
              </span>

              {/* Thumbnail */}
              <div className="h-44 overflow-hidden relative bg-slate-950">
                <img 
                  src={venue.photos[0]} 
                  alt={venue.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-white text-lg font-bold block leading-tight">{venue.name}</span>
                  <span className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {venue.location}
                  </span>
                </div>
              </div>

              {/* Specs & Owner */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-900 pb-3">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[8px] font-semibold">Owner</span>
                    <span className="text-slate-200 block font-medium mt-0.5 line-clamp-1">{venue.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[8px] font-semibold">Specs</span>
                    <span className="text-slate-200 block font-medium mt-0.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-accent" />
                      {venue.capacity} Pax
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-500 block text-[8px] uppercase font-semibold">Rent Fee</span>
                    <span className="text-lg font-bold text-white block">{formatCurrency(venue.pricePerDay)}<span className="text-[10px] text-slate-400 font-normal">/day</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[8px] uppercase font-semibold">Analytics</span>
                    <span className="text-slate-200 block font-bold mt-0.5">{venue.bookingCount} bookings</span>
                  </div>
                </div>

                {/* Control Drawer */}
                <div className="flex gap-2 mt-2 pt-3 border-t border-slate-900">
                  <button
                    onClick={() => { setSelectedVenue(venue); setActivePhotoIdx(0); }}
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs py-2 rounded-lg border border-slate-800 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </button>

                  {(venue.verification_status === 'pending') ? (
                    <div className="flex gap-1.5 w-2/3">
                      <button
                        onClick={() => handleReject(venue.id)}
                        className="flex-1 font-bold text-xs bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 py-2 rounded-lg transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(venue.id)}
                        className="flex-1 font-bold text-xs bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 py-2 rounded-lg transition"
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditing(venue)}
                        className="p-2 rounded bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition"
                        title="Edit Venue"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {(venue.verification_status === 'approved') ? (
                        <button
                          onClick={() => handleBlock(venue.id)}
                          className="p-2 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition"
                          title="Block Venue"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(venue.id)}
                          className="p-2 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 transition"
                          title="Restore Venue"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteVenue(venue.id)}
                        className="p-2 rounded bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-900 transition"
                        title="Delete Space"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator at Bottom of Grid */}
          {apiState.venues.loading && (
            <div className="col-span-full py-10 flex flex-col justify-center items-center gap-3 text-slate-500">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary animate-pulse">Loading more spaces</span>
            </div>
          )}
          </>
        )}
      </div>

      {/* VENUE DETAILS & AUDIT MODAL */}
      {selectedVenue && (
        <div className="modal-overlay">
          <div className="glass-panel border border-slate-800 rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto space-y-6 p-6 relative">
            <button 
              onClick={() => { setSelectedVenue(null); setIsEditing(false); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 hover:bg-slate-950 rounded-full transition z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {isEditing ? (
              /* VENUE INLINE EDIT FORM */
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Edit Venue Details: {selectedVenue.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Venue Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Location Address</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Capacity (Guests)</label>
                    <input
                      type="number"
                      value={editForm.capacity}
                      onChange={(e) => setEditForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-semibold uppercase">Pricing Rent Per Day (₹)</label>
                    <input
                      type="number"
                      value={editForm.pricePerDay}
                      onChange={(e) => setEditForm(prev => ({ ...prev, pricePerDay: Number(e.target.value) }))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {/* Amenities editing */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold uppercase">Amenities & Features</label>
                  <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950/80 rounded-lg border border-slate-900">
                    {editForm.amenities?.map((amenity, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 text-slate-300 pl-2.5 pr-1.5 py-1 rounded-full font-medium">
                        {amenity}
                        <button 
                          onClick={() => removeAmenity(idx)}
                          className="hover:bg-slate-850 p-0.5 rounded-full text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {editForm.amenities?.length === 0 && <span className="text-xs text-slate-500">No amenities listed yet.</span>}
                  </div>
                  
                  {/* Add amenity input */}
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="Add amenity (e.g. Swimming Pool)..."
                      id="new-amenity-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addAmenity((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-primary outline-none"
                    />
                    <button 
                      onClick={() => {
                        const input = document.getElementById('new-amenity-input') as HTMLInputElement;
                        if (input) {
                          addAmenity(input.value);
                          input.value = '';
                        }
                      }}
                      className="bg-primary hover:bg-primary-hover px-3 py-1.5 text-xs font-bold text-white rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-900">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-900 text-slate-400 hover:text-white border border-slate-850 text-xs font-bold rounded-lg transition"
                  >
                    Cancel Edit
                  </button>
                  <button
                    onClick={() => saveEdit(selectedVenue.id)}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              /* VENUE DETAILS VISUAL INSPECTION */
              <div className="space-y-6">
                {/* Photo Carousel & Info header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  
                  {/* Photo Display */}
                  <div className="space-y-2">
                    <div className="h-64 rounded-lg bg-slate-950 overflow-hidden border border-slate-900 relative">
                      <img 
                        src={selectedVenue.photos[activePhotoIdx]} 
                        alt={selectedVenue.name} 
                        className="w-full h-full object-cover" 
                      />
                      {selectedVenue.photos.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                          {activePhotoIdx + 1} / {selectedVenue.photos.length}
                        </div>
                      )}
                    </div>
                    {selectedVenue.photos.length > 1 && (
                      <div className="flex gap-2">
                        {selectedVenue.photos.map((ph, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhotoIdx(idx)}
                            className={`w-14 h-10 rounded overflow-hidden border-2 transition ${
                              idx === activePhotoIdx ? 'border-primary' : 'border-slate-900 hover:border-slate-800'
                            }`}
                          >
                            <img src={ph} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Header Metrics */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 font-mono">
                        <span>ID: {selectedVenue.id}</span>
                        {selectedVenue.created_at && (
                          <span className="text-slate-550 font-sans font-semibold">
                            Registered: {new Date(selectedVenue.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-white mt-0.5">{selectedVenue.name}</h2>
                      <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {selectedVenue.location}
                      </p>
                    </div>


                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                      <div>
                        <span className="text-slate-500 block uppercase font-semibold text-[8px]">Owner representative</span>
                        <span className="text-slate-200 block font-bold text-sm mt-0.5">{selectedVenue.ownerName}</span>
                        <span className="text-slate-500 text-[10px]">ID: {selectedVenue.ownerId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-semibold text-[8px]">Daily rental price</span>
                        <span className="text-primary block font-bold text-lg">{formatCurrency(selectedVenue.pricePerDay)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-semibold text-[8px]">Maximum Capacity</span>
                        <span className="text-slate-200 block font-bold text-sm mt-0.5">{selectedVenue.capacity} Pax</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block uppercase font-semibold text-[8px]">Platform Stats</span>
                        <span className="text-emerald-400 block font-bold mt-0.5 text-xs">{selectedVenue.bookingCount} bookings ({formatCurrency(selectedVenue.revenue)})</span>
                      </div>
                    </div>

                    {/* Featured toggle & approval controls in details screen */}
                    <div className="flex gap-2 items-center flex-wrap pt-2">
                      <button
                        onClick={() => toggleFeaturedVenue(selectedVenue.id)}
                        className={`flex items-center gap-1.5 text-xs px-3.5 py-2 font-bold rounded-lg border transition ${
                          selectedVenue.featured 
                            ? 'bg-primary/20 hover:bg-primary/30 border-primary text-white' 
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Award className="w-4 h-4 text-amber-400" />
                        {selectedVenue.featured ? 'Featured Space' : 'Mark Featured'}
                      </button>

                      {(selectedVenue.verification_status === 'pending') && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReject(selectedVenue.id)}
                            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-xs px-4 py-2 font-bold rounded-lg transition"
                          >
                            Reject Space
                          </button>
                          <button
                            onClick={() => handleApprove(selectedVenue.id)}
                            className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 text-xs px-4 py-2 font-bold rounded-lg transition"
                          >
                            Approve Listing
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description, Category and Badges */}
                <div className="space-y-3 bg-slate-950/40 p-4.5 rounded-xl border border-slate-900">
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <div className="flex gap-2">
                      {selectedVenue.category && (
                        <span className="bg-primary/20 text-primary border border-primary/25 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {selectedVenue.category.replace('_', ' ')}
                        </span>
                      )}
                      {selectedVenue.venue_size && (
                        <span className="bg-slate-900 text-slate-350 border border-slate-850/60 px-2.5 py-1 rounded-md text-[10px] font-bold">
                          {selectedVenue.venue_size.toLocaleString()} Sq. Ft.
                        </span>
                      )}
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                      selectedVenue.instant_booking 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {selectedVenue.instant_booking ? '⚡ Instant Booking Enabled' : '⌛ Standard Approval Flow'}
                    </span>
                  </div>

                  {selectedVenue.description && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">About the Venue</span>
                      <p className="text-slate-300 text-xs leading-relaxed font-sans">{selectedVenue.description}</p>
                    </div>
                  )}

                  {selectedVenue.virtual_tour_url && (
                    <div className="pt-2 border-t border-slate-900/60 flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Virtual Tour:</span>
                      <a 
                        href={selectedVenue.virtual_tour_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-cyan-400 hover:text-cyan-300 hover:underline truncate font-mono text-[11px]"
                      >
                        {selectedVenue.virtual_tour_url}
                      </a>
                    </div>
                  )}
                </div>


                {/* Amenities Section */}
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">Features & Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.amenities.map((am, idx) => (
                      <span key={idx} className="bg-slate-950 border border-slate-900 text-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Slots & Services Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-900 pt-6">
                  
                  {/* Slots Available */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Booking Slots & Pricing</h3>
                    {selectedVenue.slots && selectedVenue.slots.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {selectedVenue.slots.map((slot, index) => (
                          <div key={slot.id || index} className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-200 block">{slot.slot_name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {formatTimeToAMPM(slot.start_time)} - {formatTimeToAMPM(slot.end_time)}
                              </span>

                            </div>
                            <span className="text-primary font-bold text-sm">{formatCurrency(slot.price)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 py-6 text-center bg-slate-950/20 rounded-lg border border-slate-900 border-dashed">No custom slots configured.</p>
                    )}
                  </div>

                  {/* Services Available */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Registered Add-on Services</h3>
                    {selectedVenue.services && selectedVenue.services.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2.5">
                        {selectedVenue.services.map((service, index) => (
                          <div key={service.id || index} className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-200 capitalize">{service.service_name}</span>
                            <span className="text-emerald-400 font-bold">{formatCurrency(service.price)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 py-6 text-center bg-slate-950/20 rounded-lg border border-slate-900 border-dashed">No extra services offered.</p>
                    )}
                  </div>

                </div>

                {/* Booking History & Schedule Calendar */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-900 pt-6">
                  
                  {/* Calendar details */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                      <Calendar className="w-4.5 h-4.5 text-accent" />
                      <span>Availability & Schedule</span>
                    </h3>
                    
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 space-y-3 text-xs">
                      <div>
                        <span className="text-slate-500 block uppercase font-semibold text-[8px] mb-1">Standard Operating Days</span>
                        <div className="flex gap-1 flex-wrap">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => {
                            const isOpen = selectedVenue.availability.days.includes(d);
                            return (
                              <span key={d} className={`px-2 py-1 rounded text-[10px] font-bold ${
                                isOpen ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-900 text-slate-500 border border-slate-850 opacity-40'
                              }`}>
                                {d.slice(0, 3)}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 block uppercase font-semibold text-[8px] mb-1.5">Upcoming Reserved Dates</span>
                        {selectedVenue.availability.bookedDates.length === 0 ? (
                          <p className="text-slate-400 font-medium">No bookings lined up. Wide availability.</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto pr-1">
                            {selectedVenue.availability.bookedDates.map(date => (
                              <div key={date} className="p-2 bg-slate-900 border border-slate-850 rounded text-slate-300 font-semibold font-mono text-[10px] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                {date}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reviews & Ratings ledger */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                      <Star className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400" />
                      <span>Reviews & Ratings ({selectedVenue.reviews.length})</span>
                    </h3>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {selectedVenue.reviews.length === 0 ? (
                        <p className="text-xs text-slate-500 py-8 text-center bg-slate-950/20 rounded-lg border border-slate-900 border-dashed">No customer feedback available yet.</p>
                      ) : (
                        selectedVenue.reviews.map(rev => (
                          <div key={rev.id} className="p-3 bg-slate-950/40 border border-slate-900 rounded-lg text-xs space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-200">{rev.userName}</span>
                              <div className="flex items-center gap-0.5 text-yellow-400">
                                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                                <span className="font-bold text-[10px] text-white">{rev.rating}</span>
                              </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
                            <span className="text-[9px] text-slate-500 block text-right font-mono">{rev.date}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Booking History Table */}
                <div className="space-y-3 border-t border-slate-900 pt-6">
                  <h3 className="font-bold text-white text-base">Booking Ledger</h3>
                  <div className="overflow-x-auto border border-slate-900 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <tr className="bg-slate-950 text-slate-500 uppercase font-semibold text-[9px] tracking-wider border-b border-slate-900">
                        <th className="p-3">Booking ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Event Date</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                      {getVenueBookings(selectedVenue.id).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-slate-500">No booking transactions recorded.</td>
                        </tr>
                      ) : (
                        getVenueBookings(selectedVenue.id).map(b => (
                          <tr key={b.id} className="border-b border-slate-900 hover:bg-slate-900/30 transition">
                            <td className="p-3 font-mono font-bold text-slate-400">{b.id}</td>
                            <td className="p-3">
                              <span className="font-semibold text-white block">{b.customerName}</span>
                              <span className="text-[10px] text-slate-500">{b.customerEmail}</span>
                            </td>
                            <td className="p-3 text-slate-400">{b.eventDate}</td>
                            <td className="p-3 font-bold text-white">{formatCurrency(b.amount)}</td>
                            <td className="p-3 font-medium uppercase tracking-wider text-[9px]">
                              <span className={`px-1.5 py-0.2 rounded font-bold ${
                                b.paymentStatus === 'paid' ? 'text-emerald-400 bg-emerald-500/10' :
                                b.paymentStatus === 'refunded' ? 'text-amber-400 bg-amber-500/10' :
                                'text-red-400 bg-red-500/10'
                              }`}>{b.paymentStatus}</span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => { onSelectBooking(b); setSelectedVenue(null); }}
                                className="text-primary hover:text-white font-bold text-[10px]"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </table>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center border-t border-slate-900 pt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(selectedVenue)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-850 text-xs font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Details
                    </button>
                    {(selectedVenue.verification_status === 'approved') ? (
                      <button
                        onClick={() => handleBlock(selectedVenue.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 text-xs font-bold rounded-lg transition"
                      >
                        Block Venue Listing
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(selectedVenue.id)}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 text-xs font-bold rounded-lg transition"
                      >
                        Restore Venue Listing
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => { deleteVenue(selectedVenue.id); setSelectedVenue(null); }}
                    className="px-4 py-2 bg-slate-950 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-900 text-xs font-bold rounded-lg transition"
                  >
                    Delete Listing
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
