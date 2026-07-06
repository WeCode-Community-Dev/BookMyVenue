import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createVenue,getAllVenues } from "../services/api";

// ── Mock bookings (replace later with API) ──────────────────────
const RECENT_BOOKINGS = [
  { id: "BMV20240101", venue: "The Grand Palace Banquet", guest: "Priya Mehta", date: "2024-12-15", guests: 350, amount: 89250, status: "confirmed" },
  { id: "BMV20240102", venue: "Pearl Banquet & Lawn", guest: "Rahul Sharma", date: "2024-12-22", guests: 200, amount: 75600, status: "pending" },
  { id: "BMV20240103", venue: "The Grand Palace Banquet", guest: "Anjali Patel", date: "2025-01-05", guests: 450, amount: 89250, status: "confirmed" },
  { id: "BMV20240104", venue: "Pearl Banquet & Lawn", guest: "Vikram Nair", date: "2025-01-18", guests: 300, amount: 75600, status: "cancelled" },
];

const PRICING_TYPES = ["FULL_DAY", "HOURLY", "PER_SLOT"];
const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Jaipur", "Ahmedabad", "Kolkata", "Surat"];
const STATES = ["Karnataka", "Maharashtra", "Delhi", "Telangana", "Tamil Nadu", "Rajasthan", "Gujarat", "West Bengal"];

// ── Hardcoded amenity IDs — replace with GET /api/amenities later
const AMENITY_OPTIONS = [
  { id: 1, label: "AC" },
  { id: 2, label: "Parking" },
  { id: 3, label: "Catering" },
  { id: 4, label: "DJ" },
  { id: 5, label: "Decor" },
  { id: 6, label: "Bridal Room" },
  { id: 7, label: "Bar" },
  { id: 8, label: "WiFi" },
  { id: 9, label: "Stage" },
  { id: 10, label: "Garden" },
];

// ── Hardcoded event category IDs — replace with GET /api/event-categories later
const EVENT_CATEGORIES = [
  { id: 1, label: "Wedding" },
  { id: 2, label: "Birthday" },
  { id: 3, label: "Corporate" },
  { id: 4, label: "Reception" },
  { id: 5, label: "Party" },
  { id: 6, label: "Outdoor" },
];

