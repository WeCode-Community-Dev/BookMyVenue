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
  images?: string[];
  description: string;
  ownerId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function AdminVenuesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const [venues, setVenues] = useState<Venue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Deletion Modal / Confirm State
  const [deletingVenue, setDeletingVenue] = useState<Venue | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    conference: 0,
    banquet: 0,
    studio: 0,
    other: 0,
  });

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
      if (user.role !== 'Admin') {
        router.push('/');
      } else {
        setCurrentUser(user);
        fetchData();
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Fetch both venues and users in parallel
      const [venuesRes, usersRes] = await Promise.all([
        api.get('/venues'),
        api.get('/users'),
      ]);

      const venueList = venuesRes.data || [];
      const userList = usersRes.data || [];

      // Map users
      const formattedUsers = userList.map((u: any) => ({
        id: u.id || u._id,
        name: u.name,
        email: u.email,
      }));

      // Map venues
      const formattedVenues = venueList.map((v: any) => ({
        id: v.id || v._id,
        name: v.name,
        type: v.type,
        capacity: v.capacity,
        location: v.location,
        pricePerHour: v.pricePerHour,
        rating: v.rating,
        imageUrl: v.imageUrl,
        images: v.images,
        description: v.description,
        ownerId: v.ownerId,
      }));

      setUsers(formattedUsers);
      setVenues(formattedVenues);
      setFilteredVenues(formattedVenues);
      calculateStats(formattedVenues);

    } catch (err: any) {
      console.error('Failed to fetch platform venue listings:', err);
      setErrorMsg('Failed to fetch platform listings. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (venueList: Venue[]) => {
    setStats({
      total: venueList.length,
      conference: venueList.filter(v => v.type === 'Conference Room').length,
      banquet: venueList.filter(v => v.type === 'Banquet Hall').length,
      studio: venueList.filter(v => v.type === 'Studio').length,
      other: venueList.filter(v => 
        v.type !== 'Conference Room' && 
        v.type !== 'Banquet Hall' && 
        v.type !== 'Studio'
      ).length,
    });
  };

  // Live filter effect
  useEffect(() => {
    let result = [...venues];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        v =>
          v.name.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'All') {
      result = result.filter(v => v.type === typeFilter);
    }

    setFilteredVenues(result);
  }, [searchQuery, typeFilter, venues]);

  const handleDeleteClick = (venue: Venue) => {
    setDeletingVenue(venue);
    setErrorMsg('');
  };

  const confirmDelete = async () => {
    if (!deletingVenue) return;
    setDeleteLoading(true);
    setErrorMsg('');
    try {
      await api.delete(`/venues/${deletingVenue.id}`);
      
      // Update local state
      const updated = venues.filter(v => v.id !== deletingVenue.id);
      setVenues(updated);
      calculateStats(updated);
      setDeletingVenue(null);
    } catch (err: any) {
      console.error('Failed to delete listing:', err);
      setErrorMsg('Failed to delete listing. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getOwnerName = (ownerId: string) => {
    const owner = users.find(u => u.id === ownerId);
    return owner ? owner.name : 'Unknown Owner';
  };

  const getOwnerEmail = (ownerId: string) => {
    const owner = users.find(u => u.id === ownerId);
    return owner ? owner.email : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!isClient || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading venue console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              BookMyVenue
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/admin/dashboard" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors">
                Users
              </Link>
              <Link href="/admin/owners" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors">
                Owners
              </Link>
              <Link href="/admin/venues" className="text-indigo-600 font-semibold text-sm">
                Venues
              </Link>
              {/* <Link href="/admin/refunds" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors">
                Refunds
              </Link> */}
            </nav>
          </div>

          {/* Desktop User Info */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{currentUser.name}</span>
              <span className="text-xs text-indigo-600 font-semibold uppercase">Administrator</span>
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
        
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Venue Moderation</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Review listed venues, update details, or delete violating properties.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Mini Stats Banner */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-2xs font-bold text-slate-450 uppercase tracking-wider block">Total Listed</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{loading ? '...' : stats.total}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-2xs font-bold text-slate-450 uppercase tracking-wider block">Conference Rooms</span>
            <span className="text-2xl font-extrabold text-indigo-650 mt-1 block">{loading ? '...' : stats.conference}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-2xs font-bold text-slate-450 uppercase tracking-wider block">Banquet Halls</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{loading ? '...' : stats.banquet}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-2xs font-bold text-slate-450 uppercase tracking-wider block">Studios & Others</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{loading ? '...' : stats.studio + stats.other}</span>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <label htmlFor="search" className="sr-only">Search</label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by venue name, location, or description..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 placeholder-slate-400"
            />
          </div>

          <div>
            <label htmlFor="type-select" className="sr-only">Type Filter</label>
            <select
              id="type-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-550 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Conference Room">Conference Rooms</option>
              <option value="Banquet Hall">Banquet Halls</option>
              <option value="Studio">Studios</option>
              <option value="Auditorium">Auditoriums</option>
              <option value="Outdoor Space">Outdoor Spaces</option>
              <option value="Co-working Space">Co-working Spaces</option>
              <option value="Other">Others</option>
            </select>
          </div>
        </section>

        {/* Listings Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            <p className="text-slate-500 font-semibold text-sm">Fetching platform listing cards...</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="bg-white text-center py-16 px-4 rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto flex flex-col items-center gap-4">
            <h3 className="text-xl font-bold text-slate-800">No Listed Venues</h3>
            <p className="text-slate-500 max-w-md text-sm">
              We couldn't find any venues matching your keyword search. Try adapting your text search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => {
              const ownerName = getOwnerName(venue.ownerId);
              const ownerEmail = getOwnerEmail(venue.ownerId);

              return (
                <article
                  key={venue.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-sm"
                >
                  {/* Image Block */}
                  <div className="h-48 relative overflow-hidden bg-slate-100 flex items-center justify-center">
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
                  </div>

                  {/* Content Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {venue.name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {venue.location}
                      </p>

                      {/* Owner Metadata Info */}
                      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-3xs font-extrabold text-slate-450 uppercase tracking-wider block">Property Lister (Owner)</span>
                        <span className="font-bold text-xs text-slate-700 block mt-0.5">{ownerName}</span>
                        {ownerEmail && <span className="text-3xs text-slate-400 block mt-0.5">{ownerEmail}</span>}
                      </div>

                      <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-500 border-t border-b border-slate-100 py-3">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Cap: {venue.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-yellow-550" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{venue.rating || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-6 pt-2">
                      <div>
                        <span className="text-slate-450 text-3xs block uppercase font-bold tracking-wider">Price</span>
                        <span className="font-extrabold text-slate-800 text-lg">RS {venue.pricePerHour}</span>
                        <span className="text-slate-400 text-xs font-semibold">/hr</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/owner/venues/${venue.id}`}
                          className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(venue)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {deletingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl animate-scale-up">
            <h3 className="text-xl font-extrabold text-slate-800">Confirm Listing Deletion</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-slate-700">"{deletingVenue.name}"</span>? This will permanently remove the listing from the platform and invalidate associated customer bookings.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeletingVenue(null)}
                disabled={deleteLoading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Listing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            BookMyVenue.
          </p>
        </div>
      </footer>
    </div>
  );
}