import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyProfile, updateMyProfile } from '../services/authApi';
import { fetchMyBookings } from '../services/venueApi';
import { fetchMyVenues } from '../services/venueApi';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userProfile = await fetchMyProfile();
        setProfile(userProfile);
        setFormData({ username: userProfile.username, password: '' });

        const userBookings = await fetchMyBookings();
        setBookings(userBookings);

        if (userProfile.role === 'PARTNER') {
          const userVenues = await fetchMyVenues();
          setVenues(userVenues);
        } else {
          // Fetch AI Recommendations for customers
          const { fetchWithAuth, getFetchOptions, API_BASE } = await import('../services/apiClient');
          const recRes = await fetchWithAuth(`${API_BASE}/venues/my-recommendations`, getFetchOptions());
          if (recRes.ok) {
            setRecommendations(await recRes.json());
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      const payload = {};
      if (formData.username !== profile.username) payload.username = formData.username;
      if (formData.password) payload.password = formData.password;

      if (Object.keys(payload).length > 0) {
        const updatedUser = await updateMyProfile(payload);
        setProfile(updatedUser);
        setUpdateSuccess(true);
        setFormData({ ...formData, password: '' });
        setIsEditing(false);
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      setUpdateError(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-slate-400 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-800/50 p-6 rounded-2xl max-w-lg w-full text-center">
          <p className="text-red-400 font-medium">{error || 'Unable to load profile'}</p>
        </div>
      </div>
    );
  }

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border-4 border-slate-900">
            {getInitials(profile.username)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 capitalize">{profile.username}</h1>
            <div className="flex items-center mt-2 space-x-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${profile.role === 'PARTNER' ? 'bg-amber-900/40 text-amber-400 border border-amber-700/50' : profile.role === 'SUPER_ADMIN' ? 'bg-red-900/40 text-red-400 border border-red-700/50' : 'bg-indigo-900/40 text-indigo-400 border border-indigo-700/50'}`}>
                {profile.role.replace('_', ' ')}
              </span>
              <p className="text-sm text-slate-400">Member since 2026</p>
            </div>
          </div>
        </div>
        {profile.role === 'PARTNER' && (
          <button onClick={() => navigate('/partner')} className="btn-primary flex items-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Go to Dashboard
          </button>
        )}
      </div>

      <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto">
          <button onClick={() => setActiveTab('profile')} className={`px-8 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === 'profile' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'}`}>
            Account Details
          </button>
          <button onClick={() => setActiveTab('bookings')} className={`px-8 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === 'bookings' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'}`}>
            Booking History ({bookings.length})
          </button>
          {profile.role === 'CUSTOMER' && (
            <button onClick={() => setActiveTab('recommendations')} className={`px-8 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === 'recommendations' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'}`}>
              AI Recommendations ✨
            </button>
          )}
        </div>

        <div className="p-8">
          {/* Profile Details Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-100">Personal Information</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                    Edit Profile
                  </button>
                )}
              </div>

              {updateSuccess && (
                <div className="mb-6 p-4 bg-green-900/20 border border-green-800/50 rounded-xl text-green-400 text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Profile updated successfully!
                </div>
              )}

              {updateError && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 text-sm">
                  {updateError}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-5 bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
                    <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">New Password (leave blank to keep current)</label>
                    <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="input-field" placeholder="••••••••" minLength="8" />
                  </div>
                  <div className="flex items-center space-x-3 pt-2">
                    <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)]">Save Changes</button>
                    <button type="button" onClick={() => { setIsEditing(false); setFormData({ username: profile.username, password: '' }); }} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors text-sm">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 pb-6 border-b border-slate-800/50">
                    <div className="col-span-1 text-slate-500 font-medium">Username</div>
                    <div className="col-span-2 text-slate-200">{profile.username}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pb-6 border-b border-slate-800/50">
                    <div className="col-span-1 text-slate-500 font-medium">Account ID</div>
                    <div className="col-span-2 text-slate-200 font-mono text-sm">{profile.id}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pb-6">
                    <div className="col-span-1 text-slate-500 font-medium">Password</div>
                    <div className="col-span-2 text-slate-200">••••••••</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-6">Your Reservations</h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-16 bg-slate-950/30 rounded-2xl border border-dashed border-slate-800">
                  <svg className="w-16 h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <h3 className="text-lg font-bold text-slate-300">No bookings yet</h3>
                  <p className="text-slate-500 mt-2 mb-6">You haven't made any venue reservations.</p>
                  <button onClick={() => navigate('/')} className="btn-primary shadow-[0_0_15px_rgba(99,102,241,0.3)]">Explore Venues</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookings.map(booking => {
                    const venue = booking.venue;
                    const start = new Date(booking.start_time);
                    const end = new Date(booking.end_time);
                    const isUpcoming = start > new Date();

                    return (
                      <div key={booking.id} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-slate-100 text-lg group-hover:text-indigo-400 transition-colors">
                              {venue ? venue.name : `Venue #${booking.venue_id}`}
                            </h3>
                            {venue && <p className="text-sm text-slate-500 mt-1">{venue.location}</p>}
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${booking.status === 'CONFIRMED' ? 'bg-green-900/30 text-green-400 border-green-800/50' : booking.status === 'CANCELLED' ? 'bg-red-900/30 text-red-400 border-red-800/50' : 'bg-amber-900/30 text-amber-400 border-amber-800/50'}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4 bg-slate-900 rounded-xl p-4 border border-slate-800/50">
                          <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-indigo-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className="text-slate-300">{start.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 text-indigo-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span className="text-slate-300">{start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          {booking.tickets_count > 1 && (
                            <div className="flex items-center text-sm">
                              <svg className="w-4 h-4 text-indigo-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                              <span className="text-slate-300">{booking.tickets_count} People</span>
                            </div>
                          )}
                        </div>

                        {venue && (
                          <button onClick={() => navigate(`/venue/${venue.id}`)} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition-colors border border-slate-700/50">
                            View Venue Details
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Recommended For You
              </h2>
              
              {recommendations.length === 0 ? (
                <div className="text-center py-16 bg-slate-950/30 rounded-2xl border border-dashed border-slate-800">
                  <p className="text-slate-500">Book more venues to get personalized AI recommendations!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map(venue => (
                    <div key={venue.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-colors cursor-pointer" onClick={() => navigate(`/venue/${venue.id}`)}>
                      <div className="h-40 bg-slate-800 relative">
                        {venue.photos && venue.photos[0] ? (
                          <img src={venue.photos[0]} alt={venue.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">No Image</div>
                        )}
                        <div className="absolute top-2 right-2 bg-indigo-600/90 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">
                          AI Match
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-100 text-lg mb-1 truncate">{venue.name}</h3>
                        <p className="text-sm text-slate-400 mb-3 truncate">{venue.location}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-indigo-400 font-bold">${venue.price_per_hour}/hr</span>
                          <span className="text-xs text-slate-500 px-2 py-1 bg-slate-800 rounded-md">Cap: {venue.capacity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
