import { useState } from "react";
import "../css/Admin.css";

const MOCK_DATA = {
  requests: [
    { id: 1, venue: "The Grand Hall", owner: "Arjun Mehta", type: "New Listing", date: "2025-06-01", status: "pending" },
    { id: 2, venue: "Skyline Terrace", owner: "Priya Nair", type: "Edit Request", date: "2025-06-02", status: "pending" },
    { id: 3, venue: "Bloom Gardens", owner: "Karan Singh", type: "New Listing", date: "2025-05-30", status: "approved" },
    { id: 4, venue: "The Loft", owner: "Meena Iyer", type: "Takedown", date: "2025-05-28", status: "rejected" },
  ],
  users: [
    { id: 1, name: "Rahul Verma", email: "rahul@email.com", joined: "2025-01-14", bookings: 12, status: "active" },
    { id: 2, name: "Sneha Pillai", email: "sneha@email.com", joined: "2025-02-20", bookings: 5, status: "active" },
    { id: 3, name: "Dev Kapoor", email: "dev@email.com", joined: "2024-11-10", bookings: 0, status: "suspended" },
    { id: 4, name: "Aisha Khan", email: "aisha@email.com", joined: "2025-04-03", bookings: 8, status: "active" },
  ],
  venueOwners: [
    { id: 1, name: "Arjun Mehta", email: "arjun@venues.com", venues: 3, revenue: "₹2,40,000", status: "verified" },
    { id: 2, name: "Priya Nair", email: "priya@venues.com", venues: 1, revenue: "₹80,000", status: "pending" },
    { id: 3, name: "Karan Singh", email: "karan@venues.com", venues: 5, revenue: "₹6,10,000", status: "verified" },
    { id: 4, name: "Meena Iyer", email: "meena@venues.com", venues: 2, revenue: "₹1,20,000", status: "suspended" },
  ],
  permissions: [
    { id: 1, role: "Super Admin", users: 1, canApprove: true, canDelete: true, canManageRoles: true },
    { id: 2, role: "Moderator", users: 4, canApprove: true, canDelete: false, canManageRoles: false },
    { id: 3, role: "Support", users: 8, canApprove: false, canDelete: false, canManageRoles: false },
    { id: 4, role: "Finance", users: 2, canApprove: false, canDelete: false, canManageRoles: false },
  ],
};

const STATS = [
  { label: "Total Users", value: "1,284", delta: "+12%", icon: "👤" },
  { label: "Active Venues", value: "347", delta: "+5%", icon: "🏛" },
  { label: "Pending Requests", value: "24", delta: "-3", icon: "📋" },
  { label: "Revenue This Month", value: "₹18.4L", delta: "+22%", icon: "💰" },
];

const TABS = [
  { id: "requests", label: "Requests", icon: "📋" },
  { id: "users", label: "Users", icon: "👤" },
  { id: "venueOwners", label: "Venue Owners", icon: "🏛" },
  { id: "permissions", label: "Permissions", icon: "🔐" },
];

const StatusBadge = ({ status }) => (
  <span className={`badge badge--${status}`}>{status}</span>
);

const Toggle = ({ on }) => (
  <span className={`toggle ${on ? "toggle--on" : "toggle--off"}`}>
    {on ? "YES" : "NO"}
  </span>
);

function RequestsTable({ data }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th><th>Venue</th><th>Owner</th><th>Type</th><th>Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td className="muted">{r.id}</td>
              <td className="bold">{r.venue}</td>
              <td>{r.owner}</td>
              <td><span className="tag">{r.type}</span></td>
              <td className="muted">{r.date}</td>
              <td><StatusBadge status={r.status} /></td>
              <td>
                <div className="action-btns">
                  <button className="btn-action btn-action--approve">✓</button>
                  <button className="btn-action btn-action--reject">✕</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UsersTable({ data }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Email</th><th>Joined</th><th>Bookings</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u) => (
            <tr key={u.id}>
              <td className="muted">{u.id}</td>
              <td className="bold">{u.name}</td>
              <td className="muted">{u.email}</td>
              <td className="muted">{u.joined}</td>
              <td>{u.bookings}</td>
              <td><StatusBadge status={u.status} /></td>
              <td>
                <div className="action-btns">
                  <button className="btn-action btn-action--view">👁</button>
                  <button className="btn-action btn-action--reject">🚫</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VenueOwnersTable({ data }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Email</th><th>Venues</th><th>Revenue</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v) => (
            <tr key={v.id}>
              <td className="muted">{v.id}</td>
              <td className="bold">{v.name}</td>
              <td className="muted">{v.email}</td>
              <td>{v.venues}</td>
              <td className="revenue">{v.revenue}</td>
              <td><StatusBadge status={v.status} /></td>
              <td>
                <div className="action-btns">
                  <button className="btn-action btn-action--approve">✓</button>
                  <button className="btn-action btn-action--reject">🚫</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PermissionsTable({ data }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Role</th><th>Users</th><th>Approve</th><th>Delete</th><th>Manage Roles</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.id}>
              <td className="bold">{p.role}</td>
              <td>{p.users}</td>
              <td><Toggle on={p.canApprove} /></td>
              <td><Toggle on={p.canDelete} /></td>
              <td><Toggle on={p.canManageRoles} /></td>
              <td>
                <button className="btn-action btn-action--view">✎ Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("requests");

  const renderContent = () => {
    switch (activeTab) {
      case "requests": return <RequestsTable data={MOCK_DATA.requests} />;
      case "users": return <UsersTable data={MOCK_DATA.users} />;
      case "venueOwners": return <VenueOwnersTable data={MOCK_DATA.venueOwners} />;
      case "permissions": return <PermissionsTable data={MOCK_DATA.permissions} />;
      default: return null;
    }
  };

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">BookMyVenue</span>
        </div>
        <div className="sidebar__label">ADMIN CONSOLE</div>
        <nav className="sidebar__nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "nav-item--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-item__icon">{tab.icon}</span>
              <span className="nav-item__label">{tab.label}</span>
              {activeTab === tab.id && <span className="nav-item__bar" />}
            </button>
          ))}
        </nav>
        <div className="sidebar__footer">
          <div className="admin-badge">
            <div className="admin-avatar">A</div>
            <div>
              <div className="admin-name">Super Admin</div>
              <div className="admin-role">admin@bookmyvenue.in</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <div>
            <h1 className="page-title">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="page-sub">Manage and monitor all {TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}</p>
          </div>
          <div className="topbar__actions">
            <button className="btn-primary">+ Add New</button>
            <button className="btn-ghost">⬇ Export</button>
          </div>
        </header>

        {/* Stats */}
        {/* <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-card__top">
                <span className="stat-icon">{s.icon}</span>
                <span className={`stat-delta ${s.delta.startsWith("+") ? "delta--up" : "delta--down"}`}>{s.delta}</span>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div> */}

        {/* Search bar */}
        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder={`Search ${TABS.find((t) => t.id === activeTab)?.label.toLowerCase()}...`} />
        </div>

        {/* Table */}
        <section className="content-section">
          {renderContent()}
        </section>
      </main>
    </div>
  );
}