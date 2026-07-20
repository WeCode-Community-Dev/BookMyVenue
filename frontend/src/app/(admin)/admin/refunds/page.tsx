'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';

interface Booking {
  id: string;
  _id?: string;
  userId: {
    id: string;
    _id?: string;
    name: string;
    email: string;
  };
  venueId: {
    id: string;
    _id?: string;
    name: string;
    location: string;
  };
  date: string;
  hours: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  refundStatus: string;
  refundAmount?: number;
  refundRequestedAt?: string;
  cancellationReason?: string;
  cancelledBy?: string;
}

export default function AdminRefundsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  const [refunds, setRefunds] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
        fetchPendingRefunds();
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  const fetchPendingRefunds = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/bookings/refunds/pending');
      setRefunds(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch pending refunds:', err);
      setErrorMsg('Failed to load pending refunds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRefund = async (bookingId: string) => {
    if (!confirm('Are you sure you want to APPROVE this refund?')) {
      return;
    }

    setActionLoadingId(bookingId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.patch(`/bookings/${bookingId}/refund/approve`);
      setSuccessMsg('Refund request approved successfully.');
      setRefunds((prev) => prev.filter((r) => r.id !== bookingId && r._id !== bookingId));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to approve refund:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to approve refund.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRejectRefund = async (bookingId: string) => {
    if (!confirm('Are you sure you want to REJECT this refund request?')) {
      return;
    }

    setActionLoadingId(bookingId);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.patch(`/bookings/${bookingId}/refund/reject`);
      setSuccessMsg('Refund request rejected successfully.');
      setRefunds((prev) => prev.filter((r) => r.id !== bookingId && r._id !== bookingId));
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to reject refund:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to reject refund.');
    } finally {
      setActionLoadingId(null);
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
          <p className="text-slate-600 font-medium">Securing session...</p>
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
              <Link href="/admin/dashboard" className="text-slate-655 hover:text-indigo-600 font-semibold text-sm transition-colors duration-200">
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
              {/* <Link href="/admin/refunds" className="text-indigo-600 font-semibold text-sm">
                Refunds
              </Link> */}
            </nav>
          </div>

          <div className="flex items-center gap-4">
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-850 tracking-tight">Refund Audits</h1>
            <p className="text-slate-550 text-sm mt-1">Review pending customer refund requests from cancelled property schedules.</p>
          </div>
          <button
            onClick={fetchPendingRefunds}
            className="p-2.5 bg-white border border-slate-205 text-slate-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H12" />
            </svg>
            Refresh List
          </button>
        </div>

        {/* Messaging Feedback Banners */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold flex items-center gap-2 animate-bounce">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-750 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Pending Refunds Listing */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium text-sm">Loading pending refunds list...</p>
          </div>
        ) : refunds.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-base font-bold text-slate-705">No Pending Refunds</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">There are no bookings waiting for admin refund review at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {refunds.map((refund) => {
              const venueName = refund.venueId?.name || 'Venue';
              const location = refund.venueId?.location || 'Address';
              const customerName = refund.userId?.name || 'Customer';
              const customerEmail = refund.userId?.email || 'Email';
              const refundId = refund.id || refund._id || '';
              const isActioning = actionLoadingId === refundId;

              return (
                <div key={refundId} className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{venueName}</h3>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {location}
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 text-[9px] font-extrabold rounded-full border uppercase bg-indigo-50 border-indigo-150 text-indigo-705 tracking-wider">
                        Refund Pending
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-205/60 space-y-1 text-xs">
                      <div className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">Customer Details</div>
                      <div className="font-bold text-slate-800">{customerName}</div>
                      <div className="text-slate-500 text-[11px]">{customerEmail}</div>
                    </div>

                    {/* Refund info */}
                    <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100/60 space-y-2 text-xs text-amber-900">
                      <div className="flex justify-between">
                        <span>Original Price:</span>
                        <span className="font-bold">RS {refund.totalPrice}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-amber-200/50 text-sm font-bold">
                        <span>Refund Amount:</span>
                        <span className="text-indigo-650 font-black">RS {refund.refundAmount || refund.totalPrice}</span>
                      </div>
                      {refund.refundRequestedAt && (
                        <div className="text-[10px] text-amber-700 flex justify-between">
                          <span>Requested:</span>
                          <span>{new Date(refund.refundRequestedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Cancellation Details */}
                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-[11px] text-rose-800 leading-relaxed">
                      <span className="font-extrabold text-[9px] text-rose-500 uppercase block tracking-wider mb-0.5">Cancellation Reason</span>
                      {refund.cancellationReason || 'No reason provided'}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-3">
                    <button
                      onClick={() => handleRejectRefund(refundId)}
                      disabled={isActioning}
                      className="w-1/2 py-2 px-3 border border-rose-200 text-rose-650 hover:bg-rose-50 bg-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isActioning ? 'Working...' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleApproveRefund(refundId)}
                      disabled={isActioning}
                      className="w-1/2 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isActioning ? 'Working...' : 'Approve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-slate-505">
          <p>BookMyVenue Admin Audits</p>
        </div>
      </footer>
    </div>
  );
}
