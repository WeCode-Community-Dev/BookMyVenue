'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Statistics State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalVenues: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        fetchAdminStats();
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch Users
      const usersRes = await api.get('/users');
      const allUsers = usersRes.data || [];
      const owners = allUsers.filter((u: any) => u.role === 'Venue owner');
      
      // 2. Fetch Venues
      const venuesRes = await api.get('/venues');
      const allVenues = venuesRes.data || [];

      // 3. Fetch Bookings
      const bookingsRes = await api.get('/bookings');
      const allBookings = bookingsRes.data || [];
      const pending = allBookings.filter((b: any) => 
        ['pending', 'PENDING', 'REQUESTED', 'PAYMENT_PENDING'].includes(b.status)
      );

      setStats({
        totalUsers: allUsers.length,
        totalOwners: owners.length,
        totalVenues: allVenues.length,
        totalBookings: allBookings.length,
        pendingBookings: pending.length,
      });


      // Sort recent bookings (newest first)
      const sortedBookings = [...allBookings].sort((a: any, b: any) => {
        return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
      });
      setRecentBookings(sortedBookings.slice(0, 4));

    } catch (err) {
      console.error('Failed to fetch admin dashboard statistics:', err);
    } finally {
      setLoading(false);
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
          <p className="text-slate-600 font-medium">Loading admin dashboard...</p>
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
              <Link href="/admin/dashboard" className="text-indigo-600 font-semibold text-sm">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Users
              </Link>
              <Link href="/admin/owners" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Owners
              </Link>
              <Link href="/admin/venues" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Venues
              </Link>
              {/* <Link href="/admin/refunds" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
                Refunds
              </Link> */}
            </nav>
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{currentUser.name}</span>
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Administrator</span>
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
        
        {/* Admin Welcome Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-8 rounded-3xl shadow-xl mb-8 animate-fade-in">
          {/* Decorative Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{currentUser.name}</span>!
            </h1>
            <p className="text-slate-300 mt-2 max-w-2xl text-base sm:text-lg">
              Monitor platform statistics, moderate user roles, check venue listings, and audit system activities.
            </p>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Metric 1: Total Users */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                {loading ? '...' : stats.totalUsers}
              </h3>
              <p className="text-xs text-indigo-600 font-semibold mt-2">
                Customers & Owners
              </p>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          {/* Metric 2: Venue Owners */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Venue Owners</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                {loading ? '...' : stats.totalOwners}
              </h3>
              <p className="text-xs text-violet-600 font-semibold mt-2">
                With Listing Access
              </p>
            </div>
            <div className="p-4 rounded-xl bg-violet-50 text-violet-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Metric 3: Listed Venues */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Venues</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                {loading ? '...' : stats.totalVenues}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-2">
                Live Properties
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          {/* Metric 4: processed bookings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-1">
                {loading ? '...' : stats.totalBookings}
              </h3>
              <p className="text-xs text-amber-600 font-semibold mt-2 flex items-center gap-1">
                {stats.pendingBookings > 0 && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>}
                <span>{stats.pendingBookings} Pending Actions</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 text-amber-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Dashboard Panels Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Controls & Nav Card */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Management Console</h2>
            
            <Link 
              href="/admin/users" 
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 text-left"
            >
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">Platform Users</h4>
                <p className="text-xs text-slate-500 mt-0.5">Manage customer account status</p>
              </div>
              <span className="p-2.5 rounded-xl bg-white text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </Link>

            <Link 
              href="/admin/owners" 
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 text-left"
            >
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">Venue Owners</h4>
                <p className="text-xs text-slate-500 mt-0.5">Moderate property owner registrations</p>
              </div>
              <span className="p-2.5 rounded-xl bg-white text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
            </Link>

            <Link 
              href="/admin/venues" 
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 text-left"
            >
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">Listed Venues</h4>
                <p className="text-xs text-slate-500 mt-0.5">View and moderate property lists</p>
              </div>
              <span className="p-2.5 rounded-xl bg-white text-indigo-600 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
            </Link>

            <div className="rounded-2xl border border-dashed border-slate-200 p-5 mt-2 bg-slate-50/50">
              <h4 className="font-bold text-sm text-slate-700 mb-1">Administrative Note</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                As an Admin, you can access and moderate all users and listed venues. Edits update the data directly.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            BookMyVenue.
          </p>
        </div>
      </footer>
    </div>
  );
}