import { useState, useEffect } from 'react';
import { toast } from "react-toastify";

function AdminDashboard({ user, onLogout }) {

  const [users, setUsers]                 = useState([]);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeTab, setActiveTab]         = useState('users');

  // Detail modal — null means closed, venue object means open
  const [detailVenue, setDetailVenue] = useState(null);

  // Review modal — null means closed
  // When open: { venueId, venueName, action: 'APPROVED' | 'REJECTED' }
  const [modal, setModal]     = useState(null);
  const [comment, setComment] = useState('');

  // ── Helper ─────────────────────────────────────────────────────────────────
  const getToken = () => {
    const userData = JSON.parse(localStorage.getItem('bmv_user'));
    return userData.token;
  };

  // ── Fetch users ────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/users', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      setUsers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  // ── Fetch pending venues ───────────────────────────────────────────────────
  const fetchPendingVenues = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/venue/review', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to fetch venues');
      setPendingVenues(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      await fetchUsers();
      await fetchPendingVenues();
      setLoading(false);
    };
    loadAll();
  }, []);

  // ── Toggle user active / inactive ──────────────────────────────────────────
  const handleToggleUser = async (userId, currentActive) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (!res.ok) throw new Error('Failed to update user status');
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, active: !currentActive } : u)
      );
      toast.success(`User marked as ${!currentActive ? 'active' : 'inactive'}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Open detail modal ──────────────────────────────────────────────────────
  const openDetail = (venue) => setDetailVenue(venue);
  const closeDetail = () => setDetailVenue(null);

  // ── Open review modal ──────────────────────────────────────────────────────
  const openModal = (venue, action) => {
    setDetailVenue(null); // close detail first
    setModal({ venueId: venue.id, venueName: venue.venueName, action });
    setComment('');
  };

  const closeModal = () => { setModal(null); setComment(''); };

  // ── Confirm approve / reject ───────────────────────────────────────────────
  const handleConfirmReview = async () => {
    if (!modal) return;
    if (modal.action === 'REJECTED' && !comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/venue/${modal.venueId}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            status: modal.action,
            approverMessage: comment,
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to review venue');
      toast.success(
        `"${modal.venueName}" ${modal.action === 'APPROVED' ? 'approved' : 'rejected'}!`
      );
      closeModal();
      await fetchPendingVenues();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Metrics ────────────────────────────────────────────────────────────────
  const totalUsers   = users.length;
  const activeUsers  = users.filter(u => u.active).length;
  const totalPending = pendingVenues.length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container">

      {/* ── Header ── */}
      <header className="dashboard-nav">
        <div className="dashboard-user-info">
          <div className="avatar-small">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="user-text-info">
            <h3>{user?.name || 'Guest'}</h3>
            <span className="role-badge admin-badge">Administrator</span>
          </div>
        </div>
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User management ({totalUsers})
          </button>
          <button
            className={`tab-button ${activeTab === 'venues' ? 'active' : ''}`}
            onClick={() => setActiveTab('venues')}
          >
            Pending venues ({totalPending})
          </button>
          <button className="logout-link-btn" onClick={onLogout}>Sign Out</button>
        </div>
      </header>

      <main className="dashboard-content-area">

        {/* ── Metrics ── */}
        <div className="metrics-row">
          <div className="metric-card">
            <span className="metric-title">Total users</span>
            <span className="metric-val">{totalUsers}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Active users</span>
            <span className="metric-val">{activeUsers}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Pending approvals</span>
            <span className="metric-val">{totalPending}</span>
          </div>
        </div>

        {loading && <p style={{ color: 'var(--text)', marginTop: 24 }}>Loading...</p>}

        {/* ════════════════════════════════════════════════
            TAB 1 — USER MANAGEMENT
        ════════════════════════════════════════════════ */}
        {activeTab === 'users' && !loading && (
          <div className="admin-users-section">
            <h3>User accounts registry</h3>

            {users.length === 0 && (
              <p className="no-results">No users found.</p>
            )}

            {users.length > 0 && (
              <div className="bookings-table-wrapper">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>User details</th>
                      <th>Location</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Toggle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>

                        {/* Name + email */}
                        <td>
                          <div className="user-table-cell">
                            <span className="bold">{u.name}</span>
                            <span className="subtext">{u.email}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="subtext">{u.location || '—'}</td>

                        {/* Role badge — uses your existing CSS classes */}
                        <td>
                          <span className={`role-badge ${u.role === 'admin' ? 'admin-badge' : u.role === 'owner' ? 'owner-badge' : ''}`}
                            style={ u.role === 'user' ? {
                              background: 'rgba(107,114,128,0.1)',
                              color: '#374151',
                              padding: '3px 10px',
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 700,
                            } : {}}
                          >
                            {u.role}
                          </span>
                        </td>

                        {/* Joined date */}
                        <td className="subtext">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>

                        {/* Status badge — uses your existing .status-badge classes */}
                        <td>
                          <span className={`status-badge ${u.active ? 'active' : 'suspended'}`}>
                            {u.active ? 'active' : 'inactive'}
                          </span>
                        </td>

                        {/* Toggle — uses your existing .action-btn-sm classes */}
                        <td>
                          <button
                            className={`action-btn-sm ${u.active ? 'suspend-btn' : 'activate-btn'}`}
                            onClick={() => handleToggleUser(u.id, u.active)}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 2 — PENDING VENUES
        ════════════════════════════════════════════════ */}
        {activeTab === 'venues' && !loading && (
          <div className="admin-users-section">
            <h3>Pending venue approvals</h3>

            {pendingVenues.length === 0 && (
              <p className="no-results">No pending venues to review.</p>
            )}

            {pendingVenues.length > 0 && (
              <div className="bookings-table-wrapper">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>Venue details</th>
                      <th>Owner</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingVenues.map(venue => (
                      <tr key={venue.id}>

                        {/* Venue name — clicking opens detail modal */}
                        <td>
                          <div className="user-table-cell">
                            <span
                              className="bold"
                              style={{ color: 'var(--accent)', cursor: 'pointer' }}
                              onClick={() => openDetail(venue)}
                              title="Click to view full details"
                            >
                              {venue.venueName}
                            </span>
                            <span className="subtext">{venue.location}</span>
                          </div>
                        </td>

                        {/* Owner */}
                        <td>
                          <div className="user-table-cell">
                            <span className="bold">{venue.ownerName}</span>
                            <span className="subtext">{venue.ownerEmail}</span>
                          </div>
                        </td>

                        <td className="subtext">{venue.venueType}</td>

                        <td>
                          <span className="bold" style={{ color: 'var(--accent)' }}>
                            ₹{venue.price.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td>
                          <span className={`status-badge ${
                            venue.status === 'APPROVED' ? 'active' :
                            venue.status === 'REJECTED' ? 'suspended' :
                            'pending-host-approval'
                          }`}>
                            {venue.status}
                          </span>
                        </td>

                        {/* Approve / Reject buttons */}
                        <td>
                          {venue.status === 'PENDING' ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="action-btn-sm activate-btn"
                                onClick={() => openModal(venue, 'APPROVED')}
                              >
                                Approve
                              </button>
                              <button
                                className="action-btn-sm suspend-btn"
                                onClick={() => openModal(venue, 'REJECTED')}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="subtext">{venue.status.toLowerCase()}</span>
                          )}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            VENUE DETAIL MODAL
            Uses your existing .modal-overlay and .modal-content classes
        ════════════════════════════════════════════════ */}
        {detailVenue && (
          <div className="modal-overlay" onClick={closeDetail}>
            <div
              className="modal-content"
              style={{ maxWidth: 580 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{detailVenue.venueName}</h3>
                  <p className="subtext" style={{ marginTop: 4 }}>{detailVenue.location}</p>
                </div>
                <span className={`status-badge ${
                  detailVenue.status === 'APPROVED' ? 'active' :
                  detailVenue.status === 'REJECTED' ? 'suspended' :
                  'pending-host-approval'
                }`}>
                  {detailVenue.status}
                </span>
              </div>

              {/* Venue image */}
              {detailVenue.imageUrl && (
                <div style={{
                  width: '100%', height: 180,
                  backgroundImage: `url(${detailVenue.imageUrl})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  borderRadius: 10, marginBottom: 20,
                  border: '1px solid var(--border)',
                }} />
              )}

              {/* Description */}
              {detailVenue.venueDescription && (
                <p style={{
                  fontSize: 14, color: 'var(--text)',
                  lineHeight: 1.6, marginBottom: 20,
                  padding: '12px 14px',
                  background: 'var(--code-bg)',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                }}>
                  {detailVenue.venueDescription}
                </p>
              )}

              {/* Details grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                marginBottom: 24,
              }}>
                {[
                  { label: 'Venue type',     value: detailVenue.venueType },
                  { label: 'Capacity',       value: `${detailVenue.capacity} guests` },
                  { label: 'Price per day',  value: `₹${detailVenue.price.toLocaleString('en-IN')}` },
                  { label: 'Parking',        value: detailVenue.parkingAvailable },
                  { label: 'Owner',          value: detailVenue.ownerName },
                  { label: 'Owner email',    value: detailVenue.ownerEmail },
                  { label: 'Submitted on',   value: new Date(detailVenue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                  { label: 'Terms accepted', value: detailVenue.termsAccepted ? 'Yes' : 'No' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: 'var(--code-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '10px 14px',
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      color: 'var(--text)', marginBottom: 4,
                    }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-h)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal action buttons */}
              <div className="modal-actions">
                <button onClick={closeDetail}>Close</button>
                {detailVenue.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => openModal(detailVenue, 'REJECTED')}
                      style={{
                        background: 'rgba(220,38,38,0.1)',
                        color: '#dc2626',
                        border: '1px solid rgba(220,38,38,0.25)',
                        padding: '10px 18px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: 'var(--sans)',
                      }}
                    >
                      Reject
                    </button>
                    {/* Last button gets your existing accent style automatically */}
                    <button onClick={() => openModal(detailVenue, 'APPROVED')}>
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            APPROVE / REJECT MODAL
            Uses your existing .modal-overlay and .modal-content classes
        ════════════════════════════════════════════════ */}
        {modal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                {modal.action === 'APPROVED' ? 'Approve venue' : 'Reject venue'}
              </h3>

              {/* Venue name highlight box */}
              <div style={{
                background: 'var(--code-bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 20,
                fontSize: 14,
              }}>
                <span style={{ color: 'var(--text)' }}>Venue: </span>
                <span className="bold">{modal.venueName}</span>
              </div>

              {/* Message label */}
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>
                  {modal.action === 'APPROVED'
                    ? 'Message to owner (optional)'
                    : 'Reason for rejection (required)'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder={
                    modal.action === 'APPROVED'
                      ? 'e.g. Your venue looks great! It is now live on BookMyVenue.'
                      : 'e.g. The photos are unclear. Please resubmit with better quality images.'
                  }
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 15,
                    padding: '10px 13px',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    background: 'var(--bg)',
                    color: 'var(--text-h)',
                    outline: 'none',
                    resize: 'none',
                    lineHeight: 1.6,
                    width: '100%',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px var(--accent-bg)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {/* Required hint for rejection */}
                {modal.action === 'REJECTED' && (
                  <span style={{ fontSize: 12, color: 'var(--text)' }}>
                    A reason is required so the owner can improve their listing.
                  </span>
                )}
              </div>

              {/* Buttons — uses your existing .modal-actions styles */}
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Cancel</button>
                <button type="button" onClick={handleConfirmReview}>
                  {modal.action === 'APPROVED' ? 'Confirm approve' : 'Confirm reject'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;