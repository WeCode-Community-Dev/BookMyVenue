import { useState, useEffect } from "react";

const OWNER_VENUES = [
  { id: 1, name: "The Grand Palace Banquet", type: "Wedding", city: "Bengaluru", location: "Indiranagar", capacity: "500 guests", price: 85000, rating: 4.8, reviews: 124, status: "active", bookings: 18, image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=80", amenities: ["AC", "Parking", "Catering", "DJ", "Decor", "Bridal Room"], description: "A luxurious banquet hall with elegant interiors, perfect for grand weddings and receptions." },
  { id: 2, name: "Pearl Banquet & Lawn", type: "Wedding", city: "Bengaluru", location: "Koramangala", capacity: "400 guests", price: 72000, rating: 4.6, reviews: 98, status: "active", bookings: 11, image: "https://images.unsplash.com/photo-1478146059778-26ca6e370071?w=400&q=80", amenities: ["Indoor + Lawn", "AC", "Catering", "DJ", "Parking", "Decor"], description: "An exquisite combination of indoor hall and outdoor lawn for your dream wedding." },
  { id: 3, name: "Sky Terrace Hall", type: "Party", city: "Bengaluru", location: "MG Road", capacity: "150 guests", price: 40000, rating: 4.3, reviews: 52, status: "draft", bookings: 0, image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80", amenities: ["Rooftop", "DJ", "Bar", "AC"], description: "Rooftop party space with great views." },
];

const RECENT_BOOKINGS = [
  { id: "BMV20240101", venue: "The Grand Palace Banquet", guest: "Priya Mehta", date: "2024-12-15", guests: 350, amount: 89250, status: "confirmed" },
  { id: "BMV20240102", venue: "Pearl Banquet & Lawn", guest: "Rahul Sharma", date: "2024-12-22", guests: 200, amount: 75600, status: "pending" },
  { id: "BMV20240103", venue: "The Grand Palace Banquet", guest: "Anjali Patel", date: "2025-01-05", guests: 450, amount: 89250, status: "confirmed" },
  { id: "BMV20240104", venue: "Pearl Banquet & Lawn", guest: "Vikram Nair", date: "2025-01-18", guests: 300, amount: 75600, status: "cancelled" },
];

const AMENITY_OPTIONS = ["AC", "Parking", "Catering", "DJ", "Decor", "Bridal Room", "Bar", "WiFi", "Stage", "Garden", "Pool", "Valet Parking", "Rooftop", "Dance Floor", "AV Equipment"];
const VENUE_TYPES = ["Wedding", "Party", "Corporate", "Outdoor", "Birthday", "Reception"];
const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Jaipur", "Ahmedabad", "Kolkata", "Surat"];

function StatusBadge({ status }) {
  const map = { active: { bg: "#e6f9f0", color: "#1a7a4a", label: "● Active" }, draft: { bg: "#fff8e6", color: "#b07800", label: "◐ Draft" }, cancelled: { bg: "#fff0f3", color: "#8b1a2e", label: "✕ Cancelled" }, confirmed: { bg: "#e6f9f0", color: "#1a7a4a", label: "✔ Confirmed" }, pending: { bg: "#fff8e6", color: "#b07800", label: "⏳ Pending" } };
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

function VenueFormModal({ venue, onClose, onSave }) {
  const isEdit = !!venue;
  const [form, setForm] = useState(venue || { name: "", type: "Wedding", city: "", location: "", capacity: "", price: "", description: "", amenities: [], status: "draft", image: "" });
  const [activeTab, setActiveTab] = useState("basic");

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const toggleAmenity = (a) => setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));

  useEffect(()=> {
    window.scrollTo({top: 0, behavior: "smooth"});
  }, []);

  return (
    <div className="vp-modal-overlay" onClick={onClose}>
      <div className="vp-modal" onClick={e => e.stopPropagation()}>
        <div className="vp-modal-header">
          <div>
            <h2>{isEdit ? "Edit Venue" : "Add New Venue"}</h2>
            <p>{isEdit ? `Editing: ${venue.name}` : "Fill in the details to list your venue"}</p>
          </div>
          <button className="vp-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="vp-modal-tabs">
          {["basic", "details", "amenities"].map(t => (
            <button key={t} className={`vp-modal-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "basic" ? "📋 Basic Info" : t === "details" ? "📝 Details" : "⚙ Amenities"}
            </button>
          ))}
        </div>

        <div className="vp-modal-body">
          {activeTab === "basic" && (
            <div className="vp-form-grid">
              <div className="vp-form-group vp-span2">
                <label>Venue Name *</label>
                <input className="vp-input" placeholder="e.g. The Grand Palace Banquet" value={form.name} onChange={set("name")} />
              </div>
              <div className="vp-form-group">
                <label>Event Type *</label>
                <select className="vp-input" value={form.type} onChange={set("type")}>
                  {VENUE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="vp-form-group">
                <label>Status</label>
                <select className="vp-input" value={form.status} onChange={set("status")}>
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
              <div className="vp-form-group">
                <label>City *</label>
                <select className="vp-input" value={form.city} onChange={set("city")}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="vp-form-group">
                <label>Area / Location *</label>
                <input className="vp-input" placeholder="e.g. Indiranagar" value={form.location} onChange={set("location")} />
              </div>
              <div className="vp-form-group">
                <label>Price per Day (₹) *</label>
                <input className="vp-input" type="number" placeholder="85000" value={form.price} onChange={set("price")} />
              </div>
              <div className="vp-form-group">
                <label>Max Capacity *</label>
                <input className="vp-input" placeholder="e.g. 500 guests" value={form.capacity} onChange={set("capacity")} />
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="vp-form-grid">
              <div className="vp-form-group vp-span2">
                <label>Cover Image URL</label>
                <input className="vp-input" placeholder="https://..." value={form.image} onChange={set("image")} />
                {form.image && <img src={form.image} alt="" className="vp-img-preview" onError={e => e.target.style.display = "none"} />}
              </div>
              <div className="vp-form-group vp-span2">
                <label>Description *</label>
                <textarea className="vp-input vp-textarea" placeholder="Describe your venue — atmosphere, highlights, what makes it special..." value={form.description} onChange={set("description")} />
              </div>
              <div className="vp-form-group vp-span2">
                <label>Venue Policies / Notes</label>
                <textarea className="vp-input vp-textarea" placeholder="Cancellation policy, timing, restrictions, etc." style={{ minHeight: 80 }} />
              </div>
            </div>
          )}

          {activeTab === "amenities" && (
            <div>
              <p className="vp-amenity-hint">Select all amenities your venue offers</p>
              <div className="vp-amenity-grid">
                {AMENITY_OPTIONS.map(a => (
                  <label key={a} className={`vp-amenity-chip ${form.amenities.includes(a) ? "selected" : ""}`}>
                    <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                    {a}
                  </label>
                ))}
              </div>
              <p className="vp-amenity-count">{form.amenities.length} amenities selected</p>
            </div>
          )}
        </div>

        <div className="vp-modal-footer">
          <button className="vp-btn-ghost" onClick={onClose}>Cancel</button>
          <div style={{ display: "flex", gap: 10 }}>
            {activeTab !== "basic" && <button className="vp-btn-ghost" onClick={() => setActiveTab(activeTab === "amenities" ? "details" : "basic")}>← Back</button>}
            {activeTab !== "amenities"
              ? <button className="vp-btn-primary" onClick={() => setActiveTab(activeTab === "basic" ? "details" : "amenities")}>Next →</button>
              : <button className="vp-btn-primary" onClick={() => { onSave(form); onClose(); }}>💾 {isEdit ? "Save Changes" : "List Venue"}</button>
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
          <div className="vp-profile-badge">
            <span>✅ Verified Owner</span>
          </div>
          <div className="vp-profile-stats-mini">
            <div><strong>3</strong><span>Venues</span></div>
            <div><strong>29</strong><span>Bookings</span></div>
            <div><strong>4.6★</strong><span>Avg Rating</span></div>
          </div>
        </div>

        <div className="vp-profile-form-side">
          <div className="vp-section-title-row">
            <h3>Personal Information</h3>
          </div>
          <div className="vp-form-grid">
            <div className="vp-form-group">
              <label>Full Name</label>
              <input className="vp-input" value={form.name} onChange={set("name")} />
            </div>
            <div className="vp-form-group">
              <label>Business Name</label>
              <input className="vp-input" value={form.business} onChange={set("business")} />
            </div>
            <div className="vp-form-group">
              <label>Email</label>
              <input className="vp-input" type="email" value={form.email} onChange={set("email")} />
            </div>
            <div className="vp-form-group">
              <label>Phone</label>
              <input className="vp-input" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="vp-form-group">
              <label>City</label>
              <select className="vp-input" value={form.city} onChange={set("city")}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="vp-form-group vp-span2">
              <label>About / Bio</label>
              <textarea className="vp-input vp-textarea" value={form.bio} onChange={set("bio")} style={{ minHeight: 80 }} />
            </div>
          </div>

          <div className="vp-section-title-row" style={{ marginTop: 32 }}>
            <h3>Change Password</h3>
          </div>
          <div className="vp-form-grid">
            <div className="vp-form-group">
              <label>Current Password</label>
              <input className="vp-input" type="password" placeholder="••••••••" />
            </div>
            <div className="vp-form-group">
              <label>New Password</label>
              <input className="vp-input" type="password" placeholder="••••••••" />
            </div>
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
  const [activeNav, setActiveNav] = useState("dashboard");
  const [myVenues, setMyVenues] = useState(OWNER_VENUES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editVenue, setEditVenue] = useState(null);
  const [deleteVenue, setDeleteVenue] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleSaveVenue = (form) => {
    if (form.id) {
      setMyVenues(prev => prev.map(v => v.id === form.id ? { ...v, ...form } : v));
      showToast("Venue updated successfully!");
    } else {
      setMyVenues(prev => [...prev, { ...form, id: Date.now(), rating: 0, reviews: 0, bookings: 0 }]);
      showToast("New venue listed successfully!");
    }
  };

  const handleDelete = (id) => {
    setMyVenues(prev => prev.filter(v => v.id !== id));
    showToast("Venue deleted.", "error");
  };

  const totalRevenue = RECENT_BOOKINGS.filter(b => b.status === "confirmed").reduce((s, b) => s + b.amount, 0);
  const totalBookings = RECENT_BOOKINGS.length;
  const activeVenues = myVenues.filter(v => v.status === "active").length;

  const NAV = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "venues", icon: "🏛️", label: "My Venues" },
    { id: "bookings", icon: "📅", label: "Bookings" },
    { id: "profile", icon: "👤", label: "My Profile" },
  ];

  return (
    <div className="vp-root">
      <aside className={`vp-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="vp-sidebar-logo">
          <span>🏛️</span>
          <span>Venue<span>Panel</span></span>
        </div>
        <nav className="vp-nav">
          {NAV.map(n => (
            <button key={n.id} className={`vp-nav-item ${activeNav === n.id ? "active" : ""}`} onClick={() => { setActiveNav(n.id); setSidebarOpen(false); }}>
              <span className="vp-nav-label">{n.label}</span>
            </button>
          ))}
        </nav>
        <div className="vp-sidebar-footer">
          <div className="vp-owner-chip">
            <div className="vp-owner-avatar">N</div>
            <div>
              <p className="vp-owner-name">Nikhil</p>
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
            <div>
              <h1 className="vp-page-title">
                {NAV.find(n => n.id === activeNav)?.icon} {NAV.find(n => n.id === activeNav)?.label}
              </h1>
            </div>
          </div>
          {activeNav === "venues" && (
            <button className="vp-btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Venue</button>
          )}
        </header>
        {activeNav === "dashboard" && (
          <div className="vp-page-content">
            <div className="vp-stats-row">
              <StatCard icon="🏛️" label="Active Venues" value={activeVenues} sub={`${myVenues.length} total`} accent="#8B1A2E" />
              <StatCard icon="📅" label="Total Bookings" value={totalBookings} sub="This season" accent="#C9952A" />
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

              <div className="vp-card">
                <div className="vp-card-header">
                  <h3>My Venues</h3>
                  <button className="vp-link-btn" onClick={() => setActiveNav("venues")}>Manage →</button>
                </div>
                <div className="vp-venue-quick-list">
                  {myVenues.map(v => (
                    <div key={v.id} className="vp-venue-quick-item">
                      <img src={v.image} alt={v.name} className="vp-venue-quick-img" />
                      <div className="vp-venue-quick-info">
                        <p className="vp-venue-quick-name">{v.name}</p>
                        <p className="vp-venue-quick-meta">{v.type} · {v.city}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <StatusBadge status={v.status} />
                        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>{v.bookings} bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <div key={v.id} className="vp-venue-row-card">
                    <img src={v.image} alt={v.name} className="vp-venue-row-img" />
                    <div className="vp-venue-row-info">
                      <div className="vp-venue-row-top">
                        <div>
                          <h3 className="vp-venue-row-name">{v.name}</h3>
                          <p className="vp-venue-row-meta">📍 {v.location}, {v.city} &nbsp;·&nbsp; 👥 {v.capacity} &nbsp;·&nbsp; 🎉 {v.type}</p>
                        </div>
                        <StatusBadge status={v.status} />
                      </div>
                      <p className="vp-venue-row-desc">{v.description}</p>
                      <div className="vp-venue-row-stats">
                        <span>💰 ₹{v.price.toLocaleString()}/day</span>
                        <span>⭐ {v.rating} ({v.reviews} reviews)</span>
                        <span>📅 {v.bookings} bookings</span>
                        <div className="vp-venue-row-amenities">
                          {v.amenities.slice(0, 4).map(a => <span key={a} className="vp-tag">{a}</span>)}
                          {v.amenities.length > 4 && <span className="vp-tag">+{v.amenities.length - 4}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="vp-venue-row-actions">
                      <button className="vp-action-btn edit" onClick={() => setEditVenue(v)}>✏️ Edit</button>
                      <button className="vp-action-btn delete" onClick={() => setDeleteVenue(v)}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeNav === "bookings" && (
          <div className="vp-page-content">
            <div className="vp-bookings-filter">
              {["All", "Confirmed", "Pending", "Cancelled"].map(s => (
                <button key={s} className="vp-filter-tab">{s}</button>
              ))}
            </div>
            <div className="vp-card" style={{ marginTop: 0 }}>
              <table className="vp-table vp-table-full">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Guest</th>
                    <th>Venue</th>
                    <th>Event Date</th>
                    <th>Guests</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
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
                      <td>
                        {b.status === "pending" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="vp-action-btn edit" style={{ padding: "4px 10px", fontSize: "0.78rem" }}>✔ Accept</button>
                            <button className="vp-action-btn delete" style={{ padding: "4px 10px", fontSize: "0.78rem" }}>✕ Decline</button>
                          </div>
                        )}
                        {b.status !== "pending" && <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeNav === "profile" && (
          <div className="vp-page-content">
            <ProfileSection />
          </div>
        )}
      </main>
      {(showAddModal || editVenue) && (
        <VenueFormModal
          venue={editVenue}
          onClose={() => { setShowAddModal(false); setEditVenue(null); }}
          onSave={handleSaveVenue}
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