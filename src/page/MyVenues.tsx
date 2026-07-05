import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building, MapPin, Users, Maximize2, Plus, Edit, Trash2, X,
  CheckCircle2, AlertCircle, Sparkles, PlusCircle, Trash, Star, ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Venue } from '../data/venuesData';
import { cn } from '@/lib/utils';

export default function MyVenues() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Success/Error notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);



  // Delete Confirmation State
  const [deletingVenueId, setDeletingVenueId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login?redirect=/my-venues');
      return;
    }

    try {
      const userObj = JSON.parse(userStr);
      setCurrentUser(userObj);
      if (userObj.role !== 'venue_owner') {
        // Redirect if not owner
        navigate('/');
      }
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchHostVenues = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    let userEmail = '';
    if (userStr) {
      try {
        userEmail = JSON.parse(userStr).email;
      } catch (e) { }
    }

    try {
      const response = await fetch('http://localhost:5000/api/venues/my-venues', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      } else {
        setVenues([]);
      }
    } catch (err) {
      console.error('Failed fetching host venues from backend:', err);
      setVenues([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchHostVenues();
    }
  }, [currentUser]);

  const triggerToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };



  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!deletingVenueId) return;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/venues/${deletingVenueId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        triggerToast('Venue deleted successfully.', 'success');
      } else {
        const data = await response.json();
        triggerToast(data.message || 'Failed to delete venue.', 'error');
      }
      setDeletingVenueId(null);
      fetchHostVenues();
    } catch (err) {
      console.error('Failed to delete venue:', err);
      triggerToast('Failed to delete venue.', 'error');
      setDeletingVenueId(null);
      fetchHostVenues();
    }
  };



  return (
    <section
      className="relative w-full min-h-screen text-white pb-20 overflow-y-auto"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      <Navbar />

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-10">
          <div>
            <h1
              className="text-4xl sm:text-5xl font-normal tracking-tight text-white leading-none"
              style={{ fontFamily: "'Neue Haas Grotesk Display Pro 55 Roman', 'Helvetica Neue', Arial, sans-serif", letterSpacing: '-0.03em' }}
            >
              My{' '}
              <span className="text-[#c5a059] bg-gradient-to-r from-[#c5a059] to-[#dfba75] bg-clip-text text-transparent font-medium">
                Venues
              </span>
            </h1>
            <p className="text-white/60 text-sm mt-3 max-w-xl font-light">
              Welcome back to your host dashboard. List new event spaces, modify details, and manage booking availabilities.
            </p>
          </div>
          <Button
            onClick={() => navigate('/addvenues')}
            className="bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-full px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-[#c5a059]/10 transition-all active:scale-97"
          >
            <Plus className="w-4 h-4" />
            Add New Venue
          </Button>
        </div>



        {/* Listings Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading your listings...</p>
          </div>
        ) : venues.length === 0 ? (
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-16 text-center space-y-4 max-w-xl mx-auto">
            <Building className="w-12 h-12 text-[#c5a059] mx-auto opacity-70" />
            <h3 className="text-xl font-bold text-white">No Venues Listed Yet</h3>
            <p className="text-white/60 text-sm font-light">
              You haven't listed any venues under this account yet. Click below to add your first premium location.
            </p>
            <Button
              onClick={() => navigate('/addvenues')}
              className="bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-full px-6 mt-4"
            >
              List Your Venue Now
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="bg-[#0e0e12]/80 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between transition-all duration-300 shadow-xl backdrop-blur-md group"
              >
                {/* Visual Details */}
                <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-[75%]">
                  <div className="w-full sm:w-44 h-32 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 relative">
                    <img
                      src={venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=300'}
                      alt={venue.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />

                  </div>
                  <div className="text-center sm:text-left space-y-2.5 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-xl font-bold text-white truncate">{venue.title}</h3>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border self-center sm:self-auto",
                        venue.status === "approved"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : venue.status === "declined"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          venue.status === "approved" ? "bg-green-400" : venue.status === "declined" ? "bg-red-400" : "bg-yellow-400"
                        )} />
                        {venue.status ? venue.status.toUpperCase() : 'PENDING'}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs font-light line-clamp-2">{venue.description}</p>

                    {venue.status === 'declined' && venue.rejectionReason && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 text-left mt-2 flex items-start gap-2 max-w-xl">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold">Declined Reason: </span>
                          <span className="opacity-90">{venue.rejectionReason}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/50 pt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{venue.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>Max {venue.capacity} guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{venue.squareFeet?.toLocaleString() || 'N/A'} sq ft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rates & Action Controls */}
                <div className="flex flex-col sm:flex-row md:flex-col items-center justify-center md:items-end gap-4 border-t border-white/5 md:border-t-0 pt-4 md:pt-0 w-full md:w-[20%]">
                  <div className="text-center md:text-right">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold block">
                      {venue.bookingType === 'hours' ? 'Hourly Rate' : 'Daily Rate'}
                    </span>
                    <span className="text-2xl font-bold text-[#c5a059]">
                      ₹{venue.pricePerNight}
                      <span className="text-[10px] text-white/50 font-normal">
                        {venue.bookingType === 'hours' ? ' / hr' : ' / night'}
                      </span>
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/my-venues/${venue.id}?edit=true`)}
                      className="bg-white/5 hover:bg-white/10 text-white rounded-full w-10 h-10 p-0 border border-white/10 transition-colors flex items-center justify-center"
                      title="Edit details"
                    >
                      <Edit className="w-4 h-4 text-[#c5a059]" />
                    </Button>
                    <Button
                      onClick={() => setDeletingVenueId(venue.id)}
                      className="bg-white/5 hover:bg-red-950/20 text-white rounded-full w-10 h-10 p-0 border border-white/10 hover:border-red-500/30 transition-colors flex items-center justify-center"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                    <Button
                      onClick={() => navigate(`/my-venues/${venue.id}`)}
                      className="bg-white/5 hover:bg-white/10 text-white rounded-full w-10 h-10 p-0 border border-white/10 transition-colors flex items-center justify-center"
                      title="View Details Page"
                    >
                      <ArrowRight className="w-4 h-4 text-white/70" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deletingVenueId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingVenueId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#0e0e12] border border-white/15 rounded-3xl w-full max-w-md p-6 shadow-2xl z-10 space-y-5 text-center"
            >
              <div className="w-12 h-12 bg-red-950/20 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Delete Listing Space</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  Are you absolutely sure you want to delete this listing? This action is permanent and cannot be undone. All booked reservation histories under this space could be affected.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setDeletingVenueId(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full h-11"
                >
                  Delete Listing
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL TOAST NOTICE */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#0e0e12] border border-white/10 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
            <span className="text-xs font-medium text-white/90">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