function StatusBadge({ status }) {
  const map = {
    active: { bg: "#e6f9f0", color: "#1a7a4a", label: "● Active" },
    draft: { bg: "#fff8e6", color: "#b07800", label: "◐ Draft" },
    cancelled: { bg: "#fff0f3", color: "#8b1a2e", label: "✕ Cancelled" },
    confirmed: { bg: "#e6f9f0", color: "#1a7a4a", label: "✔ Confirmed" },
    pending: { bg: "#fff8e6", color: "#b07800", label: "⏳ Pending" }
  };
  const s = map[status] || map.draft;
  return <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 999, fontSize: "0.76rem", fontWeight: 700 }}>{s.label}</span>;
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="vp-stat-card" style={{ borderTop: `3px solid ${accent}` }}>
      <div className="vp-stat-icon" style={{ background: accent + "18", color: accent }}>{icon}</div>
      <div className="vp-stat-body">
        <span className="vp-stat-value">{value}</span>
        <span className="vp-stat-label">{label}</span>
        {sub && <span className="vp-stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

// ── Add Venue Modal (matches VenueCreationRequest) ───────────────
function VenueFormModal({ onClose, onSave, ownerUserId }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Basic
    venueName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    pincode: "",
    latitude: "",
    longitude: "",
    capacity: "",
    pricingType: "FULL_DAY",
    basePrice: "",
    advancePercentage: "",
    // Amenities & Categories
    amenityIds: [],
    supportedEventCategoryIds: [],
    // Photo
    photoUrl: "",
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleId = (key, id) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter(x => x !== id) : [...f[key], id]
    }));
  };

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const handleSubmit = async () => {
    console.log("ownerUserId:", ownerUserId);
    setError("");
    // Basic validation
    if (!form.venueName || !form.addressLine1 || !form.city || !form.district || !form.state || !form.capacity || !form.basePrice) {
      setError("Please fill all required fields (marked *).");
      setActiveTab("basic");
      return;
    }

    const payload = {
      ownerUserId: ownerUserId,
      venueName: form.venueName,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2 || null,
      city: form.city,
      district: form.district,
      state: form.state,
      country: form.country,
      pincode: form.pincode || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      capacity: parseInt(form.capacity),
      pricingType: form.pricingType,
      basePrice: parseFloat(form.basePrice),
      advancePercentage: form.advancePercentage ? parseFloat(form.advancePercentage) : null,
      amenityIds: form.amenityIds,
      supportedEventCategoryIds: form.supportedEventCategoryIds,
      photos: form.photoUrl ? [{
        venueId: 0,
        isPrimary: true,
        displayOrder: 1,
        photoUrl: form.photoUrl,
        createdBy: ownerUserId,
        updatedBy: ownerUserId
      }] : [],
      createdBy: ownerUserId,
    };

    setLoading(true);
    try {
      const data = await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vp-modal-overlay" onClick={onClose}>
      <div className="vp-modal" onClick={e => e.stopPropagation()}>
        <div className="vp-modal-header">
          <div>
            <h2>Add New Venue</h2>
            <p>Fill in the details to list your venue</p>
          </div>
          <button className="vp-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="vp-modal-tabs">
          {["basic", "location", "categories"].map(t => (
            <button key={t} className={`vp-modal-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "basic" ? "📋 Basic Info" : t === "location" ? "📍 Location" : "⚙ Amenities & Events"}
            </button>
          ))}
        </div>

        {error && <div style={{ background: "#fff0f3", color: "#8b1a2e", padding: "10px 20px", fontSize: "0.85rem" }}>⚠️ {error}</div>}

        <div className="vp-modal-body">

          {/* ── TAB 1: Basic Info ── */}
          {activeTab === "basic" && (
            <div className="vp-form-grid">
              <div className="vp-form-group vp-span2">
                <label>Venue Name *</label>
                <input className="vp-input" placeholder="e.g. The Grand Palace Banquet" value={form.venueName} onChange={set("venueName")} />
              </div>
              <div className="vp-form-group">
                <label>Capacity (guests) *</label>
                <input className="vp-input" type="number" placeholder="500" value={form.capacity} onChange={set("capacity")} />
              </div>
              <div className="vp-form-group">
                <label>Pricing Type *</label>
                <select className="vp-input" value={form.pricingType} onChange={set("pricingType")}>
                  {PRICING_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="vp-form-group">
                <label>Base Price (₹) *</label>
                <input className="vp-input" type="number" placeholder="85000" value={form.basePrice} onChange={set("basePrice")} />
              </div>
              <div className="vp-form-group">
                <label>Advance % (optional)</label>
                <input className="vp-input" type="number" placeholder="30" value={form.advancePercentage} onChange={set("advancePercentage")} />
              </div>
              <div className="vp-form-group vp-span2">
                <label>Cover Photo URL (optional)</label>
                <input className="vp-input" placeholder="https://..." value={form.photoUrl} onChange={set("photoUrl")} />
                {form.photoUrl && <img src={form.photoUrl} alt="" className="vp-img-preview" onError={e => e.target.style.display = "none"} />}
              </div>
            </div>
          )}

          {/* ── TAB 2: Location ── */}
          {activeTab === "location" && (
            <div className="vp-form-grid">
              <div className="vp-form-group vp-span2">
                <label>Address Line 1 *</label>
                <input className="vp-input" placeholder="Building name, street" value={form.addressLine1} onChange={set("addressLine1")} />
              </div>
              <div className="vp-form-group vp-span2">
                <label>Address Line 2 (optional)</label>
                <input className="vp-input" placeholder="Landmark, area" value={form.addressLine2} onChange={set("addressLine2")} />
              </div>
              <div className="vp-form-group">
                <label>City *</label>
                <select className="vp-input" value={form.city} onChange={set("city")}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="vp-form-group">
                <label>District *</label>
                <input className="vp-input" placeholder="e.g. Bengaluru Urban" value={form.district} onChange={set("district")} />
              </div>
              <div className="vp-form-group">
                <label>State *</label>
                <select className="vp-input" value={form.state} onChange={set("state")}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="vp-form-group">
                <label>Country *</label>
                <input className="vp-input" value={form.country} onChange={set("country")} />
              </div>
              <div className="vp-form-group">
                <label>Pincode</label>
                <input className="vp-input" placeholder="560001" value={form.pincode} onChange={set("pincode")} />
              </div>
              <div className="vp-form-group">
                <label>Latitude (optional)</label>
                <input className="vp-input" type="number" placeholder="12.9716" value={form.latitude} onChange={set("latitude")} />
              </div>
              <div className="vp-form-group">
                <label>Longitude (optional)</label>
                <input className="vp-input" type="number" placeholder="77.5946" value={form.longitude} onChange={set("longitude")} />
              </div>
            </div>
          )}

          {/* ── TAB 3: Amenities & Event Categories ── */}
          {activeTab === "categories" && (
            <div>
              <h4 style={{ marginBottom: 8 }}>Amenities</h4>
              <div className="vp-amenity-grid">
                {AMENITY_OPTIONS.map(a => (
                  <label key={a.id} className={`vp-amenity-chip ${form.amenityIds.includes(a.id) ? "selected" : ""}`}>
                    <input type="checkbox" checked={form.amenityIds.includes(a.id)} onChange={() => toggleId("amenityIds", a.id)} />
                    {a.label}
                  </label>
                ))}
              </div>
              <p className="vp-amenity-count">{form.amenityIds.length} amenities selected</p>

              <h4 style={{ marginTop: 24, marginBottom: 8 }}>Supported Event Types</h4>
              <div className="vp-amenity-grid">
                {EVENT_CATEGORIES.map(c => (
                  <label key={c.id} className={`vp-amenity-chip ${form.supportedEventCategoryIds.includes(c.id) ? "selected" : ""}`}>
                    <input type="checkbox" checked={form.supportedEventCategoryIds.includes(c.id)} onChange={() => toggleId("supportedEventCategoryIds", c.id)} />
                    {c.label}
                  </label>
                ))}
              </div>
              <p className="vp-amenity-count">{form.supportedEventCategoryIds.length} event types selected</p>
            </div>
          )}
        </div>

        <div className="vp-modal-footer">
          <button className="vp-btn-ghost" onClick={onClose}>Cancel</button>
          <div style={{ display: "flex", gap: 10 }}>
            {activeTab !== "basic" && (
              <button className="vp-btn-ghost" onClick={() => setActiveTab(activeTab === "categories" ? "location" : "basic")}>← Back</button>
            )}
            {activeTab !== "categories"
              ? <button className="vp-btn-primary" onClick={() => setActiveTab(activeTab === "basic" ? "location" : "categories")}>Next →</button>
              : <button className="vp-btn-primary" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Saving..." : "💾 List Venue"}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ venue, onClose, onConfirm }) {
  return (
    <div className="vp-modal-overlay" onClick={onClose}>
      <div className="vp-modal vp-modal-sm" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", padding: "32px 24px" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🗑️</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", marginBottom: 8 }}>Delete Venue?</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.7 }}>
            Are you sure you want to delete <strong>"{venue.name}"</strong>?<br />This action cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="vp-btn-ghost" onClick={onClose}>Cancel</button>
            <button className="vp-btn-danger" onClick={() => { onConfirm(venue.id); onClose(); }}>Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  const [form, setForm] = useState({ name: "Nikhil", email: "nikhil@gmail.com", phone: "+91 98765 43210", business: "Reddy Hospitality Pvt Ltd", city: "Bengaluru", bio: "Venue owner with 10+ years of experience in event hospitality across South India.", avatar: "N" });
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="vp-section-content">
      <div className="vp-profile-layout">
        <div className="vp-profile-avatar-side">
          <div className="vp-avatar-big">{form.avatar}</div>
          <button className="vp-btn-ghost" style={{ marginTop: 12, fontSize: "0.85rem" }}>📷 Change Photo</button>
          <div className="vp-profile-badge"><span>✅ Verified Owner</span></div>
          <div className="vp-profile-stats-mini">
            <div><strong>3</strong><span>Venues</span></div>
            <div><strong>29</strong><span>Bookings</span></div>
            <div><strong>4.6★</strong><span>Avg Rating</span></div>
          </div>
        </div>
        <div className="vp-profile-form-side">
          <div className="vp-section-title-row"><h3>Personal Information</h3></div>
          <div className="vp-form-grid">
            <div className="vp-form-group"><label>Full Name</label><input className="vp-input" value={form.name} onChange={set("name")} /></div>
            <div className="vp-form-group"><label>Business Name</label><input className="vp-input" value={form.business} onChange={set("business")} /></div>
            <div className="vp-form-group"><label>Email</label><input className="vp-input" type="email" value={form.email} onChange={set("email")} /></div>
            <div className="vp-form-group"><label>Phone</label><input className="vp-input" value={form.phone} onChange={set("phone")} /></div>
            <div className="vp-form-group">
              <label>City</label>
              <select className="vp-input" value={form.city} onChange={set("city")}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="vp-form-group vp-span2"><label>About / Bio</label><textarea className="vp-input vp-textarea" value={form.bio} onChange={set("bio")} style={{ minHeight: 80 }} /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            {saved && <span className="vp-save-toast">✅ Profile saved!</span>}
            <button className="vp-btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VenuePanel() {
  const { user } = useAuth();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [myVenues, setMyVenues] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteVenue, setDeleteVenue] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleSaveVenue = async (payload) => {
    const token = user?.token || localStorage.getItem("bmv_token"); // ← fallback
    const data = await createVenue(payload, token);
    setMyVenues(prev => [...prev, data]);
    showToast("New venue listed successfully!");
    return data;
  };

  const handleDelete = (id) => {
    setMyVenues(prev => prev.filter(v => v.id !== id));
    showToast("Venue deleted.", "error");
  };

  const totalRevenue = RECENT_BOOKINGS.filter(b => b.status === "confirmed").reduce((s, b) => s + b.amount, 0);
  const activeVenues = myVenues.filter(v => v.status === "active").length;

  const NAV = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "venues", icon: "🏛️", label: "My Venues" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "profile", icon: "👤", label: "My Profile" },
  ];

  useEffect(() => {
    if(user?.userId) {
      getAllVenues(user.token).then(data=> {
        console.log(data);
        setMyVenues(data);
      })
      .catch(err=> console.log("Failed to load venues:", err));
    }
  },[user]);

  return (
    <div className="vp-root">
      <aside className={`vp-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="vp-sidebar-logo"><span>🏛️</span><span>Venue<span>Panel</span></span></div>
        <nav className="vp-nav">
          {NAV.map(n => (
            <button key={n.id} className={`vp-nav-item ${activeNav === n.id ? "active" : ""}`} onClick={() => { setActiveNav(n.id); setSidebarOpen(false); }}>
              <span className="vp-nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="vp-sidebar-footer">
          <div className="vp-owner-chip">
            <div className="vp-owner-avatar">{user?.firstName?.[0] || "U"}</div>
            <div>
              <p className="vp-owner-name">{user?.firstName || "Owner"}</p>
              <p className="vp-owner-role">Venue Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="vp-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="vp-main">
        <header className="vp-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="vp-hamburger" onClick={() => setSidebarOpen(s => !s)}>☰</button>
            <h1 className="vp-page-title">{NAV.find(n => n.id === activeNav)?.icon} {NAV.find(n => n.id === activeNav)?.label}</h1>
          </div>
          {activeNav === "venues" && (
            <button className="vp-btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Venue</button>
          )}
        </header>

        {activeNav === "dashboard" && (
          <div className="vp-page-content">
            <div className="vp-stats-row">
              <StatCard icon="🏛️" label="Active Venues" value={activeVenues} sub={`${myVenues.length} total`} accent="#8B1A2E" />
              <StatCard icon="📅" label="Total Bookings" value={RECENT_BOOKINGS.length} sub="This season" accent="#C9952A" />
              <StatCard icon="💰" label="Revenue Earned" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} sub="Confirmed only" accent="#1a7a4a" />
              <StatCard icon="⭐" label="Avg Rating" value="4.6" sub="Across all venues" accent="#0070c9" />
            </div>
            <div className="vp-dash-grid">
              <div className="vp-card">
                <div className="vp-card-header">
                  <h3>Recent Bookings</h3>
                  <button className="vp-link-btn" onClick={() => setActiveNav("bookings")}>View all →</button>
                </div>
                <table className="vp-table">
                  <thead><tr><th>Guest</th><th>Venue</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {RECENT_BOOKINGS.slice(0, 4).map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.guest}</strong></td>
                        <td className="vp-td-muted">{b.venue.split(" ").slice(0, 3).join(" ")}</td>
                        <td className="vp-td-muted">{b.date}</td>
                        <td><strong>₹{b.amount.toLocaleString()}</strong></td>
                        <td><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeNav === "venues" && (
          <div className="vp-page-content">
            {myVenues.length === 0 ? (
              <div className="vp-empty">
                <span>🏛️</span>
                <h3>No venues listed yet</h3>
                <p>Start by adding your first venue to reach thousands of customers.</p>
                <button className="vp-btn-primary" onClick={() => setShowAddModal(true)}>+ Add Your First Venue</button>
              </div>
            ) : (
              <div className="vp-venues-list">
                {myVenues.map(v => (
                  <div key={v.venueId || v.id} className="vp-venue-row-card">
                    <div className="vp-venue-row-info">
                      <div className="vp-venue-row-top">
                        <div>
                          <h3 className="vp-venue-row-name">{v.venueName}</h3>
                          <p className="vp-venue-row-meta">📍 {v.city} &nbsp;·&nbsp; 👥 {v.capacity} guests &nbsp;·&nbsp; 💰 ₹{v.basePrice}</p>
                        </div>
                      </div>
                    </div>
                    <div className="vp-venue-row-actions">
                      <span
                        className={`vp-status-badge ${
                          v.status === "APPROVED"
                            ? "approved"
                            : v.status === "PENDING_APPROVAL"
                            ? "pending"
                            : ""
                        }`}
                      >
                        {v.status === "PENDING_APPROVAL"
                          ? "Pending Approval"
                          : v.status}
                      </span>
                      {/* <button className="vp-action-btn delete" onClick={() => setDeleteVenue(v)}>🗑️ Delete</button> */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === "bookings" && (
          <div className="vp-page-content">
            <div className="vp-card" style={{ marginTop: 0 }}>
              <table className="vp-table vp-table-full">
                <thead>
                  <tr><th>Booking ID</th><th>Guest</th><th>Venue</th><th>Date</th><th>Guests</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {RECENT_BOOKINGS.map(b => (
                    <tr key={b.id}>
                      <td><code className="vp-code">{b.id}</code></td>
                      <td><strong>{b.guest}</strong></td>
                      <td className="vp-td-muted">{b.venue.split(" ").slice(0, 3).join(" ")}</td>
                      <td className="vp-td-muted">{b.date}</td>
                      <td className="vp-td-muted">{b.guests}</td>
                      <td><strong>₹{b.amount.toLocaleString()}</strong></td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeNav === "profile" && (
          <div className="vp-page-content"><ProfileSection /></div>
        )}
      </main>

      {showAddModal && (
        <VenueFormModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveVenue}
          ownerUserId={user?.userId}
          
        />
      )}

      {deleteVenue && (
        <DeleteModal venue={deleteVenue} onClose={() => setDeleteVenue(null)} onConfirm={handleDelete} />
      )}

      {toast && (
        <div className={`vp-toast ${toast.type === "error" ? "vp-toast-error" : ""}`}>{toast.msg}</div>
      )}
    </div>
  );
}