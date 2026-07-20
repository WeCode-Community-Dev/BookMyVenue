'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
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
        fetchUsers();
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/users');
      const data = response.data || [];
      
      const filtered = data
        .filter((u: any) => u.role === 'User')
        .map((u: any) => ({
          id: u.id || u._id,
          name: u.name,
          email: u.email,
          phoneNumber: u.phoneNumber,
          role: u.role,
          status: u.status,
          createdAt: u.createdAt,
        }));

      setUsers(filtered);
      setFilteredUsers(filtered);
      calculateStats(filtered);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setErrorMsg('Failed to load customers. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userList: User[]) => {
    setStats({
      total: userList.length,
      active: userList.filter(u => u.status === 'Active').length,
      pending: userList.filter(u => u.status === 'Pending').length,
      suspended: userList.filter(u => u.status === 'Suspended').length,
    });
  };
  
  useEffect(() => {
    let result = [...users];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phoneNumber.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(u => u.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, statusFilter, users]);

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    setActionLoading(userId);
    setErrorMsg('');
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await api.patch(`/users/${userId}/status`, { status: newStatus });
      
      // Update local state
      const updated = users.map(u => (u.id === userId ? { ...u, status: newStatus } : u));
      setUsers(updated);
      calculateStats(updated);
    } catch (err: any) {
      console.error('Failed to toggle user status:', err);
      setErrorMsg('Failed to update status. Please try again.');
    } finally {
      setActionLoading(null);
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
          <p className="text-slate-600 font-medium">Loading user console...</p>
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
              <Link href="/admin/users" className="text-indigo-600 font-semibold text-sm">
                Users
              </Link>
              <Link href="/admin/owners" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors">
                Owners
              </Link>
              <Link href="/admin/venues" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors">
                Venues
              </Link>
              {/* <Link href="/admin/refunds" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors">
                Refunds
              </Link> */}
            </nav>
          </div>

          {/* Desktop User Info */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
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
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Customer (User) Management</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Moderate normal customer accounts, activate or suspend user accounts.
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
            <span className="text-2xs font-bold text-slate-450 uppercase tracking-wider block">Total Customers</span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{loading ? '...' : stats.total}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-2xs font-bold text-slate-450 uppercase tracking-wider block">Active Accounts</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{loading ? '...' : stats.active}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-2xs font-bold text-slate-450 uppercase tracking-wider block">Pending Approval</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{loading ? '...' : stats.pending}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-2xs font-bold text-slate-450 uppercase tracking-wider block">Suspended Accounts</span>
            <span className="text-2xl font-extrabold text-rose-600 mt-1 block">{loading ? '...' : stats.suspended}</span>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or phone number..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550 focus:border-indigo-550 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status-select" className="sr-only">Status Filter</label>
            <select
              id="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-550 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </section>

        {/* Users Table / List */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              <p className="text-slate-500 font-semibold text-sm">Fetching customer records...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <p className="font-semibold text-lg">No Customers Match Filters</p>
              <p className="text-xs text-slate-400 mt-1">Try adapting your search keyword or selection filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">Account Status</th>
                    <th className="px-6 py-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredUsers.map((user) => {
                    const isLoading = actionLoading === user.id;

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                        {/* User Details */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-50 to-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{user.name}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                          {user.phoneNumber || 'N/A'}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            user.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : user.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {user.status || 'Active'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleStatusToggle(user.id, user.status)}
                            disabled={isLoading}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                              user.status === 'Active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200'
                            } disabled:opacity-50 cursor-pointer`}
                          >
                            {isLoading ? '...' : (user.status === 'Active' ? 'Suspend' : 'Activate')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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