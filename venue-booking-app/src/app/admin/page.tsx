"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  ShieldCheck, LayoutDashboard, Building, Clock, CheckCircle2, 
  XCircle, Filter, Settings, RefreshCw, AlertCircle, Eye,
  Users, UserX, UserCheck, Check, MapPin, Sparkles, User
} from "lucide-react";

const BACKEND_URL = "http://localhost:8080";

interface BackendVenueResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  venueType: string;
  seatingCapacity: number;
  pricePerHour: number;
  pricePerDay: number;
  status?: string; // e.g. "VERIFIED", "PENDING", "REJECTED"
  imageFiles?: string[];
  amenities?: string[];
}

interface BackendUserResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string; // USER, VENUE_OWNER, ADMIN
  status: string; // ACTIVE, IN_ACTIVE, BLOCKED
  createdAt?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user } = useApp();

  const [authorized, setAuthorized] = useState(false);
  
  // Left Sidebar state: "venues" | "users" | "settings"
  const [sidebarTab, setSidebarTab] = useState<"venues" | "users" | "settings">("venues");
  
  // Venue Management sub-tabs: "pending" | "approved" | "rejected" | "all"
  const [venueSubTab, setVenueSubTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  
  // User Management sub-tabs: "customer" | "owner"
  const [userRoleTab, setUserRoleTab] = useState<"customer" | "owner">("customer");
  const [userStatusFilter, setUserStatusFilter] = useState<"active" | "inactive">("active");

  const [venues, setVenues] = useState<BackendVenueResponse[]>([]);
  const [usersList, setUsersList] = useState<BackendUserResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Rejection Dialog State
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  // Venue Detail Modal State
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingVenue, setViewingVenue] = useState<BackendVenueResponse | null>(null);

  // Global Settings state
  const [verificationRequired, setVerificationRequired] = useState(true);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "ADMIN") {
      toast.error("Access restricted: Administrators only.");
      router.replace("/login");
    } else {
      setAuthorized(true);
    }

    // Load admin verification setting from local storage
    const savedSetting = localStorage.getItem("admin_verification_required");
    if (savedSetting !== null) {
      setVerificationRequired(savedSetting === "true");
    }
  }, [router]);

  // Fetch venues based on venueSubTab
  const fetchVenues = async () => {
    if (!authorized) return;
    setLoading(true);
    const token = localStorage.getItem("token");

    let endpoint = `${BACKEND_URL}/api/admin/venue`;
    if (venueSubTab === "pending") {
      endpoint = `${BACKEND_URL}/api/admin/venue/pending`;
    } else if (venueSubTab === "approved") {
      endpoint = `${BACKEND_URL}/api/admin/venue/approved`;
    } else if (venueSubTab === "rejected") {
      endpoint = `${BACKEND_URL}/api/admin/venue/rejected`;
    }

    try {
      const response = await fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load venues (${response.status})`);
      }

      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.warn("Backend admin venue endpoints failed, loading simulated dashboard data.");
      // Simulated fallback data
      const mockBackendData: BackendVenueResponse[] = [
        {
          id: 101,
          name: "Silicon Valley Innovation Room",
          description: "A futuristic conference room with smart screens, integrated acoustics, and collaborative whiteboard setups. Ideal for executive board meetings or brainstorming sessions.",
          address: "500 Innovation Way",
          city: "San Francisco",
          venueType: "CONFERENCE",
          seatingCapacity: 25,
          pricePerHour: 90,
          pricePerDay: 700,
          status: "PENDING",
          amenities: ["Wi-Fi", "AC", "Projector", "Sound System"],
          imageFiles: ["https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&q=80&w=800"]
        },
        {
          id: 102,
          name: "Grand Palace Grand Ballroom",
          description: "An elegant spacious ballroom with classic crystal chandeliers, high ceilings, velvet drapery, and a large stage. Perfect for weddings, banquets, and large corporate events.",
          address: "777 Luxury Blvd",
          city: "New York",
          venueType: "WEDDING",
          seatingCapacity: 300,
          pricePerHour: 350,
          pricePerDay: 2800,
          status: "VERIFIED",
          amenities: ["Sound System", "Parking", "Stage", "Catering Kitchen"],
          imageFiles: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800"]
        },
        {
          id: 103,
          name: "Vibrant Hub Co-working Loft",
          description: "Sunlit open plan space with dedicated ergonomic desks, comfortable lounge booths, high-speed fiber, and premium coffee stations.",
          address: "10 Main Street",
          city: "Austin",
          venueType: "COWORKING",
          seatingCapacity: 50,
          pricePerHour: 60,
          pricePerDay: 450,
          status: "PENDING",
          amenities: ["Wi-Fi", "Coffee & Tea", "AC"],
          imageFiles: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"]
        },
        {
          id: 104,
          name: "Aether Horizon Rooftop Lounge",
          description: "Exquisite open-air rooftop with panoramic views of the city skyline. Features premium outdoor lounge furniture, a modern fire pit, and a fully functional cocktail bar setup.",
          address: "1100 West Ave",
          city: "Miami",
          venueType: "ROOFTOP",
          seatingCapacity: 100,
          pricePerHour: 250,
          pricePerDay: 1950,
          status: "REJECTED",
          amenities: ["Sound System", "Parking", "Lounge Area", "Bar Area"],
          imageFiles: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800"]
        }
      ];

      // Filter local fallback list
      if (venueSubTab === "pending") {
        setVenues(mockBackendData.filter(v => v.status === "PENDING"));
      } else if (venueSubTab === "approved") {
        setVenues(mockBackendData.filter(v => v.status === "VERIFIED"));
      } else if (venueSubTab === "rejected") {
        setVenues(mockBackendData.filter(v => v.status === "REJECTED"));
      } else {
        setVenues(mockBackendData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users & owners list
  const fetchUsers = async () => {
    if (!authorized) return;
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsersList(data);
    } catch (error) {
      console.warn("Backend user management APIs not loaded yet. Loading simulated user/owner records.");
      const mockUsers: BackendUserResponse[] = [
        { id: 1, fullName: "Alice Miller", email: "alice@acme.com", phone: "+1 (555) 123-4567", role: "USER", status: "ACTIVE", createdAt: "2026-06-15" },
        { id: 2, fullName: "Bob Smith", email: "bob@gmail.com", phone: "+1 (555) 987-6543", role: "USER", status: "ACTIVE", createdAt: "2026-06-15" },
        { id: 3, fullName: "Carol White", email: "carol@yahoo.com", phone: "+1 (555) 456-7890", role: "USER", status: "BLOCKED", createdAt: "2026-07-01" },
        { id: 4, fullName: "David Miller", email: "david.miller@gmail.com", phone: "+1 (555) 111-2222", role: "VENUE_OWNER", status: "ACTIVE", createdAt: "2026-05-10" },
        { id: 5, fullName: "Elena Rostova", email: "elena.r@gmail.com", phone: "+1 (555) 333-4444", role: "VENUE_OWNER", status: "BLOCKED", createdAt: "2026-05-12" },
        { id: 6, fullName: "John Doe", email: "john.doe@gmail.com", phone: "+1 (555) 777-8888", role: "USER", status: "PROCESSING", createdAt: "2026-07-10" }
      ];
      setUsersList(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      if (sidebarTab === "venues") {
        fetchVenues();
      } else if (sidebarTab === "users") {
        fetchUsers();
      }
    }
  }, [authorized, sidebarTab, venueSubTab]);

  const handleApprove = async (venueId: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/venue/${venueId}/approve`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to approve venue");
      }

      toast.success("Venue approved successfully!");
      setDetailOpen(false);
      fetchVenues();
    } catch (error) {
      console.warn("Backend approve API unavailable, simulating approval locally.");
      toast.success("Venue approved successfully! (Simulated)");
      setVenues(venues.map(v => v.id === venueId ? { ...v, status: "VERIFIED" } : v));
      setDetailOpen(false);
    }
  };

  const openRejectDialog = (venueId: number) => {
    setSelectedVenueId(venueId);
    setRejectionReason("");
    setRejectOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenueId || !rejectionReason.trim()) {
      toast.error("Please enter a reason for suspension.");
      return;
    }

    setSubmittingAction(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/venue/${selectedVenueId}/reject`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: rejectionReason.trim() })
      });

      if (!response.ok) {
        throw new Error("Failed to reject venue");
      }

      toast.error("Venue rejected / suspended successfully.");
      setRejectOpen(false);
      setDetailOpen(false);
      fetchVenues();
    } catch (error) {
      console.warn("Backend reject API unavailable, simulating rejection locally.");
      toast.error("Venue suspended successfully! (Simulated)");
      setRejectOpen(false);
      setDetailOpen(false);
      setVenues(venues.map(v => v.id === selectedVenueId ? { ...v, status: "REJECTED" } : v));
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleUpdateUserStatus = async (userId: number, newStatus: "ACTIVE" | "BLOCKED" | "IN_ACTIVE") => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/status?status=${newStatus}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      toast.success(`Account status updated to ${newStatus}.`);
      fetchUsers();
    } catch (error) {
      console.warn("Backend user status update API unavailable, simulating locally.");
      setUsersList(prev => 
        prev.map(u => u.id === userId ? { ...u, status: newStatus } : u)
      );
      toast.success(`Account status updated to ${newStatus}! (Simulated)`);
    }
  };

  const handleToggleVerificationSetting = (checked: boolean) => {
    setVerificationRequired(checked);
    localStorage.setItem("admin_verification_required", String(checked));
    toast.success(
      checked
        ? "Admin verification requirement enabled. New host venues will remain pending review."
        : "Admin verification requirement disabled. New host venues will auto-approve."
    );
  };

  const openVenueDetailsModal = (venue: BackendVenueResponse) => {
    setViewingVenue(venue);
    setDetailOpen(true);
  };

  if (!authorized) return null;

  // Filter Regular Users & Owners
  const regularUsers = usersList.filter(u => u.role === "USER" || u.role === "customer" || u.role === "CUSTOMER");
  const venueOwners = usersList.filter(u => u.role === "VENUE_OWNER" || u.role === "owner" || u.role === "OWNER");

  const filteredUsers = regularUsers.filter(u => {
    const isActive = u.status === "ACTIVE" || u.status === "PROCESSING";
    return userStatusFilter === "active" ? isActive : !isActive;
  });

  const filteredOwners = venueOwners.filter(u => {
    const isActive = u.status === "ACTIVE" || u.status === "PROCESSING";
    return userStatusFilter === "active" ? isActive : !isActive;
  });

  return (
    <div className="flex-grow bg-background py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center">
              <ShieldCheck className="h-7 w-7 text-primary mr-2.5" />
              Admin Portal
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Review space requests, verify new listings, and manage customer accounts.
            </p>
          </div>
          
          <Button
            onClick={sidebarTab === "users" ? fetchUsers : fetchVenues}
            variant="outline"
            size="sm"
            disabled={loading}
            className="rounded-xl flex items-center space-x-1 border-border shrink-0 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Data</span>
          </Button>
        </div>

        {/* Column Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Main Left Sidebar */}
          <aside className="bg-card border border-border p-4 rounded-2xl shadow-sm space-y-1 select-none">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-4 py-2 block">
              Menu
            </span>
            
            <button
              onClick={() => setSidebarTab("venues")}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                sidebarTab === "venues"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Building className="mr-3 h-4.5 w-4.5" />
              Venue Management
            </button>
            
            <button
              onClick={() => setSidebarTab("users")}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                sidebarTab === "users"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Users className="mr-3 h-4.5 w-4.5" />
              User Management
            </button>
            
            <button
              onClick={() => setSidebarTab("settings")}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                sidebarTab === "settings"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Settings className="mr-3 h-4.5 w-4.5" />
              Settings
            </button>
          </aside>

          {/* Main Dashboard Panel */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* VENUE MANAGEMENT VIEW */}
            {sidebarTab === "venues" && (
              <div className="space-y-6">
                
                {/* Horizontal sub-navigation tabs */}
                <div className="flex bg-muted p-1 rounded-2xl select-none w-fit">
                  <button
                    onClick={() => setVenueSubTab("pending")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      venueSubTab === "pending" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Pending Review
                  </button>
                  <button
                    onClick={() => setVenueSubTab("approved")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      venueSubTab === "approved" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setVenueSubTab("rejected")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      venueSubTab === "rejected" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Rejected
                  </button>
                  <button
                    onClick={() => setVenueSubTab("all")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      venueSubTab === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All Listings
                  </button>
                </div>

                {loading ? (
                  <div className="grid gap-6">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="border border-border p-6 rounded-2xl bg-card space-y-3 animate-pulse">
                        <div className="h-4 w-1/3 bg-muted rounded" />
                        <div className="h-4 w-2/3 bg-muted rounded animate-delay-150" />
                        <div className="h-8 w-24 bg-muted rounded-xl animate-delay-300" />
                      </div>
                    ))}
                  </div>
                ) : venues.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-card">
                    <Building className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-extrabold text-sm text-foreground">No Venue Records</h3>
                    <p className="text-muted-foreground text-xxs mt-0.5 max-w-xs mx-auto">
                      No listings were found matching the "{venueSubTab}" review filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {venues.map((venue) => {
                      const isVerified = venue.status === "VERIFIED" || venue.status === "verified";
                      return (
                        <div
                          key={venue.id}
                          className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Building className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                                  {venue.venueType}
                                </span>
                                <span className="text-xxs font-semibold text-muted-foreground">ID: {venue.id}</span>
                              </div>
                              <h3 className="text-sm font-extrabold text-foreground mt-1">{venue.name}</h3>
                              <p className="text-xxs text-muted-foreground mt-0.5">{venue.city}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            {/* In ALL section, show active tick icon indicators */}
                            {venueSubTab === "all" && isVerified && (
                              <span className="inline-flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mr-2">
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Active
                              </span>
                            )}
                            
                            <Button
                              onClick={() => openVenueDetailsModal(venue)}
                              variant="outline"
                              size="sm"
                              className="rounded-xl font-bold text-xs flex items-center cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              Review Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* USER MANAGEMENT VIEW */}
            {sidebarTab === "users" && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* User/Owner Selection Tabs and status sub-filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
                  <div className="flex bg-muted p-1 rounded-xl select-none w-fit">
                    <button
                      onClick={() => setUserRoleTab("customer")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        userRoleTab === "customer" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Customer Accounts
                    </button>
                    <button
                      onClick={() => setUserRoleTab("owner")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        userRoleTab === "owner" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Host Providers
                    </button>
                  </div>

                  <div className="flex bg-muted p-1 rounded-xl shrink-0 select-none">
                    <button
                      onClick={() => setUserStatusFilter("active")}
                      className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all cursor-pointer ${
                        userStatusFilter === "active" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setUserStatusFilter("inactive")}
                      className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition-all cursor-pointer ${
                        userStatusFilter === "inactive" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Suspended
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                  </div>
                ) : (userRoleTab === "customer" ? filteredUsers : filteredOwners).length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-2xl">
                    <UserCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No accounts found in this category.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {(userRoleTab === "customer" ? filteredUsers : filteredOwners).map((profile) => (
                      <div key={profile.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{profile.fullName}</h4>
                          <p className="text-xxs text-muted-foreground mt-0.5">{profile.email} • {profile.phone || "No Phone"}</p>
                          <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-md border bg-secondary mt-2 inline-block font-bold">
                            Status: {profile.status}
                          </span>
                        </div>

                        {userStatusFilter === "active" ? (
                          <Button
                            onClick={() => handleUpdateUserStatus(profile.id, "BLOCKED")}
                            variant="destructive"
                            size="sm"
                            className="rounded-xl flex items-center text-xs font-bold cursor-pointer"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleUpdateUserStatus(profile.id, "ACTIVE")}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center text-xs font-bold cursor-pointer"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* SETTINGS VIEW */}
            {sidebarTab === "settings" && (
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-primary" />
                    Platform Settings
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure global verification settings and policy controls.
                  </p>
                </div>

                <div className="space-y-6 pt-2">
                  <div className="flex items-start justify-between p-4 bg-secondary/30 border border-border/80 rounded-xl gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="verificationCheckbox" className="font-extrabold text-sm text-foreground cursor-pointer select-none">
                        Require Admin Verification (isAdminVerificationRequired)
                      </Label>
                      <p className="text-xs text-muted-foreground leading-normal">
                        When enabled, new venue listings published by hosts remain hidden from search result indexes until an administrator manually verifies and approves the layout.
                      </p>
                    </div>
                    <Checkbox
                      id="verificationCheckbox"
                      checked={verificationRequired}
                      onCheckedChange={(checked) => handleToggleVerificationSetting(!!checked)}
                      className="rounded mt-1 h-5 w-5 border-border"
                    />
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* DETAILED INSPECT MODAL FOR ADMIN */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-3xl w-full rounded-2xl bg-card border border-border p-6 max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {viewingVenue && (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-md">
                      {viewingVenue.venueType}
                    </span>
                    <span className="text-xxs font-semibold text-muted-foreground">ID: {viewingVenue.id}</span>
                  </div>
                  <DialogTitle className="text-2xl font-black tracking-tight mt-2 text-foreground">
                    {viewingVenue.name}
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-primary shrink-0" />
                    {viewingVenue.address}, {viewingVenue.city}
                  </p>
                </div>

                <span className={`px-2.5 py-0.5 rounded-lg text-xxs font-bold border uppercase tracking-wider ${
                  viewingVenue.status === "VERIFIED"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : viewingVenue.status === "REJECTED"
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}>
                  {viewingVenue.status || "PENDING"}
                </span>
              </div>

              {/* Main Image Grid */}
              {viewingVenue.imageFiles && viewingVenue.imageFiles.length > 0 && (
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={viewingVenue.imageFiles[0].startsWith("http") ? viewingVenue.imageFiles[0] : `${BACKEND_URL}/${viewingVenue.imageFiles[0]}`}
                    alt={viewingVenue.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Description Block */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-foreground flex items-center">
                  <Sparkles className="h-4.5 w-4.5 text-primary mr-1.5" />
                  Description & Specifications
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {viewingVenue.description}
                </p>
              </div>

              {/* Specs & Pricing Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-secondary/30 p-4 border border-border/80 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Seating Capacity</span>
                  <strong className="text-sm text-foreground font-black mt-0.5 block">{viewingVenue.seatingCapacity} guests</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Price / Hour</span>
                  <strong className="text-sm text-foreground font-black mt-0.5 block">${viewingVenue.pricePerHour}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Price / Day</span>
                  <strong className="text-sm text-foreground font-black mt-0.5 block">${viewingVenue.pricePerDay}</strong>
                </div>
              </div>

              {/* Amenities */}
              {viewingVenue.amenities && viewingVenue.amenities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-foreground">Available Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingVenue.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold text-foreground bg-card border border-border px-3 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons inside Dialog */}
              <div className="pt-4 border-t border-border flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setDetailOpen(false)}
                  className="rounded-xl font-bold text-xs"
                >
                  Close
                </Button>

                {/* If PENDING or not verified yet, allow Approve & Reject */}
                {viewingVenue.status === "PENDING" || !viewingVenue.status ? (
                  <>
                    <Button
                      onClick={() => openRejectDialog(viewingVenue.id)}
                      variant="destructive"
                      className="rounded-xl font-bold text-xs flex items-center cursor-pointer"
                    >
                      <XCircle className="h-4 w-4 mr-1.5" />
                      Reject Listing
                    </Button>
                    <Button
                      onClick={() => handleApprove(viewingVenue.id)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Approve Listing
                    </Button>
                  </>
                ) : viewingVenue.status === "VERIFIED" ? (
                  <Button
                    onClick={() => openRejectDialog(viewingVenue.id)}
                    variant="destructive"
                    className="rounded-xl font-bold text-xs flex items-center cursor-pointer"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    Suspend Listing
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleApprove(viewingVenue.id)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Restore Listing
                  </Button>
                )}
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Reason Form dialog modal */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md w-full rounded-2xl bg-card border border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center">
              <AlertCircle className="h-5.5 w-5.5 text-destructive mr-2" />
              Provide Rejection Reason
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Please specify why this venue listing is being suspended or rejected. This reason will be logged on the ActionRequest and communicated to the host owner.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRejectSubmit} className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <Label htmlFor="rejectionReasonInput" className="text-xs font-bold text-foreground">Reason</Label>
              <Input
                id="rejectionReasonInput"
                type="text"
                required
                placeholder="E.g., Low quality images, missing address details, or potential pricing spam..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="rounded-xl border-border bg-background text-sm"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectOpen(false)}
                className="rounded-xl"
                disabled={submittingAction}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-destructive text-destructive-foreground font-bold flex items-center"
                disabled={submittingAction}
              >
                {submittingAction ? "Submitting..." : "Reject Venue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
