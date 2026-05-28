import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import { MdVerified, MdPeople, MdAttachMoney, MdOutlineSecurity, MdOutlineThumbUp, MdOutlineThumbDown } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const aRes = await adminService.getAnalytics();
      setAnalytics(aRes.data);
      const vRes = await adminService.getVenues({ status: 'pending' });
      setPendingVenues(vRes.data.venues?.filter(v => v.status === 'pending') || []);
    } catch {
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVenue = async (id, status) => {
    try {
      await adminService.updateVenueStatus(id, status);
      toast.success(`Venue ${status} successfully!`);
      fetchAdminData();
    } catch {
      toast.error('Failed to update venue status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <span className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <MdOutlineSecurity className="text-primary-light" /> Admin Panel
          </h1>
          <p className="text-slate-400 text-sm mt-1">Platform analytics, user management, and venue verification audits</p>
        </div>

        {/* Analytics Card grid */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="glass p-6 rounded-2xl border border-white/8">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Total Users</span>
              <span className="text-2xl font-black text-white">{analytics.users?.total || 0}</span>
              <span className="text-xs text-slate-400 block mt-1">Active: {analytics.users?.active || 0}</span>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/8">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Venue Listings</span>
              <span className="text-2xl font-black text-white">{analytics.venues?.total || 0}</span>
              <span className="text-xs text-slate-400 block mt-1">Approved: {analytics.venues?.approved || 0}</span>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/8">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Total Bookings</span>
              <span className="text-2xl font-black text-white">{analytics.bookings?.total || 0}</span>
              <span className="text-xs text-slate-400 block mt-1">Confirmed: {analytics.bookings?.confirmed || 0}</span>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/8">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Cumulative Revenues</span>
              <span className="text-2xl font-black text-white">₹{(analytics.totalRevenue || 0).toLocaleString('en-IN')}</span>
              <span className="text-xs text-green-400 block mt-1">Platform gross</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pending verification list */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MdVerified className="text-primary-light" /> Pending Venue Verifications
            </h2>

            {pendingVenues.length === 0 ? (
              <div className="glass p-8 rounded-2xl border border-white/8 text-center text-slate-400">
                🎉 No pending venue listing audits. All listings have been reviewed!
              </div>
            ) : (
              pendingVenues.map((venue) => (
                <div key={venue.id} className="glass bg-bg-card/25 border border-white/8 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <h3 className="font-extrabold text-white text-lg tracking-tight mb-1">{venue.venueName}</h3>
                    <p className="text-xs text-slate-400">📍 {venue.address}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
                      <span>Owner: <span className="text-white font-medium">{venue.owner?.name}</span></span>
                      <span>Seating: <span className="text-white font-medium">{venue.capacity} guests</span></span>
                      <span>Hourly: <span className="text-white font-medium">₹{venue.pricePerHour}</span></span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleApproveVenue(venue.id, 'approved')}
                      className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-success text-white font-semibold text-xs hover:brightness-110 active:scale-95 transition-transform flex items-center gap-1 justify-center"
                    >
                      <MdOutlineThumbUp className="text-sm" /> Approve
                    </button>
                    <button
                      onClick={() => handleApproveVenue(venue.id, 'rejected')}
                      className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-error text-white font-semibold text-xs hover:brightness-110 active:scale-95 transition-transform flex items-center gap-1 justify-center"
                    >
                      <MdOutlineThumbDown className="text-sm" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Popular spaces table */}
          <div>
            <div className="glass p-6 rounded-3xl border border-white/8">
              <h2 className="text-lg font-bold text-white mb-6">Popular Spaces</h2>
              {analytics?.popularVenues && analytics.popularVenues.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {analytics.popularVenues.map((pop, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">{pop.venueName}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Rank #{idx+1}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary-light">
                        {pop.bookingCount} bookings
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500">Waiting for booking metadata</span>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
