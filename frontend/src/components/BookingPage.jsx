import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { bookVenue, checkAvailability } from '../services/bookingApi';
import { fetchVenueById } from '../services/venueApi';

const BookingPage = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [venue, setVenue] = useState(location.state?.venue || null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [availabilityData, setAvailabilityData] = useState(null); // { available_slots, current_capacity, max_capacity }
  const [ticketsCount, setTicketsCount] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!venue && id) {
      fetchVenueById(id).then(setVenue).catch(err => setError('Failed to load venue'));
    }
  }, [venue, id]);

  if (!venue) {
    return <div className="text-center py-20 text-slate-500">Loading booking form...</div>;
  }

  const isDateOnly = venue.inventory_type === 'entire_venue';

  const handleCheck = async () => {
    if (!startTime || !endTime) {
      setError('Please select both start and end times.');
      return;
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) {
      setError('End time must be after start time.');
      return;
    }

    setError('');
    setChecking(true);
    setAvailabilityData(null);
    try {
      const res = await checkAvailability(venue.id, start.toISOString(), end.toISOString());
      setAvailabilityData(res);
      if (res.available_slots <= 0) {
        setError(isDateOnly ? 'Venue is already booked for this period.' : 'Not enough capacity for this period.');
      }
    } catch (err) {
      setError(err.message || 'Failed to check availability');
    } finally {
      setChecking(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!availabilityData || availabilityData.available_slots <= 0) return;
    
    setError('');
    setLoading(true);
    try {
      const payload = {
        venue_id: venue.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        tickets_count: isDateOnly ? 1 : ticketsCount
      };

      await bookVenue(payload);
      showToast('Booking confirmed & Payment processed!');
      navigate(-1);
    } catch (err) {
      setError(err.message || 'Failed to book venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden animate-[slide-up_0.3s_ease-out] border border-slate-800">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-800 px-6 py-5">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-slate-100">Book Venue</h2>
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <p className="text-slate-400 text-sm">Booking for <span className="font-semibold text-slate-200">{venue.name}</span></p>
        </div>

        <form onSubmit={handleBook} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800/50 text-red-400 rounded-lg text-sm flex items-start">
              <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
                <input 
                  type="datetime-local"
                  required
                  className="input-field"
                  value={startTime}
                  onChange={e => { setStartTime(e.target.value); setAvailabilityData(null); }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">End Time</label>
                <input 
                  type="datetime-local"
                  required
                  className="input-field"
                  value={endTime}
                  onChange={e => { setEndTime(e.target.value); setAvailabilityData(null); }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="button" 
                onClick={handleCheck}
                disabled={checking || !startTime || !endTime}
                className="w-full btn-secondary flex justify-center items-center"
              >
                {checking ? 'Checking...' : 'Check Availability'}
              </button>
            </div>

            {availabilityData && availabilityData.available_slots > 0 && (
              <div className="border-t border-slate-800 pt-6 animate-fade-in">
                {isDateOnly ? (
                  <div className="space-y-4">
                    <div className="p-5 bg-indigo-900/30 text-indigo-300 rounded-xl border border-indigo-800/50 flex flex-col justify-center items-center">
                      <svg className="w-8 h-8 mb-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      <span className="font-bold text-lg mb-1">Venue Available!</span>
                      <p className="text-sm text-indigo-400 text-center max-w-sm">This venue is available for your selected dates.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-900/30 text-indigo-300 rounded-xl border border-indigo-800/50 flex items-center justify-between">
                      <span className="font-medium">Available Capacity:</span>
                      <span className="text-xl font-bold">{availabilityData.available_slots} people</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Number of People</label>
                      <input 
                        type="number" min="1" 
                        max={availabilityData.available_slots} 
                        className="input-field" 
                        required
                        value={ticketsCount} 
                        onChange={e => setTicketsCount(parseInt(e.target.value))} 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3 border-t border-slate-800 pt-5">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !availabilityData || availabilityData.available_slots <= 0} 
              className="btn-primary min-w-[120px]"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
