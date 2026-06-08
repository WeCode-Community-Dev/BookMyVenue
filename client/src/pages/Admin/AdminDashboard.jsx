import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { adminService, userService } from '../../services';
import { 
  MdOutlineSecurity, 
  MdDashboard, 
  MdPeople, 
  MdStorefront, 
  MdEventNote, 
  MdOutlineMapsHomeWork, 
  MdOutlinePayments,
  MdBlock,
  MdCheckCircle,
  MdSearch,
  MdNavigateBefore,
  MdNavigateNext,
  MdPerson,
  MdVpnKey,
  MdTrendingUp,
  MdClose,
  MdAccessTime,
  MdLocationOn,
  MdInfo,
  MdStar
} from 'react-icons/md';
import toast from 'react-hot-toast';
import { thumbnailUrl, detailUrl } from '../../utils/cloudinaryUrl';

const formatTime12Hour = (timeStr) => {
  if (!timeStr) return '';
  const [hourStr, minStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minStr} ${ampm}`;
};

export default function AdminDashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState(queryParams.get('tab') || 'overview');

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Users Tab Pagination & Search State
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState('');

  // Owners Tab Pagination & Search State
  const [owners, setOwners] = useState([]);
  const [ownerPage, setOwnerPage] = useState(1);
  const [ownerTotalPages, setOwnerTotalPages] = useState(1);
  const [ownerSearch, setOwnerSearch] = useState('');

  // Bookings State
  const [bookings, setBookings] = useState([]);
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingTotalPages, setBookingTotalPages] = useState(1);

  // Venues State
  const [venues, setVenues] = useState([]);
  const [venuePage, setVenuePage] = useState(1);
  const [venueTotalPages, setVenueTotalPages] = useState(1);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedUserToBlock, setSelectedUserToBlock] = useState(null);
  const [blockReason, setBlockReason] = useState('');

  // Modal Suspend states
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedVenueToSuspend, setSelectedVenueToSuspend] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  // Modal Venue Details states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVenueForDetails, setSelectedVenueForDetails] = useState(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);

  // Profile Form States
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchOverviewData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'owners') fetchOwners();
    if (activeTab === 'venues') fetchVenues();
    if (activeTab === 'bookings' || activeTab === 'payments') fetchBookings();
    if (activeTab === 'profile') fetchProfileData();
  }, [activeTab, userPage, ownerPage, venuePage, bookingPage, userSearch, ownerSearch]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnalytics();
      setAnalytics(res.data);
    } catch {
      toast.error('Failed to load system analytics');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const res = await userService.getMe();
      setProfileForm({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
      });
    } catch {
      toast.error('Failed to load profile details');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers({
        page: userPage,
        limit: 10,
        role: 'user',
        search: userSearch,
      });
      setUsers(res.data.users || []);
      setUserTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error('Failed to load guests');
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await adminService.getVenueOwners({
        page: ownerPage,
        limit: 10,
        search: ownerSearch,
      });
      setOwners(res.data.owners || []);
      setOwnerTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error('Failed to load venue owners');
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await adminService.getVenues({
        page: venuePage,
        limit: 10,
      });
      setVenues(res.data.venues || []);
      setVenueTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error('Failed to load venues');
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await adminService.getBookings({
        page: bookingPage,
        limit: 10,
      });
      setBookings(res.data.bookings || []);
      setBookingTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error('Failed to load reservations');
    }
  };

  const handleOpenBlockModal = (user) => {
    setSelectedUserToBlock(user);
    setBlockReason('');
    setShowBlockModal(true);
  };

  const handleConfirmBlock = async () => {
    if (!blockReason.trim()) {
      return toast.error('Please enter a reason for blocking');
    }
    try {
      await adminService.updateUserStatus(selectedUserToBlock.id, 'blocked', blockReason);
      toast.success(`${selectedUserToBlock.name} has been blocked successfully.`);
      setShowBlockModal(false);
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'owners') fetchOwners();
      fetchOverviewData();
    } catch {
      toast.error('Failed to block account');
    }
  };

  const handleUnblock = async (user) => {
    try {
      await adminService.updateUserStatus(user.id, 'active', '');
      toast.success(`${user.name} has been unblocked successfully.`);
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'owners') fetchOwners();
      fetchOverviewData();
    } catch {
      toast.error('Failed to unblock account');
    }
  };

  const toggleVenueListingStatus = async (venue, newStatus, reason = '') => {
    try {
      await adminService.updateVenueStatus(venue.id, newStatus, reason);
      toast.success(`Venue listing status updated to ${newStatus}`);
      fetchVenues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update venue listing status');
    }
  };

  const handleOpenSuspendModal = (venue) => {
    setSelectedVenueToSuspend(venue);
    setSuspendReason('');
    setShowSuspendModal(true);
  };

  const handleConfirmSuspend = async () => {
    if (!suspendReason.trim()) {
      return toast.error('Please enter a reason for suspension');
    }
    try {
      await adminService.updateVenueStatus(selectedVenueToSuspend.id, 'suspended', suspendReason);
      toast.success(`${selectedVenueToSuspend.venueName} has been suspended successfully.`);
      setShowSuspendModal(false);
      fetchVenues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to suspend venue listing');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
      });
      toast.success('Contact info updated successfully.');
      fetchProfileData();
    } catch {
      toast.error('Failed to save profile settings');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Please fill in password fields');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      await userService.updatePassword(currentPassword, newPassword);
      toast.success('Admin password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200 w-0' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500 w-1/3' };
    if (score === 2 || score === 3) return { score, label: 'Medium', color: 'bg-amber-500 w-2/3' };
    return { score, label: 'Strong', color: 'bg-emerald-500 w-full' };
  };

  const strength = checkPasswordStrength(newPassword);

  if (loading && activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <span className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const globalTurnover = analytics?.totalRevenue || 0;
  const adminPlatformCommissions = globalTurnover * 0.15;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 flex">
      {/* 1. Left Essential Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden md:flex flex-col shrink-0 fixed bottom-0 top-20 left-0 z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <MdOutlineSecurity className="text-xl" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">Admin Console</h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Core</span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'overview' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdDashboard className="text-lg shrink-0" />
            Overview Dashboard
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'users' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdPeople className="text-lg shrink-0" />
            Guest Users
          </button>

          <button
            onClick={() => setActiveTab('owners')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'owners' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdStorefront className="text-lg shrink-0" />
            Venue Owners
          </button>

          <button
            onClick={() => setActiveTab('venues')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'venues' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdOutlineMapsHomeWork className="text-lg shrink-0" />
            Venue Listings
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'bookings' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdEventNote className="text-lg shrink-0" />
            Booking Reservations
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center gap-3 transition-colors ${
              activeTab === 'payments' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <MdOutlinePayments className="text-lg shrink-0" />
            Platform Payments
          </button>
        </nav>
      </aside>

      {/* 2. Main Content Window */}
      <main className="flex-grow md:ml-64 p-6 sm:p-10 overflow-x-hidden">
        
        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'overview' && analytics && (
          <div className="flex flex-col gap-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Welcome Back, Admin
              </h1>
              <p className="text-slate-500 text-sm mt-1">Here is a platform summary of all user activities, booking performance, and cumulative turnovers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total System Users</span>
                <span className="text-3xl font-black text-slate-900">{analytics.users?.total || 0}</span>
                <span className="text-xs text-slate-500 mt-2">Active accounts: {analytics.users?.active || 0}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Registered Hosts</span>
                <span className="text-3xl font-black text-slate-900">{analytics.users?.venueOwners || 0}</span>
                <span className="text-xs text-slate-500 mt-2">Managing venue spaces</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Confirmed Bookings</span>
                <span className="text-3xl font-black text-slate-900">{analytics.bookings?.total || 0}</span>
                <span className="text-xs text-slate-500 mt-2">Successful: {analytics.bookings?.confirmed || 0}</span>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between bg-primary/5 border-primary/10">
                <span className="text-[10px] uppercase font-bold text-primary block mb-1">Gross Turnover</span>
                <span className="text-3xl font-black text-slate-900">₹{globalTurnover.toLocaleString('en-IN')}</span>
                <span className="text-xs text-primary font-semibold mt-2">Platform gross revenues</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Operations Shortcuts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setActiveTab('users')} 
                    className="p-5 text-left border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex flex-col justify-between h-32"
                  >
                    <span className="p-2.5 bg-slate-100 rounded-xl text-slate-700 w-fit"><MdPeople className="text-lg" /></span>
                    <div>
                      <span className="font-bold text-sm text-slate-950 block">Audit Guest List</span>
                      <span className="text-xs text-slate-500">Block or unblock user accounts</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('owners')} 
                    className="p-5 text-left border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors flex flex-col justify-between h-32"
                  >
                    <span className="p-2.5 bg-slate-100 rounded-xl text-slate-700 w-fit"><MdStorefront className="text-lg" /></span>
                    <div>
                      <span className="font-bold text-sm text-slate-950 block">Audit Venue Hosts</span>
                      <span className="text-xs text-slate-500">Control active property host listings</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Top Rated Spaces</h3>
                {analytics.popularVenues && analytics.popularVenues.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {analytics.popularVenues.map((pop, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{pop.venueName}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Rank #{idx+1}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {pop.bookingCount} bookings
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No bookings registered on database yet.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users List */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Guest Users Registry</h2>
                <p className="text-slate-500 text-sm mt-0.5">Audit and block registered platform user accounts.</p>
              </div>

              <div className="relative max-w-sm w-full">
                <MdSearch className="absolute left-3 top-3.5 text-slate-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                  className="w-full py-2.5 pl-10 pr-4 bg-white border border-slate-200/80 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-primary shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Block Reason</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                            <span className="text-xs text-slate-500">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            u.status === 'blocked'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                          {u.status === 'blocked' ? (u.blockReason || 'No reason specified') : '-'}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u.status === 'blocked' ? (
                            <button
                              onClick={() => handleUnblock(u)}
                              className="py-1.5 px-3 rounded-lg border border-emerald-200 text-emerald-600 font-semibold text-xs hover:bg-emerald-50 transition-colors"
                            >
                              Unblock Account
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenBlockModal(u)}
                              className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 font-semibold text-xs hover:bg-rose-50 transition-colors inline-flex items-center gap-1"
                            >
                              <MdBlock /> Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {userTotalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-2">
                <button
                  disabled={userPage === 1}
                  onClick={() => setUserPage(p => p - 1)}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <MdNavigateBefore className="text-lg" />
                </button>
                <span className="text-xs font-bold text-slate-700">
                  Page {userPage} of {userTotalPages}
                </span>
                <button
                  disabled={userPage === userTotalPages}
                  onClick={() => setUserPage(p => p + 1)}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <MdNavigateNext className="text-lg" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Venue Owners List */}
        {activeTab === 'owners' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Venue Owners Registry</h2>
                <p className="text-slate-500 text-sm mt-0.5">Audit, review, and block hosting merchant accounts.</p>
              </div>

              <div className="relative max-w-sm w-full">
                <MdSearch className="absolute left-3 top-3.5 text-slate-400 text-lg" />
                <input
                  type="text"
                  placeholder="Search by owner name..."
                  value={ownerSearch}
                  onChange={e => { setOwnerSearch(e.target.value); setOwnerPage(1); }}
                  className="w-full py-2.5 pl-10 pr-4 bg-white border border-slate-200/80 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-primary shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Active Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Block Reason</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {owners.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                        No venue owners found.
                      </td>
                    </tr>
                  ) : (
                    owners.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900 text-sm">{o.name}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">
                          {o.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            o.status === 'blocked'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                          {o.status === 'blocked' ? (o.blockReason || 'No reason specified') : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {o.status === 'blocked' ? (
                            <button
                              onClick={() => handleUnblock(o)}
                              className="py-1.5 px-3 rounded-lg border border-emerald-200 text-emerald-600 font-semibold text-xs hover:bg-emerald-50 transition-colors"
                            >
                              Unblock Account
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenBlockModal(o)}
                              className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 font-semibold text-xs hover:bg-rose-50 transition-colors inline-flex items-center gap-1"
                            >
                              <MdBlock /> Block Owner
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {ownerTotalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-2">
                <button
                  disabled={ownerPage === 1}
                  onClick={() => setOwnerPage(p => p - 1)}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <MdNavigateBefore className="text-lg" />
                </button>
                <span className="text-xs font-bold text-slate-700">
                  Page {ownerPage} of {ownerTotalPages}
                </span>
                <button
                  disabled={ownerPage === ownerTotalPages}
                  onClick={() => setOwnerPage(p => p + 1)}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <MdNavigateNext className="text-lg" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Venue Listings List */}
        {activeTab === 'venues' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Active Venue Directory</h2>
              <p className="text-slate-500 text-sm mt-0.5">List of registered event spaces. Review new property listings pending approval, or manage active and suspended venues.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Venue Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price Rate</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {venues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                        No venues registered yet.
                      </td>
                    </tr>
                  ) : (
                    venues.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm">{v.venueName}</span>
                            <span className="text-xs text-slate-500 max-w-xs truncate">{v.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 font-semibold uppercase tracking-wider">
                          {v.venueType.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-900 font-bold">
                          {v.pricingUnit === 'day' ? `₹${Number(v.pricePerDay || 0).toLocaleString('en-IN')}/day` : `₹${Number(v.pricePerHour).toLocaleString('en-IN')}/hr`}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">
                          {v.capacity} pax
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            v.status === 'suspended'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : v.status === 'pending'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : v.status === 'rejected'
                              ? 'bg-slate-50 text-slate-600 border border-slate-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end items-center">
                            <button
                              onClick={() => {
                                setSelectedVenueForDetails(v);
                                setActiveModalImageIndex(0);
                                setShowDetailsModal(true);
                              }}
                              className="py-1 px-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-[11px] hover:bg-slate-50 transition-colors"
                            >
                              View Details
                            </button>
                            {v.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => toggleVenueListingStatus(v, 'approved')}
                                  className="py-1 px-2.5 rounded-lg border border-emerald-200 text-emerald-600 font-semibold text-[11px] hover:bg-emerald-50 transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleOpenSuspendModal(v)}
                                  className="py-1 px-2.5 rounded-lg border border-rose-200 text-rose-600 font-semibold text-[11px] hover:bg-rose-50 transition-colors"
                                >
                                  Suspend/Reject
                                </button>
                              </>
                            ) : v.status === 'suspended' || v.status === 'rejected' ? (
                              <button
                                onClick={() => toggleVenueListingStatus(v, 'approved')}
                                className="py-1 px-2.5 rounded-lg border border-emerald-200 text-emerald-600 font-semibold text-[11px] hover:bg-emerald-50 transition-colors"
                              >
                                Activate Listing
                              </button>
                            ) : (
                              <button
                                onClick={() => handleOpenSuspendModal(v)}
                                className="py-1 px-2.5 rounded-lg border border-rose-200 text-rose-600 font-semibold text-[11px] hover:bg-rose-50 transition-colors inline-flex items-center gap-1"
                              >
                                <MdBlock /> Suspend Listing
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Booking Reservations List */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Reservations Auditor</h2>
              <p className="text-slate-500 text-sm mt-0.5">Review, verify, and resolve scheduling conflicts for all platform bookings.</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Booking code</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Event Schedule</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Cost</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                        No bookings found.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/40">
                        <td className="px-6 py-4 text-xs font-mono font-bold text-slate-900">
                          {b.bookingCode || b.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-950 text-sm block">{b.venue?.venueName}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{b.venue?.venueType?.replace('_', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-700">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{b.user?.name}</span>
                            <span className="text-slate-400">{b.user?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">
                          <div className="flex flex-col">
                            <span>{new Date(b.bookingDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{b.startTime} - {b.endTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-900 font-extrabold">
                          ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                            b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : b.bookingStatus === 'rejected' || b.bookingStatus === 'cancelled'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Payments & Settlements List */}
        {activeTab === 'payments' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Payments & Commission settlements</h2>
              <p className="text-slate-500 text-sm mt-0.5">Cumulative transaction distributions showing automatic intermediate breakdowns (85% Owner / 15% Platform Commission).</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction Code</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Paid</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Host Share (85%)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">BMV commission (15%)</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                        No transactions registered yet.
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => {
                      const total = Number(b.totalAmount);
                      const hostShare = total * 0.85;
                      const platformCommission = total * 0.15;
                      const isCancelled = b.bookingStatus === 'cancelled';
                      const isRejected = b.bookingStatus === 'rejected';
                      const isPending = b.bookingStatus === 'pending';
                      const isPaidOut = b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed';

                      return (
                        <tr key={b.id} className="hover:bg-slate-50/40">
                          <td className="px-6 py-4 text-xs font-mono font-bold text-slate-900">
                            TXN-{b.bookingCode || b.id.substring(0, 8).toUpperCase()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-950 text-sm block">{b.venue?.venueName}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{b.venue?.venueType?.replace('_', ' ')}</span>
                          </td>
                          <td className={`px-6 py-4 text-xs font-bold ${isCancelled || isRejected ? 'text-slate-400 line-through font-normal' : 'text-slate-900'}`}>
                            ₹{total.toLocaleString('en-IN')}
                          </td>
                          <td className={`px-6 py-4 text-xs ${isCancelled || isRejected ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                            ₹{hostShare.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </td>
                          <td className={`px-6 py-4 text-xs font-bold ${isCancelled || isRejected ? 'text-slate-400 line-through font-normal' : 'text-primary'}`}>
                            ₹{platformCommission.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                              isPaidOut
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : isCancelled || isRejected
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}>
                              {isPaidOut ? 'Paid out' : isCancelled ? 'Cancelled' : isRejected ? 'Rejected' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: Profile & Security settings for admin */}
        {activeTab === 'profile' && (
          <div className="flex flex-col gap-8 animate-fade-in max-w-xl">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Admin Profile & Settings</h2>
              <p className="text-slate-500 text-sm mt-0.5">Manage administrative contact details and update auth passwords.</p>
            </div>

            {/* Profits breakdown card for Admin (15% commissions) */}
            <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-between bg-primary/5">
              <span className="text-[10px] uppercase font-bold text-primary block mb-1">BMV Platform Commissions Net Profit (15% Cut)</span>
              <span className="text-3xl font-black text-slate-900">₹{adminPlatformCommissions.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              <span className="text-xs text-slate-500 mt-2">Cumulative administrative cut generated platform-wide</span>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin display name</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email (Locked)</label>
                <input
                  type="email"
                  className="w-full py-2.5 px-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 text-sm focus:outline-none cursor-not-allowed"
                  value={profileForm.email}
                  disabled
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone number</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark font-bold text-white text-xs rounded-xl shadow-sm transition-colors"
              >
                Save Contact Info
              </button>
            </form>

            {/* Change Password with Password strength progress bar */}
            <form onSubmit={handleChangePassword} className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="text-base font-bold text-slate-900">Change Admin Password</h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                <input
                  type="password"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                <input
                  type="password"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                
                {/* Dynamic Password Strength Progress Bar */}
                {newPassword && (
                  <div className="mt-2.5 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                      <span>Password Strength:</span>
                      <span className={`${
                        strength.label === 'Strong' ? 'text-emerald-600' :
                        strength.label === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                      }`}>{strength.label}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div className={`h-full transition-all duration-300 ${strength.color}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark font-bold text-white text-xs rounded-xl shadow-sm transition-colors"
              >
                Change Admin Password
              </button>
            </form>
          </div>
        )}

      </main>

      {/* 3. Pop-up Interactive Block Account Modal */}
      {showBlockModal && selectedUserToBlock && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-950 tracking-tight">Block Account</h3>
              <p className="text-slate-500 text-xs mt-1">Please write a specific reason for blocking the account of <span className="font-bold text-slate-900">{selectedUserToBlock.name}</span>. This reason will be logged for administrative history.</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reason for Blocking *</label>
              <textarea
                value={blockReason}
                onChange={e => setBlockReason(e.target.value)}
                placeholder="e.g. Terms of Service violation / Fraudulent booking behaviors..."
                className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-rose-500 h-24 resize-none transition-colors"
                required
              />
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBlock}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow transition-colors"
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Pop-up Interactive Suspend Listing Modal */}
      {showSuspendModal && selectedVenueToSuspend && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-950 tracking-tight">Suspend Venue Listing</h3>
              <p className="text-slate-500 text-xs mt-1">Please enter a reason for suspending <span className="font-bold text-slate-900">{selectedVenueToSuspend.venueName}</span>. This reason will be shared with the venue owner so they can take necessary corrective actions.</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reason for Suspension *</label>
              <textarea
                value={suspendReason}
                onChange={e => setSuspendReason(e.target.value)}
                placeholder="e.g. Safety violations / Inaccurate pricing details / Poor review trends..."
                className="w-full py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-rose-500 h-24 resize-none transition-colors"
                required
              />
            </div>

            <div className="flex gap-3 justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowSuspendModal(false)}
                className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow transition-colors"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Pop-up Interactive Venue Details Modal */}
      {showDetailsModal && selectedVenueForDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-xl border border-slate-100 flex flex-col gap-6 max-h-[90vh] overflow-y-auto relative animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">{selectedVenueForDetails.venueName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Venue Listing Reference: <span className="font-mono text-slate-700 font-semibold">{selectedVenueForDetails.id}</span></p>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 rounded-lg border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Image Slideshow / Gallery */}
              <div className="flex flex-col gap-3">
                <div className="w-full h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 relative shadow-sm">
                  {selectedVenueForDetails.images && selectedVenueForDetails.images.length > 0 ? (
                    <img 
                      src={detailUrl(selectedVenueForDetails.images[activeModalImageIndex])} 
                      alt={`${selectedVenueForDetails.venueName} ${activeModalImageIndex + 1}`} 
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                      <span className="text-5xl">🏢</span>
                      <span className="text-xs font-semibold">No images uploaded for this venue</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail selector */}
                {selectedVenueForDetails.images && selectedVenueForDetails.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                    {selectedVenueForDetails.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveModalImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                          idx === activeModalImageIndex ? 'border-primary shadow-sm scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={thumbnailUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">About the Space</h4>
                  <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                    {selectedVenueForDetails.description || 'No description provided by the host.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Venue Details */}
              <div className="flex flex-col gap-6">
                
                {/* Status and Type tags */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedVenueForDetails.venueType.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider border ${
                    selectedVenueForDetails.status === 'suspended'
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : selectedVenueForDetails.status === 'pending'
                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                      : selectedVenueForDetails.status === 'rejected'
                      ? 'bg-slate-50 text-slate-600 border-slate-100'
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {selectedVenueForDetails.status}
                  </span>
                </div>

                {/* Price and Capacity highlights */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pricing Rate</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {selectedVenueForDetails.pricingUnit === 'day' 
                        ? `₹${Number(selectedVenueForDetails.pricePerDay || 0).toLocaleString('en-IN')}/day` 
                        : `₹${Number(selectedVenueForDetails.pricePerHour).toLocaleString('en-IN')}/hr`}
                    </span>
                  </div>
                  <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Max Capacity</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 block">
                      {selectedVenueForDetails.capacity} Guests
                    </span>
                  </div>
                </div>

                {/* Timings details */}
                <div className="flex flex-col gap-1.5 border border-slate-100 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MdAccessTime className="text-slate-500 text-sm" /> Timing & Working Days
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 font-medium block">Opening Time</span>
                      <span className="font-bold text-slate-800">{selectedVenueForDetails.openingTime ? formatTime12Hour(selectedVenueForDetails.openingTime) : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Closing Time</span>
                      <span className="font-bold text-slate-800">{selectedVenueForDetails.closingTime ? formatTime12Hour(selectedVenueForDetails.closingTime) : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-slate-400 font-medium text-xs block mb-1">Operational Days</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVenueForDetails.workingDays && selectedVenueForDetails.workingDays.map((dayData, idx) => {
                        const isString = typeof dayData === 'string';
                        const dayName = isString ? dayData : dayData?.day;
                        const start = isString ? null : dayData?.start;
                        const end = isString ? null : dayData?.end;
                        
                        if (!dayName) return null;
                        
                        return (
                          <span key={idx} className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 rounded-md capitalize flex flex-col items-center">
                            <span>{dayName}</span>
                            {start && end && (
                              <span className="text-[8px] text-emerald-600 font-normal">
                                {formatTime12Hour(start)} - {formatTime12Hour(end)}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Address & Coordinates */}
                <div className="flex flex-col gap-1.5 border border-slate-100 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MdLocationOn className="text-slate-500 text-sm" /> Location details
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedVenueForDetails.address}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Latitude: {selectedVenueForDetails.latitude} | Longitude: {selectedVenueForDetails.longitude}
                  </p>
                </div>

                {/* Owner details */}
                {selectedVenueForDetails.owner && (
                  <div className="flex flex-col gap-1.5 border border-slate-100 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <MdPerson className="text-slate-500 text-sm" /> Host/Owner Details
                    </h4>
                    <div className="text-xs text-slate-700">
                      <p className="font-semibold">{selectedVenueForDetails.owner.name}</p>
                      <p className="text-slate-500 mt-0.5">{selectedVenueForDetails.owner.email}</p>
                      {selectedVenueForDetails.owner.phone && (
                        <p className="text-slate-500 mt-0.5">Phone: {selectedVenueForDetails.owner.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Amenities Offered</h4>
                  {selectedVenueForDetails.amenities && selectedVenueForDetails.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedVenueForDetails.amenities.map((amenity, index) => (
                        <span key={index} className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg flex items-center gap-1.5 border border-slate-200/60">
                          <MdCheckCircle className="text-emerald-500 text-sm" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No amenities specified.</p>
                  )}
                </div>

              </div>

            </div>

            {/* Modal Footer (with administrative actions) */}
            <div className="flex flex-wrap gap-3 justify-end items-center border-t border-slate-100 pt-4 mt-2">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Close Details
              </button>

              {selectedVenueForDetails.status === 'pending' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      toggleVenueListingStatus(selectedVenueForDetails, 'approved');
                      setShowDetailsModal(false);
                    }}
                    className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Approve Listing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleOpenSuspendModal(selectedVenueForDetails);
                    }}
                    className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Suspend/Reject Listing
                  </button>
                </>
              ) : selectedVenueForDetails.status === 'suspended' || selectedVenueForDetails.status === 'rejected' ? (
                <button
                  type="button"
                  onClick={() => {
                    toggleVenueListingStatus(selectedVenueForDetails, 'approved');
                    setShowDetailsModal(false);
                  }}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Re-Activate Listing
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleOpenSuspendModal(selectedVenueForDetails);
                  }}
                  className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors inline-flex items-center gap-1.5"
                >
                  <MdBlock /> Suspend Listing
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
