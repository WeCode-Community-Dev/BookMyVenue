'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

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
}

export default function OwnerVenuesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Local Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'Venue owner') {
        router.push('/');
      } else {
        setCurrentUser(user);
        fetchMyVenues();
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchMyVenues = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/venues/my');
      setVenues(response.data);
    } catch (err: any) {
      console.error('Failed to fetch venues:', err);
      setErrorMsg('Failed to load your venues. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Local Search filtering logic
  const getProcessedVenues = () => {
    if (searchQuery.trim() === '') {
      return venues;
    }
    const query = searchQuery.toLowerCase();
    return venues.filter(v => 
      (v.name || '').toLowerCase().includes(query) ||
      (v.location || '').toLowerCase().includes(query) ||
      (v.type || '').toLowerCase().includes(query)
    );
  };

  const processedVenues = getProcessedVenues();

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              BookMyVenue
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/owner/dashboard" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="/owner/venues" className="text-indigo-600 font-semibold text-sm">
                My Venues
              </Link>
              <Link href="/owner/bookings" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Bookings
              </Link>
              <Link href="/owner/profile" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Profile
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{currentUser.name}</span>
              <span className="text-xs text-slate-500 font-medium capitalize">{currentUser.role}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
              {currentUser.name.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-sm transition-all duration-200 px-4 py-2 rounded-xl border border-rose-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Venues</h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Manage your active venue listings, prices, and view listing statistics.
            </p>
          </div>

          <div>
            <Link
              href="/owner/venues/create"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all duration-200 px-5 py-3 rounded-xl shadow-md hover:shadow-lg shadow-indigo-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              List New Venue
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm w-full mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 w-full flex items-center">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by venue name, location, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-xl text-xs bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all h-[36px]"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm animate-pulse space-y-4">
                <div className="h-48 bg-slate-200 rounded-2xl w-full"></div>
                <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 rounded-xl w-full pt-4"></div>
              </div>
            ))}
          </div>
        ) : processedVenues.length === 0 ? (
          <div className="bg-white text-center py-16 px-4 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto flex flex-col items-center gap-6 mt-8">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">No Venues Listed Yet</h3>
              <p className="text-slate-500 mt-2 max-w-md text-sm">
                You haven't listed any properties under this account. Click the button below to publish your first venue!
              </p>
            </div>
            <Link
              href="/owner/venues/create"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all duration-200 px-6 py-3 rounded-xl shadow-md cursor-pointer"
            >
              List Your First Venue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processedVenues.map((venue) => (
              <article
                key={venue.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm"
              >
                {/* Image Section */}
                <Link
                  href={`/owner/venues/${venue.id}`}
                  className="h-48 relative overflow-hidden bg-slate-100 flex items-center justify-center cursor-pointer block"
                >
                  {venue.imageUrl ? (
                    <img
                      src={venue.imageUrl}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-slate-900/60 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-bold">
                      {venue.type}
                    </span>
                  </div>
                </Link>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-800 hover:text-indigo-650 transition-colors line-clamp-1">
                      <Link href={`/owner/venues/${venue.id}`}>
                        {venue.name}
                      </Link>
                    </h3>
                    <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {venue.location}
                    </p>

                    <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-500 border-t border-b border-slate-100 py-3">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Cap: {venue.capacity}</span>
                      </div>
                      {/* <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-yellow-550" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{venue.rating || 'N/A'}</span>
                      </div> */}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 mt-6 pt-2">
                    {/* <div>
                      <span className="text-slate-400 text-2xs block uppercase font-bold tracking-wider">Price</span>
                      <span className="font-extrabold text-slate-800 text-lg">RS {venue.pricePerHour}</span>
                      <span className="text-slate-400 text-xs font-semibold">/hr</span>
                    </div> */}

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/owner/bookings?venueId=${venue.id}`}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-655 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        Bookings
                      </Link>
                      <Link
                        href={`/owner/venues/${venue.id}`}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            BookMyVenue.
          </p>
        </div>
      </footer>
    </div>
  );
}