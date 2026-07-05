import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, CalendarRange, Star, Clock, Info,
  DollarSign, Mail, ChevronRight, User, AlertCircle, Building, Search, X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Venue } from '../data/venuesData';
import InteractiveCalendar from '@/components/ui/visualize-booking';

export default function HostVenueBookings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Data States
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    // Authenticate user
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
        navigate('/');
      }
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async () => {
    if (!id) return;
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/venues/${id}`);
      if (response.ok) {
        const venueData = await response.json();
        setVenue(venueData);
      } else {
        setVenue(null);
      }

      const bookingsResponse = await fetch(`http://localhost:5000/api/venues/${id}/bookings`);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Error loading venue details or bookings:', err);
      setVenue(null);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, id]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="relative w-full min-h-screen text-white bg-[#0a0a0c] flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading bookings schedule...</h2>
        </div>
      </section>
    );
  }

  if (!venue) {
    return (
      <section className="relative w-full min-h-screen text-white bg-[#0a0a0c] flex flex-col items-center justify-center p-6">
        <Navbar />
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-3xl font-bold">Venue Not Found</h2>
          <p className="text-white/60 text-sm">We couldn't locate this listing.</p>
          <Button onClick={() => navigate('/my-venues')} className="bg-[#c5a059] hover:bg-[#b08e4d] text-black font-semibold rounded-full mt-4">
            Back to Listings
          </Button>
        </div>
      </section>
    );
  }

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const totalRevenue = activeBookings.reduce((sum, b) => sum + Number(b.totalPrice), 0);

  return (
    <section
      className="relative w-full min-h-screen text-white pb-20 overflow-y-auto text-left"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/crissxcross.png")',
        backgroundColor: '#0a0a0c'
      }}
    >
      <Navbar />

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#0a0a0c]/90 via-[#0a0a0c]/40 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a0c]/95 via-[#0a0a0c]/30 to-transparent pointer-events-none z-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40">
        
        {/* Navigation back */}
        <button
          onClick={() => navigate(`/my-venues/${id}`)}
          className="group flex items-center gap-2 text-white/50 hover:text-[#c5a059] text-sm font-semibold transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 hover:border-[#c5a059]/20 mb-8 self-start"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Venue Details
        </button>

        {/* Title and subtitle */}
        <div className="mb-10 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20">Reservations & Calendar</Badge>
              <Badge className="bg-white/5 text-white/60 border border-white/10 capitalize">{venue.bookingType} Based</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {venue.title} Bookings
            </h1>
            <p className="text-xs text-white/50 mt-1 max-w-xl">
              Inspect reservations, schedules, and active visual logs for your hosted space.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-white/40 block font-semibold uppercase tracking-wider">Bookings</span>
              <span className="text-2xl font-bold text-white mt-1 block">{bookings.length}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-white/40 block font-semibold uppercase tracking-wider">Revenue</span>
              <span className="text-2xl font-bold text-[#c5a059] mt-1 block">₹{totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Calendar and Listing Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Schedule Planner (8-cols) */}
          <div className="lg:col-span-8 bg-[#0e0e12]/80 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/5 mb-4">
              <CalendarRange className="w-4 h-4" /> Schedule Planner
            </h3>
            <InteractiveCalendar bookings={bookings} />
          </div>

          {/* Right Column: Detailed Reservations Log List (4-cols) */}
          <div className="lg:col-span-4 bg-[#0e0e12]/95 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-white/5">
              Reservations Log
            </h3>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {activeBookings.map((b) => (
                <div key={b.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-xs space-y-3.5 hover:border-[#c5a059]/30 transition-colors leading-relaxed">
                  <div className="flex justify-between items-start font-semibold gap-2">
                    <span className="text-white text-sm font-bold truncate">{b.renterName || 'Offline Date Block'}</span>
                    <span className="text-sm font-bold text-[#c5a059] flex-shrink-0">₹{b.totalPrice}</span>
                  </div>
                  <div className="text-white/40 text-[10px] font-mono leading-tight space-y-1">
                    <div>
                      <span className="text-white/30 mr-1 uppercase">Start:</span>
                      <span className="text-white/70">
                        {venue.bookingType === 'hours'
                          ? new Date(b.startDate).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : formatDate(b.startDate)
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-white/30 mr-1 uppercase">End:</span>
                      <span className="text-white/70">
                        {venue.bookingType === 'hours'
                          ? new Date(b.endDate).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : formatDate(b.endDate)
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 pb-1">
                    <span className="font-mono text-[8px] text-white/30">ID: {b.id}</span>
                    <Badge className={cn(
                      "text-[9px] border capitalize",
                      b.status === 'offline' 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}>
                      {b.status}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => navigate(`/bookings?bookingId=${b.id}`)}
                    className="w-full mt-2 bg-white/5 hover:bg-[#c5a059] hover:text-black text-white rounded-xl text-[10px] font-semibold h-8 border border-white/10 transition-all flex items-center justify-center gap-1"
                  >
                    View Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
              {activeBookings.length === 0 && (
                <div className="text-center py-12 text-white/40 italic">
                  No active reservations recorded.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Global Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#0e0e12] border border-white/10 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-xs font-medium text-white/90">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
