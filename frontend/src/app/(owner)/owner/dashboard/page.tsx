'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const [totalVenues, setTotalVenues] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

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
        fetchStatsAndBookings(user.id);
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchStatsAndBookings = async (userId: string) => {
    setLoadingStats(true);
    try {
      const venuesRes = await api.get('/venues/my');
      const ownerVenues = venuesRes.data;
      setTotalVenues(ownerVenues.length);

      const bookingsRes = await api.get('/bookings');
      const allBookings = bookingsRes.data;

      const ownerBookings = allBookings.filter((booking: any) => {
        const venue = booking.venueId;
        return venue && typeof venue === 'object' && String(venue.ownerId) === String(userId);
      });

      setTotalBookings(ownerBookings.length);
      setPendingBookings(ownerBookings.filter((b: any) => b.status === 'pending').length);
      
      const sortedBookings = [...ownerBookings].sort((a: any, b: any) => {
        return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
      });
      setRecentBookings(sortedBookings.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
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
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
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
              <Link href="/owner/dashboard" className="text-indigo-600 font-semibold text-sm">
                Dashboard
              </Link>
              <Link href="/owner/venues" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                My Venues
              </Link>
              <Link href="/owner/bookings" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Bookings
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
        {/* Welcome Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-8 rounded-3xl shadow-xl mb-8">
          {/* Decorative Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold tracking-wider uppercase">
              Owner Panel
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{currentUser.name}</span>!
            </h1>
            <p className="text-slate-300 mt-2 max-w-2xl text-base sm:text-lg">
              Manage your venue listings, monitor event bookings, track your earnings.
            </p>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Venues */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Venues</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                {loadingStats ? '...' : totalVenues}
              </h3>
              <p className="text-xs text-indigo-600 font-semibold mt-2 flex items-center gap-1">
                <span>Active Listings</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          {/* Card 2: Bookings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                {loadingStats ? '...' : totalBookings}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                {pendingBookings > 0 && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>}
                <span>{pendingBookings} Pending Approval</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Card 3: Revenue */}
          {/* <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Estimated Revenue</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">$4,820</h3>
              <p className="text-xs text-amber-600 font-semibold mt-2">
                <span>Month-to-Date</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 text-amber-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 14a2 2 0 110-4M12 14v1m0-1v-4" />
              </svg>
            </div>
          </div> */}

          {/* Card 4: Average Rating */}
          {/* <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Average Rating</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">4.8</h3>
              <p className="text-xs text-yellow-600 font-semibold mt-2">
                <span>Based on 28 reviews</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-50 text-yellow-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div> */}
        </section>

        {/* Dashboard Grid Details */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Panel */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Quick Actions</h2>
            
            <Link 
              href="/owner/venues/create" 
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 text-left"
            >
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">Add New Venue</h4>
                <p className="text-xs text-slate-500 mt-0.5">List a new property for rent</p>
              </div>
              <span className="p-2 rounded-lg bg-white text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </Link>

            <Link 
              href="/owner/bookings" 
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 text-left"
            >
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">Manage Bookings</h4>
                <p className="text-xs text-slate-500 mt-0.5">Approve, decline or review bookings</p>
              </div>
              <span className="p-2 rounded-lg bg-white text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
            </Link>

            <Link 
              href="/owner/venues" 
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 text-left"
            >
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">View My Listings</h4>
                <p className="text-xs text-slate-500 mt-0.5">Edit existing venues and pricing</p>
              </div>
              <span className="p-2 rounded-lg bg-white text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Recent Bookings Panel */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Recent Bookings</h2>
              <Link href="/owner/bookings" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                View All Bookings &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {loadingStats ? (
                <div className="animate-pulse space-y-3 py-4">
                  <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                  <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                </div>
              ) : recentBookings.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">No bookings received yet.</p>
              ) : (
                recentBookings.map((booking) => {
                  const venueName = booking.venueId?.name || 'Venue';
                  const initials = venueName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                  const customerName = booking.userId?.name || 'Customer';
                  return (
                    <div key={booking.id || booking._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-150 hover:bg-slate-50/55 transition-colors gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{venueName}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Customer: {customerName} &bull; {booking.hours} hours</p>
                          <p className="text-xs text-slate-400 mt-1">Date: {booking.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="font-bold text-slate-800">RS {booking.totalPrice}</span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : booking.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                            : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
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