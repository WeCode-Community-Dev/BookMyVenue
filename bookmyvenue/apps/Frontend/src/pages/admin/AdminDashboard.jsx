import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Clock, IndianRupee, User, Building2, CheckCircle, XCircle, Hourglass,
  Shield, Users, MapPin, Activity, TrendingUp, Filter, Search, LogOut, Menu, X
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getAdminStats,
  getAdminUsers,
  getAllVenuesAdmin,
  getAllBookingsAdmin,
  updateVenueStatus,
  updateCategoryStatus,
} from "../../api/admin";
import { getCategories } from "../../api/categories";

const TABS = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "users", label: "Users", icon: Users },
  { id: "venues", label: "Venues", icon: Building2 },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-gray-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function Badge({ children, color = "gray" }) {
  const colors = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data
  const [stats, setStats] = useState(null);
  const [usersData, setUsersData] = useState({ items: [], total: 0, page: 1, pages: 0 });
  const [venuesData, setVenuesData] = useState({ items: [], total: 0, page: 1, pages: 0 });
  const [bookingsData, setBookingsData] = useState({ items: [], total: 0, page: 1, pages: 0 });
  const [categories, setCategories] = useState([]);

  // Filters
  const [userFilter, setUserFilter] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [bookingFilter, setBookingFilter] = useState("");

  // Pages
  const [userPage, setUserPage] = useState(1);
  const [venuePage, setVenuePage] = useState(1);
  const [bookingPage, setBookingPage] = useState(1);

  const LIMIT = 20;

  async function loadUsers() {
    try {
      const data = await getAdminUsers(token, userFilter || null, userPage, LIMIT);
      setUsersData(data);
    } catch (err) { console.error(err); }
  }

  async function loadVenues() {
    try {
      const data = await getAllVenuesAdmin(token, venueFilter || null, venuePage, LIMIT);
      setVenuesData(data);
    } catch (err) { console.error(err); }
  }

  async function loadBookings() {
    try {
      const data = await getAllBookingsAdmin(token, bookingFilter || null, bookingPage, LIMIT);
      setBookingsData(data);
    } catch (err) { console.error(err); }
  }

  async function loadAll() {
    try {
      setLoading(true);
      const [statsData, catsData] = await Promise.all([
        getAdminStats(token),
        getCategories(),
      ]);
      setStats(statsData);
      setCategories(catsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (token) loadAll(); }, [token]);
  useEffect(() => { if (token) loadUsers(); }, [token, userFilter, userPage]);
  useEffect(() => { if (token) loadVenues(); }, [token, venueFilter, venuePage]);
  useEffect(() => { if (token) loadBookings(); }, [token, bookingFilter, bookingPage]);

  function goToPage(setter, page, pages) {
    if (page < 1 || page > pages) return;
    setter(page);
  }

  function Pagination({ page, pages, setter }) {
    if (pages <= 1) return null;
    return (
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => goToPage(setter, page - 1, pages)}
          disabled={page <= 1}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm font-medium text-gray-500">
          Page {page} of {pages}
        </span>
        <button
          onClick={() => goToPage(setter, page + 1, pages)}
          disabled={page >= pages}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  }

  async function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Shield className="hidden text-red-600 md:block" size={28} />
            <h1 className="text-lg font-extrabold tracking-tight text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab.id ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {/* Desktop Tabs */}
        <div className="mb-8 hidden gap-2 md:flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
          </div>
        ) : (
          <>
            {/* === OVERVIEW === */}
            {activeTab === "overview" && stats && (
              <div className="space-y-8">
                <div>
                  <h2 className="mb-5 text-lg font-bold text-gray-900">Platform Overview</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={User} label="Total Users" value={stats.total_users} color="bg-blue-600" />
                    <StatCard icon={User} label="Bookers" value={stats.total_bookers} color="bg-teal-600" />
                    <StatCard icon={User} label="Owners" value={stats.total_owners} color="bg-purple-600" />
                    <StatCard icon={Building2} label="Venues" value={stats.total_venues} color="bg-red-600" />
                    <StatCard icon={Activity} label="Active Venues" value={stats.active_venues} color="bg-green-600" />
                    <StatCard icon={CalendarDays} label="Total Bookings" value={stats.total_bookings} color="bg-amber-600" />
                    <StatCard icon={TrendingUp} label="Total Revenue" value={`\u20B9${Number(stats.total_revenue).toLocaleString("en-IN")}`} color="bg-emerald-600" />
                    <StatCard icon={CheckCircle} label="Confirmed" value={stats.confirmed_bookings} color="bg-green-600" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Booking breakdown */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">Bookings by Type</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Clock size={16} className="text-amber-500" /> Hourly
                        </span>
                        <span className="text-sm font-extrabold text-gray-900">{stats.hourly_bookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <CalendarDays size={16} className="text-blue-500" /> Daily
                        </span>
                        <span className="text-sm font-extrabold text-gray-900">{stats.daily_bookings}</span>
                      </div>
                      <div className="my-3 border-t border-gray-100" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">Total</span>
                        <span className="text-sm font-extrabold text-red-600">{stats.total_bookings}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status breakdown */}
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">Bookings by Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Hourglass size={16} className="text-amber-500" /> Pending
                        </span>
                        <span className="text-sm font-extrabold text-gray-900">{stats.pending_bookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <CheckCircle size={16} className="text-green-500" /> Confirmed
                        </span>
                        <span className="text-sm font-extrabold text-gray-900">{stats.confirmed_bookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <XCircle size={16} className="text-red-500" /> Rejected
                        </span>
                        <span className="text-sm font-extrabold text-gray-900">{stats.rejected_bookings}</span>
                      </div>
                      <div className="my-3 border-t border-gray-100" />
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <IndianRupee size={16} className="text-green-500" /> Paid
                        </span>
                        <span className="text-sm font-extrabold text-gray-900">{stats.paid_bookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <XCircle size={16} className="text-gray-400" /> Unpaid
                        </span>
                        <span className="text-sm font-extrabold text-gray-900">{stats.unpaid_bookings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* === USERS === */}
            {activeTab === "users" && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    {userFilter ? `${userFilter.charAt(0).toUpperCase() + userFilter.slice(1)}s` : "All Users"}
                    <span className="ml-2 text-sm font-medium text-gray-500">({usersData.total})</span>
                  </h2>
                  <div className="flex gap-2">
                    {["", "booker", "owner", "admin"].map((role) => (
                      <button
                        key={role}
                        onClick={() => { setUserFilter(role); setUserPage(1); }}
                        className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                          userFilter === role
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {role || "All"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Name</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {usersData.items.map((user) => (
                          <tr key={user.id} className="transition hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                            <td className="px-6 py-4">
                              <Badge color={user.role === "admin" ? "purple" : user.role === "owner" ? "blue" : "green"}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {usersData.items.length === 0 && (
                    <div className="px-6 py-10 text-center text-sm text-gray-500">No users found.</div>
                  )}
                </div>
                <Pagination page={usersData.page} pages={usersData.pages} setter={setUserPage} />
              </div>
            )}

            {/* === VENUES === */}
            {activeTab === "venues" && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    All Venues <span className="ml-2 text-sm font-medium text-gray-500">({venuesData.total})</span>
                  </h2>
                  <div className="flex gap-2">
                    {["", "active", "inactive"].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setVenueFilter(s); setVenuePage(1); }}
                        className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                          venueFilter === s
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {s || "All"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {venuesData.items.map((venue) => (
                    <div key={venue.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-gray-900">{venue.name}</h3>
                        <Badge color={venue.status === "active" ? "green" : "red"}>{venue.status}</Badge>
                      </div>
                      <div className="mt-4 space-y-1.5 text-xs text-gray-600">
                        <p className="flex items-center gap-1.5">
                          <MapPin size={12} className="shrink-0" />
                          {venue.city}, {venue.address_line?.slice(0, 30)}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <User size={12} className="shrink-0" />
                          Owner ID: {venue.owner_id}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Building2 size={12} className="shrink-0" />
                          Capacity: {venue.capacity}
                        </p>
                      </div>
                      <button
                        onClick={() => updateVenueStatus(venue.id, venue.status === "active" ? "inactive" : "active", token).then(loadAll)}
                        className={`mt-5 w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wide transition ${
                          venue.status === "active"
                            ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {venue.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  ))}
                  {venuesData.items.length === 0 && (
                    <div className="col-span-full py-10 text-center text-sm text-gray-500">No venues found.</div>
                  )}
                </div>
                <Pagination page={venuesData.page} pages={venuesData.pages} setter={setVenuePage} />
              </div>
            )}

            {/* === BOOKINGS === */}
            {activeTab === "bookings" && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    All Bookings <span className="ml-2 text-sm font-medium text-gray-500">({bookingsData.total})</span>
                  </h2>
                  <div className="flex gap-2">
                    {["", "pending", "confirmed", "rejected"].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setBookingFilter(s); setBookingPage(1); }}
                        className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                          bookingFilter === s
                            ? "bg-red-600 text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {s || "All"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {bookingsData.items.map((booking) => (
                    <div key={booking.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">
                              {booking.venue_name || "Venue #" + booking.venue_id}
                            </span>
                            <Badge color={booking.status === "confirmed" ? "green" : booking.status === "rejected" ? "red" : "amber"}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {booking.booker_name || "Booker #" + booking.booker_id}
                            </span>
                            <span className="flex items-center gap-1 capitalize">
                              <CalendarDays size={12} />
                              {booking.booking_type}
                            </span>
                            <span className="flex items-center gap-1 capitalize">
                              <IndianRupee size={12} />
                              {booking.total_amount}
                            </span>
                            <span className="flex items-center gap-1 capitalize">
                              {booking.payment_status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {booking.slots?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {booking.slots.map((slot) => (
                            <span key={slot.id} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700">
                              {slot.date ? new Date(slot.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : ""}
                              {slot.start_time ? ` ${slot.start_time.slice(0, 5)}-${slot.end_time?.slice(0, 5)}` : " Full Day"}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 text-xs text-gray-400">
                        {new Date(booking.created_at).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                  {bookingsData.items.length === 0 && (
                    <div className="py-10 text-center text-sm text-gray-500">No bookings found.</div>
                  )}
                </div>
                <Pagination page={bookingsData.page} pages={bookingsData.pages} setter={setBookingPage} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;