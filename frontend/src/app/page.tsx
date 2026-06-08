"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

interface Venue {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  rating: number;
  imageUrl: string;
  description: string;
  amenities: string[];
  featured?: boolean;
}

export default function Home() {
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        
        if (user.role === 'Admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'Venue owner') {
          router.push('/owner/dashboard');
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    window.location.reload();
  };

  // Booking Modal State
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingHours, setBookingHours] = useState(4);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  const fetchVenues = async (query = "") => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.get(`/venues?search=${encodeURIComponent(query)}`);
      setVenues(response.data);
      setBackendStatus("connected");
    } catch (err: any) {
      console.error("Error communicating with backend:", err);
      setBackendStatus("disconnected");
      setErrorMsg("Failed to connect to the backend server. Please make sure the NestJS server is running on port 3001.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial verification of API status and data fetch
    const checkConnection = async () => {
      try {
        await api.get("/");
        setBackendStatus("connected");
      } catch (e) {
        setBackendStatus("disconnected");
      }
    };
    checkConnection();
    fetchVenues();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVenues(search);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchVenues("");
  };

  const openBookingModal = (venue: Venue) => {
    setSelectedVenue(venue);
    setBookingSuccess(false);
    setCustomerName("");
    setCustomerEmail("");
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
    setBookingHours(4);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBooking(true);
    
    // Simulate API booking submit delay
    setTimeout(() => {
      setSubmittingBooking(false);
      setBookingSuccess(true);
    }, 1200);
  };

  // Get distinct venue types from the retrieved venues
  const venueTypes = ["All", ...Array.from(new Set(venues.map((v) => v.type)))];

  // Client-side filter based on selected type tab
  const filteredVenues = selectedType === "All" 
    ? venues 
    : venues.filter((v) => v.type === selectedType);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div> */}
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">BookMyVenue</span>
              {/* <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-slate-400">v1.0</span> */}
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="flex items-center gap-2">
            {/* {backendStatus === "loading" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Checking Connection...
                </span>
            )}
            {backendStatus === "connected" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400 animate-ping"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute"></span>
                Backend Online (Port 3001)
              </span>
            )}
            {backendStatus === "disconnected" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Backend Offline
              </span>
            )}  */}
          
          {/* <div className="flex items-center gap-2"></div> */}
            {isClient && currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === 'User' ? (
                  <>
                    <Link 
                      href="/profile" 
                      className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Profile
                    </Link>
                    <Link 
                      href="/bookings" 
                      className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Bookings
                    </Link>
                  </>
                ) : null}

                
                <button 
                  onClick={handleLogout}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm transition-all duration-200 px-4 py-2 rounded-xl cursor-pointer border border-rose-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200 px-4 py-2 rounded-xl cursor-pointer"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:shadow-indigo-100 cursor-pointer"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find the Perfect Venue <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">For Your Next Event</span>
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-10 w-full max-w-2xl flex flex-col sm:flex-row gap-3 bg-white/10 p-2 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl">
            <div className="flex-1 flex items-center px-3 relative">
              <svg className="w-5 h-5 text-slate-400 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, location, or type..."
                value={search}
                onChange={handleSearchChange}
                className="w-full bg-transparent border-0 text-white placeholder-slate-400 focus:outline-none focus:ring-0 text-base py-2"
              />
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-900/30 transition-all active:scale-[0.98] sm:w-auto"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Connection Error Message Banner */}
        {/* {backendStatus === "disconnected" && (
          <div className="mb-10 bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-2xl shadow-sm">
            <div className="flex gap-3">
              <div className="text-rose-600 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-800">Connection Error</h3>
                <p className="mt-1 text-sm text-rose-700 leading-relaxed">
                  The frontend is configured correctly, but we cannot reach the backend API at <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">http://localhost:3001</code>.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-rose-600 font-medium">
                  <span>How to fix:</span>
                  <ol className="list-decimal pl-4 flex flex-col sm:flex-row sm:gap-4">
                    <li>Open a terminal inside the <code className="font-mono bg-rose-100 px-1 py-0.2 rounded">backend</code> directory</li>
                    <li>Run <code className="font-mono bg-rose-100 px-1 py-0.2 rounded">npm run start:dev</code></li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* Categories Tab navigation */}
        {venues.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Available Venues</h2>
              <p className="text-sm text-slate-500 mt-1">Showing {filteredVenues.length} spaces matching your criteria</p>
            </div>
            
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
              {venueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedType === type
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Retrieving venue listing...</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center px-4">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 13.5a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Venues Found</h3>
            <p className="mt-2 text-slate-500 max-w-sm">We couldn't find any venues matching your search. Try adjusting your query or resetting filters.</p>
            <button
              onClick={handleClearSearch}
              className="mt-6 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          /* Venues Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => (
              <article
                key={venue.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm"
              >
                {/* Image Section */}
                <div className="h-56 relative overflow-hidden bg-slate-100">
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Glassmorphic tags over image */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-slate-900/60 backdrop-blur-md border border-white/20">
                      {venue.type}
                    </span>
                    {venue.featured && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold text-indigo-100 bg-indigo-600/80 backdrop-blur-md border border-indigo-500/20">
                        ★ Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 text-slate-900 px-3 py-1.5 rounded-xl font-bold text-sm shadow-md backdrop-blur-sm">
                    ${venue.pricePerHour}<span className="text-slate-500 font-normal text-xs">/hr</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating & Location Row */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center text-xs font-semibold text-slate-500 gap-1">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {venue.location}
                      </div>
                      <div className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                        <svg className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {venue.rating}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {venue.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {venue.description}
                    </p>

                    {/* Venue Capacity Badge */}
                    <div className="mt-4 flex items-center text-xs text-slate-500 font-semibold gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Capacity: <span className="text-slate-950 font-bold">{venue.capacity} guests</span>
                    </div>

                    {/* Amenities pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {venue.amenities.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-400 px-2 py-1">
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => openBookingModal(venue)}
                      className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm duration-200 active:scale-[0.98]"
                    >
                      Book Space
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Booking Modal Overlay */}
      {selectedVenue && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-950 text-white p-6 relative">
              <button
                onClick={() => setSelectedVenue(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">Request Booking</span>
              <h3 className="text-xl font-bold mt-1">{selectedVenue.name}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {selectedVenue.location} &bull; ${selectedVenue.pricePerHour}/hr
              </p>
            </div>

            {/* Success screen */}
            {bookingSuccess ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm border border-emerald-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900">Booking Requested!</h4>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  Your booking request for <span className="font-semibold text-slate-900">{selectedVenue.name}</span> on <span className="font-semibold text-slate-900">{bookingDate}</span> ({bookingHours} hours) has been received.
                </p>
                <div className="w-full mt-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-slate-500">Contact:</span><span className="font-semibold text-slate-800">{customerName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Email:</span><span className="font-semibold text-slate-800">{customerEmail}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Total Calculated:</span><span className="font-bold text-indigo-600">${selectedVenue.pricePerHour * bookingHours}</span></div>
                </div>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm"
                >
                  Back to Listing
                </button>
              </div>
            ) : (
              /* Booking Input Form */
              <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Booking Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Duration (Hours)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="24"
                      value={bookingHours}
                      onChange={(e) => setBookingHours(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Estimate Summary Box */}
                <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide block">Estimated Total</span>
                    <span className="text-slate-500 text-xs mt-0.5 block">{bookingHours} hours @ ${selectedVenue.pricePerHour}/hr</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-700">${selectedVenue.pricePerHour * bookingHours}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedVenue(null)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm tracking-wide transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    {submittingBooking ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Booking...
                      </>
                    ) : (
                      "Confirm & Book"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      {/* <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-bold text-lg mb-2">
              <div className="bg-indigo-600 text-white p-1 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              BookMyVenue
            </div>
            
          </div>
          <div className="flex gap-6 text-sm">
            <span className="text-slate-600">Built with Next.js & NestJS</span>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
