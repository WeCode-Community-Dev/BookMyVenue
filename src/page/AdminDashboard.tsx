import { useState, useEffect } from "react";
import { 
  Shield, Users, Home, Calendar, DollarSign, CheckCircle2, XCircle, 
  Eye, RefreshCw, LogOut, ArrowRight, ClipboardList, Info, AlertTriangle,
  Menu, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<"approvals" | "venues" | "bookings" | "users">("approvals");
  const [venueFilter, setVenueFilter] = useState<"all" | "pending" | "approved" | "declined">("all");
  const [venueSearch, setVenueSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "user" | "venue_owner" | "admin">("all");
  
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [decliningVenueId, setDecliningVenueId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  const triggerDecline = (venueId: string) => {
    setDecliningVenueId(venueId);
    setRejectionReasonInput("");
  };
  const [errorMsg, setErrorMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch admin dashboard details
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      // 1. Fetch Stats
      const statsRes = await fetch("http://localhost:5000/api/admin/stats", { headers });
      if (!statsRes.ok) throw new Error("Failed to fetch dashboard stats");
      const statsData = await statsRes.json();
      setStats(statsData.stats);

      // 2. Fetch Venues
      const venuesRes = await fetch("http://localhost:5000/api/admin/venues", { headers });
      if (!venuesRes.ok) throw new Error("Failed to fetch venues list");
      const venuesData = await venuesRes.json();
      setVenues(venuesData);

      // 3. Fetch Bookings
      const bookingsRes = await fetch("http://localhost:5000/api/admin/bookings", { headers });
      if (!bookingsRes.ok) throw new Error("Failed to fetch bookings list");
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      // 4. Fetch Users
      const usersRes = await fetch("http://localhost:5000/api/admin/users", { headers });
      if (!usersRes.ok) throw new Error("Failed to fetch users list");
      const usersData = await usersRes.json();
      setUsers(usersData);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred while loading admin dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Check if user is actually admin
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.role !== "admin") {
          navigate("/");
          return;
        }
      } catch (e) {
        navigate("/login");
        return;
      }
    }

    fetchDashboardData();
  }, [token]);

  // Handle Approve/Decline actions
  const handleUpdateStatus = async (venueId: string, newStatus: "approved" | "declined", reason?: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/venues/${venueId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, rejectionReason: reason || "" })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update status");
      }

      // Proactively refresh list & statistics
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || "Error updating venue status");
    }
  };

  // Filter functions
  const pendingVenues = venues.filter(v => v.status === "pending");

  const filteredVenues = venues.filter(v => {
    const matchesSearch = !venueSearch || 
      v.title.toLowerCase().includes(venueSearch.toLowerCase()) ||
      v.location.toLowerCase().includes(venueSearch.toLowerCase()) ||
      v.hostEmail.toLowerCase().includes(venueSearch.toLowerCase());

    const matchesStatus = venueFilter === "all" || v.status === venueFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = bookings.filter(b => {
    if (!bookingSearch) return true;
    const searchLower = bookingSearch.toLowerCase();
    return (
      b.id.toLowerCase().includes(searchLower) ||
      b.venueTitle.toLowerCase().includes(searchLower) ||
      b.renterName.toLowerCase().includes(searchLower) ||
      b.renterEmail.toLowerCase().includes(searchLower)
    );
  });

  const filteredUsers = users.filter(u => {
    if (userRoleFilter === "all") return true;
    return u.role === userRoleFilter;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex font-sans overflow-hidden relative w-full">
      {/* Background Graphic Patterns */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hixs-evolution.png')] opacity-10 pointer-events-none" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ab8237]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (left panel) */}
      <aside className={`fixed inset-y-0 left-0 w-64 border-r border-white/5 bg-[#0e0e12]/95 backdrop-blur-xl md:bg-black/40 flex flex-col flex-shrink-0 z-30 transition-transform duration-300 md:translate-x-0 md:static md:h-screen ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Sidebar Header / Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-[#c5a059]/20 p-2 rounded-xl border border-[#c5a059]/30">
              <Shield className="w-5 h-5 text-[#c5a059]" />
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-white flex flex-col">
                BookMyVenue 
                <span className="text-[10px] uppercase text-[#c5a059] font-mono tracking-wider font-semibold">Admin Panel</span>
              </h1>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/50 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => { setActiveTab("approvals"); setSidebarOpen(false); }}
            className={`w-full px-4 py-3 rounded-xl font-medium text-xs transition-all flex items-center justify-between ${
              activeTab === "approvals"
                ? "bg-[#c5a059] text-black shadow-lg shadow-[#c5a059]/20 font-bold"
                : "bg-transparent hover:bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4" />
              <span>Venue Approvals</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              activeTab === "approvals"
                ? "bg-black text-[#c5a059]"
                : "bg-white/10 text-white/60"
            }`}>
              {pendingVenues.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("venues"); setSidebarOpen(false); }}
            className={`w-full px-4 py-3 rounded-xl font-medium text-xs transition-all flex items-center justify-between ${
              activeTab === "venues"
                ? "bg-[#c5a059] text-black shadow-lg shadow-[#c5a059]/20 font-bold"
                : "bg-transparent hover:bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4" />
              <span>All Venues</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              activeTab === "venues"
                ? "bg-black text-[#c5a059]"
                : "bg-white/10 text-white/60"
            }`}>
              {venues.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("bookings"); setSidebarOpen(false); }}
            className={`w-full px-4 py-3 rounded-xl font-medium text-xs transition-all flex items-center justify-between ${
              activeTab === "bookings"
                ? "bg-[#c5a059] text-black shadow-lg shadow-[#c5a059]/20 font-bold"
                : "bg-transparent hover:bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>All Bookings</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
            className={`w-full px-4 py-3 rounded-xl font-medium text-xs transition-all flex items-center justify-between ${
              activeTab === "users"
                ? "bg-[#c5a059] text-black shadow-lg shadow-[#c5a059]/20 font-bold"
                : "bg-transparent hover:bg-white/5 text-white/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Users Directory</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 text-xs text-red-400/80 hover:text-red-400 px-4 py-2.5 rounded-lg hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area (right panel) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        {/* Top Header of Content Area */}
        <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-5 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for mobile */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-white/70 hover:text-white md:hidden border border-white/10 rounded-lg hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchDashboardData} 
              className="flex items-center justify-center p-2.5 rounded-full hover:bg-white/5 transition-all text-white/70 hover:text-white"
              title="Refresh statistics"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-[#c5a059]" : ""}`} />
            </button>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-[#c5a059] flex items-center justify-center text-black font-bold text-xs uppercase select-none">
                A
              </div>
              <span className="text-xs font-medium text-white/80">Administrator</span>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-grow px-4 sm:px-8 py-8 w-full max-w-6xl mx-auto pb-24">
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold">Error loading dashboard</h3>
                <p className="text-sm opacity-90">{errorMsg}</p>
                <button 
                  onClick={fetchDashboardData} 
                  className="mt-2 text-xs font-bold text-[#c5a059] hover:underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Financial & Count KPIs */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Earnings Card */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">Total Financial Volume</p>
              <h3 className="text-3xl font-normal text-white mb-2 font-mono">
                ₹{stats ? stats.totalVolume.toLocaleString() : "0"}
              </h3>
              <p className="text-xs text-white/40 flex items-center gap-1">
                Processed through BookMyVenue
              </p>
            </div>

            {/* Platform Share */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">Platform Revenue (10%)</p>
              <h3 className="text-3xl font-bold text-[#c5a059] mb-2 font-mono">
                ₹{stats ? stats.platformEarnings.toLocaleString() : "0"}
              </h3>
              <p className="text-xs text-white/40 flex items-center gap-1">
                Collected platform charge fee
              </p>
            </div>

            {/* Host Payout Share */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group transition-all">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">Venue Owners Share (90%)</p>
              <h3 className="text-3xl font-normal text-white mb-2 font-mono">
                ₹{stats ? stats.hostEarnings.toLocaleString() : "0"}
              </h3>
              <p className="text-xs text-white/40">
                Total payouts disbursed to hosts
              </p>
            </div>
          </section>

          {/* Tab 1: Venue Approvals (accept/decline menu) */}
          {activeTab === "approvals" && (
            <div className="bg-black/30 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">Pending Submissions</h3>
                  <p className="text-xs text-white/50">New venue requests requiring verification and review</p>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-10 h-10 border-2 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
                  <p className="text-sm text-white/50">Fetching queue...</p>
                </div>
              ) : pendingVenues.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5">
                  <CheckCircle2 className="w-12 h-12 text-green-400/30 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-white/80">All caught up!</h4>
                  <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">There are no pending venue submissions waiting for review at this time.</p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-xs text-white/40 uppercase tracking-wider">
                        <th className="py-4 px-4 font-semibold">Venue Detail</th>
                        <th className="py-4 px-4 font-semibold">Location</th>
                        <th className="py-4 px-4 font-semibold">Specs & Pricing</th>
                        <th className="py-4 px-4 font-semibold">Host Owner</th>
                        <th className="py-4 px-4 font-semibold text-center">Approve / Decline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {pendingVenues.map((venue) => (
                        <tr key={venue.id} className="hover:bg-white/5 transition-colors group">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={venue.images[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=300"}
                                alt={venue.title}
                                className="w-12 h-12 object-cover rounded-lg border border-white/10"
                              />
                              <div>
                                <div className="font-semibold text-white group-hover:text-[#c5a059] transition-colors">{venue.title}</div>
                                <div className="text-xs text-white/40 max-w-[200px] truncate">{venue.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white/80 font-medium">
                            {venue.location}
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <span className="font-semibold text-white">₹{venue.pricePerNight.toLocaleString()}</span>
                              <span className="text-white/40 text-xs"> / night</span>
                            </div>
                            <div className="text-xs text-white/50">{venue.capacity} Guests • {venue.squareFeet} SqFt</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-white/80">{venue.hostName}</div>
                            <div className="text-xs text-white/40">{venue.hostEmail}</div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedVenue(venue)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
                                title="Review Info"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Info
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(venue.id, "approved")}
                                className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 hover:scale-102 transition-all flex items-center gap-1 text-xs font-semibold"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => triggerDecline(venue.id)}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 hover:scale-102 transition-all flex items-center gap-1 text-xs font-semibold"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Decline
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: All Venues Directory catalog */}
          {activeTab === "venues" && (
            <div className="bg-black/30 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">All Venues Catalog</h3>
                  <p className="text-xs text-white/50">Comprehensive directory list of all registered venues and approval statuses</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Search Bar */}
                  <input
                    type="text"
                    placeholder="Search venues by title, host, city..."
                    value={venueSearch}
                    onChange={(e) => setVenueSearch(e.target.value)}
                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#c5a059] placeholder-white/20 transition-all w-full sm:w-48 text-white"
                  />

                  {/* Status Filter */}
                  <div className="flex items-center gap-1 bg-black/60 border border-white/5 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                    <button
                      onClick={() => setVenueFilter("all")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        venueFilter === "all"
                          ? "bg-white/10 text-white border border-white/10"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      All ({venues.length})
                    </button>
                    <button
                      onClick={() => setVenueFilter("approved")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        venueFilter === "approved"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Approved ({venues.filter(v => v.status === "approved").length})
                    </button>
                    <button
                      onClick={() => setVenueFilter("pending")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        venueFilter === "pending"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Pending ({venues.filter(v => v.status === "pending").length})
                    </button>
                    <button
                      onClick={() => setVenueFilter("declined")}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        venueFilter === "declined"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Declined ({venues.filter(v => v.status === "declined").length})
                    </button>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-10 h-10 border-2 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
                  <p className="text-sm text-white/50">Fetching catalog...</p>
                </div>
              ) : filteredVenues.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5">
                  <Home className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-white/80">No venues found</h4>
                  <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">Try adjusting the search input or status filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-xs text-white/40 uppercase tracking-wider">
                        <th className="py-4 px-4 font-semibold">Venue Detail</th>
                        <th className="py-4 px-4 font-semibold">Location</th>
                        <th className="py-4 px-4 font-semibold">Specs & Pricing</th>
                        <th className="py-4 px-4 font-semibold">Host Owner</th>
                        <th className="py-4 px-4 font-semibold">Status</th>
                        <th className="py-4 px-4 font-semibold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {filteredVenues.map((venue) => (
                        <tr key={venue.id} className="hover:bg-white/5 transition-colors group">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={venue.images[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=300"}
                                alt={venue.title}
                                className="w-12 h-12 object-cover rounded-lg border border-white/10"
                              />
                              <div>
                                <div className="font-semibold text-white group-hover:text-[#c5a059] transition-colors">{venue.title}</div>
                                <div className="text-xs text-white/40 max-w-[200px] truncate">{venue.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white/80 font-medium">
                            {venue.location}
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <span className="font-semibold text-white">₹{venue.pricePerNight.toLocaleString()}</span>
                              <span className="text-white/40 text-xs"> / night</span>
                            </div>
                            <div className="text-xs text-white/50">{venue.capacity} Guests • {venue.squareFeet} SqFt</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-white/80">{venue.hostName}</div>
                            <div className="text-xs text-white/40">{venue.hostEmail}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              venue.status === "approved"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : venue.status === "declined"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                venue.status === "approved" ? "bg-green-400" : venue.status === "declined" ? "bg-red-400" : "bg-yellow-400"
                              }`} />
                              {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedVenue(venue)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all flex items-center gap-1 text-xs"
                                title="View Venue Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View
                              </button>
                              <button
                                onClick={() => venue.status === "approved" ? triggerDecline(venue.id) : handleUpdateStatus(venue.id, "approved")}
                                className={`text-[10px] border px-2 py-1 rounded-lg font-bold transition-all ${
                                  venue.status === "approved"
                                    ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                                    : "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                                }`}
                              >
                                {venue.status === "approved" ? "Decline" : "Approve"}
                              </button>
                              {venue.status !== "pending" && (
                                <button
                                  onClick={() => handleUpdateStatus(venue.id, "pending")}
                                  className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-1 rounded-lg text-white/60 hover:text-white transition-all"
                                >
                                  Set Pending
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        {/* Tab 3: All Bookings grouped by search/filter */}
        {activeTab === "bookings" && (
          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">All Platform Transactions</h3>
                <p className="text-xs text-white/50">Audit log of all booking actions, payment disbursements, and rentals</p>
              </div>

              {/* Booking Search input */}
              <div className="w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search by BKG ID, venue, or renter name..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#c5a059] placeholder-white/20 transition-all"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-2 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
                <p className="text-sm text-white/50">Fetching booking logs...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5">
                <ClipboardList className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-white/80">No bookings found</h4>
                <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">There are no booking logs currently matching your search query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-white/40 uppercase tracking-wider">
                      <th className="py-4 px-4 font-semibold">Booking ID</th>
                      <th className="py-4 px-4 font-semibold">Venue Info</th>
                      <th className="py-4 px-4 font-semibold">Renter Contact</th>
                      <th className="py-4 px-4 font-semibold">Rental Dates</th>
                      <th className="py-4 px-4 font-semibold">Price Breakdown</th>
                      <th className="py-4 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredBookings.map((b) => {
                      // Calculate individual splits for display audit
                      const total = b.totalPrice;
                      const platformCut = Math.round(total * 0.10);
                      const hostPayout = total - platformCut;
                      
                      return (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          {/* Booking ID */}
                          <td className="py-4 px-4 font-mono font-bold text-white/95">
                            {b.id}
                            <div className="text-[10px] text-white/30 font-sans mt-0.5">
                              {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : ""}
                            </div>
                          </td>

                          {/* Venue info */}
                          <td className="py-4 px-4">
                            <div className="font-semibold text-white">{b.venueTitle}</div>
                            <div className="text-xs text-white/40">{b.venueLocation}</div>
                          </td>

                          {/* Renter Contact details */}
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">{b.renterName}</div>
                            <div className="text-xs text-white/50">{b.renterEmail}</div>
                            {b.renterPhone && <div className="text-[10px] text-[#c5a059] font-mono mt-0.5">{b.renterPhone}</div>}
                          </td>

                          {/* Dates */}
                          <td className="py-4 px-4 font-medium text-white/80">
                            <div className="text-xs">
                              {new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                            <div className="text-[10px] text-white/30 my-0.5 flex justify-start items-center gap-1">
                              <ArrowRight className="w-2.5 h-2.5" />
                              To
                            </div>
                            <div className="text-xs">
                              {new Date(b.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          </td>

                          {/* Price & platform split audit */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-white">₹{total.toLocaleString()}</div>
                            {b.paymentStatus === "paid" && b.status !== "cancelled" ? (
                              <div className="text-[10px] text-white/40 flex flex-col mt-0.5 font-mono">
                                <span className="text-[#c5a059]">Platform (10%): +₹{platformCut.toLocaleString()}</span>
                                <span>Host Payout (90%): ₹{hostPayout.toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-white/30 font-sans italic">No commission (cancelled/offline)</span>
                            )}
                          </td>

                          {/* Status tags */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                                b.status === "upcoming"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : b.status === "cancelled"
                                  ? "bg-red-500/10 text-red-400"
                                  : b.status === "offline"
                                  ? "bg-purple-500/10 text-purple-400"
                                  : "bg-green-500/10 text-green-400"
                              }`}>
                                {b.status}
                              </span>

                              <span className={`text-[10px] font-mono capitalize ${
                                b.paymentStatus === "paid"
                                  ? "text-green-400"
                                  : b.paymentStatus === "refunded"
                                  ? "text-red-400"
                                  : "text-white/40"
                              }`}>
                                {b.paymentStatus}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Users Directory */}
        {activeTab === "users" && (
          <div className="bg-black/30 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white">Users & Hosts Directory</h3>
                <p className="text-xs text-white/50">Comprehensive registry of all registered tenants, system administrators, and hosts</p>
              </div>

              {/* Role filter */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-white/5 p-1 rounded-xl">
                <button
                  onClick={() => setUserRoleFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    userRoleFilter === "all"
                      ? "bg-white/10 text-white border border-white/10"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  All Users ({users.length})
                </button>
                <button
                  onClick={() => setUserRoleFilter("user")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    userRoleFilter === "user"
                      ? "bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Renters ({users.filter(u => u.role === "user").length})
                </button>
                <button
                  onClick={() => setUserRoleFilter("venue_owner")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    userRoleFilter === "venue_owner"
                      ? "bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Venue Owners ({users.filter(u => u.role === "venue_owner").length})
                </button>
                <button
                  onClick={() => setUserRoleFilter("admin")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    userRoleFilter === "admin"
                      ? "bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Admins ({users.filter(u => u.role === "admin").length})
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-2 border-[#c5a059]/30 border-t-[#c5a059] rounded-full animate-spin" />
                <p className="text-sm text-white/50">Fetching user database...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-white/5">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <h4 className="text-lg font-medium text-white/80">No members found</h4>
                <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">There are no registered users currently matching the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-white/40 uppercase tracking-wider">
                      <th className="py-4 px-4 font-semibold">User ID</th>
                      <th className="py-4 px-4 font-semibold">Member Name</th>
                      <th className="py-4 px-4 font-semibold">Email Identifier</th>
                      <th className="py-4 px-4 font-semibold">Assigned Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-mono text-white/50 text-xs">
                          USR-{u.id.toString().padStart(4, "0")}
                        </td>
                        <td className="py-4 px-4 font-semibold text-white">
                          {u.name}
                        </td>
                        <td className="py-4 px-4 text-white/85">
                          {u.email}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            u.role === "admin"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : u.role === "venue_owner"
                              ? "bg-[#c5a059]/20 text-[#c5a059] border-[#c5a059]/30"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}>
                            {u.role === "admin" 
                              ? "Administrator" 
                              : u.role === "venue_owner" 
                              ? "Venue Host" 
                              : "Renter / Client"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        </main>
      </div>

      {/* Detail Modal Overlay for inspection */}
      {selectedVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedVenue(null)}
          />
          
          {/* Modal box */}
          <div className="relative bg-[#0e0e12] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 custom-scrollbar text-white flex flex-col">
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedVenue.images[0] || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600"}
                alt={selectedVenue.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e12] via-transparent to-transparent" />
              <button 
                onClick={() => setSelectedVenue(null)}
                className="absolute top-4 right-4 bg-black/60 border border-white/10 hover:bg-black/80 p-2 rounded-full transition-all text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 border ${
                  selectedVenue.status === "approved"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : selectedVenue.status === "declined"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }`}>
                  {selectedVenue.status.toUpperCase()}
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal text-white">{selectedVenue.title}</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Top Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-white/5">
                <div>
                  <div className="text-xs text-white/40 uppercase font-semibold">Host Owner</div>
                  <div className="text-sm font-semibold text-white/95 mt-1">{selectedVenue.hostName}</div>
                  <div className="text-[11px] text-white/50">{selectedVenue.hostEmail}</div>
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase font-semibold">Location</div>
                  <div className="text-sm font-semibold text-white/95 mt-1">{selectedVenue.location}</div>
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase font-semibold">Pricing Rate</div>
                  <div className="text-sm font-semibold text-[#c5a059] mt-1">₹{selectedVenue.pricePerNight.toLocaleString()}<span className="text-white/40 text-xs">/night</span></div>
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase font-semibold">Capacity</div>
                  <div className="text-sm font-semibold text-white/95 mt-1">{selectedVenue.capacity} Guests</div>
                  <div className="text-[11px] text-white/50">{selectedVenue.squareFeet} Sq. Feet</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase text-white/40 font-semibold tracking-wider mb-2">Venue Description</h4>
                <p className="text-sm text-white/70 leading-relaxed font-light">{selectedVenue.description}</p>
              </div>

              {/* Full Address */}
              <div>
                <h4 className="text-xs uppercase text-white/40 font-semibold tracking-wider mb-2">Address details</h4>
                <p className="text-sm text-white/80 font-medium">{selectedVenue.fullAddress}</p>
              </div>

              {/* Amenities, Rules & Event Types */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <h4 className="text-xs uppercase text-white/40 font-semibold tracking-wider mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVenue.amenities?.map((am: string, i: number) => (
                      <span key={i} className="text-xs bg-white/5 border border-white/5 px-2 py-1 rounded-md text-white/80">{am}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-white/40 font-semibold tracking-wider mb-2">Suitable Events</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVenue.eventTypes?.map((et: string, i: number) => (
                      <span key={i} className="text-xs bg-white/5 border border-white/5 px-2 py-1 rounded-md text-[#c5a059]/80">{et}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-white/40 font-semibold tracking-wider mb-2">Rules & Guidelines</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVenue.rules?.map((rule: string, i: number) => (
                      <span key={i} className="text-xs bg-white/5 border border-white/5 px-2 py-1 rounded-md text-white/60">{rule}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action controls inside modal */}
              {selectedVenue.status === "pending" && (
                <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                  <button
                    onClick={() => {
                      triggerDecline(selectedVenue.id);
                    }}
                    className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm rounded-xl border border-red-500/20 transition-all flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline Venue
                  </button>

                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedVenue.id, "approved");
                      setSelectedVenue(null);
                    }}
                    className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#ab8237] text-black font-semibold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#c5a059]/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Venue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {decliningVenueId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setDecliningVenueId(null)}
          />
          
          {/* Modal Box */}
          <div className="relative bg-[#0e0e12] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl z-10 text-white space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Reject Venue Request</h3>
            </div>
            
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Please specify the reason for declining this venue request. This explanation will be displayed to the venue owner on their dashboard.
            </p>
            
            <div className="space-y-1.5">
              <label htmlFor="rejectionReason" className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">Rejection Reason *</label>
              <textarea
                id="rejectionReason"
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="e.g. Please upload higher quality photos of the interior space."
                rows={4}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDecliningVenueId(null)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-semibold h-11 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectionReasonInput.trim()}
                onClick={() => {
                  handleUpdateStatus(decliningVenueId, "declined", rejectionReasonInput.trim());
                  setDecliningVenueId(null);
                  setSelectedVenue(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:hover:bg-red-600 text-white font-semibold rounded-xl text-xs h-11 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/20"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
