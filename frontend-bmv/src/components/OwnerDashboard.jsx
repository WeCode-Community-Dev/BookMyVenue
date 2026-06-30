import { useState, useEffect } from 'react';import { toast } from "react-toastify";
function OwnerDashboard({ user, onLogout }) {
  const [venues, setVenues]     = useState([]);  const [activeTab, setActiveTab] = useState('listings');

  // booking requests from customers
  const [bookingRequests, setBookingRequests] = useState([]);  const [requestsLoading, setRequestsLoading] = useState(true);

  // review modal state
  const [reviewModal, setReviewModal]   = useState(null);  const [ownerComment, setOwnerComment] = useState('');  const [reviewing, setReviewing]       = useState(false);

  // NEW: cancellation requests state
  const [cancelRequests, setCancelRequests]   = useState([]);
  const [cancelLoading, setCancelLoading]     = useState(true);

  // NEW: cancel review modal state
  // null = closed, object = { cancellationId, venueName, bookingDate, action }
  const [cancelReviewModal, setCancelReviewModal] = useState(null);
  const [cancelOwnerResponse, setCancelOwnerResponse] = useState('');
  const [cancelReviewing, setCancelReviewing]         = useState(false);

  // Form states for ADD VENUE
  const [name, setName]               = useState('');  const [type, setType]               = useState('');  const [location, setLocation]       = useState('');  const [description, setDescription] = useState('');  const [parking, setParking]         = useState('');  const [capacity, setCapacity]       = useState('');  const [price, setPrice]             = useState('');  const [image, setImage]             = useState('');  const [showTermsModal, setShowTermsModal] = useState(false);  const [termsAccepted, setTermsAccepted]   = useState(false);

  // Edit form state
  const [editingVenue, setEditingVenue]     = useState(null);  const [editName, setEditName]             = useState('');  const [editType, setEditType]             = useState('');  const [editLocation, setEditLocation]     = useState('');  const [editDescription, setEditDescription] = useState('');  const [editParking, setEditParking]       = useState('');  const [editCapacity, setEditCapacity]     = useState('');  const [editPrice, setEditPrice]           = useState('');  const [editImage, setEditImage]           = useState('');

  // ── Helper ─────────────────────────────────────────────────────────────────
  const getToken = () => {    const userData = JSON.parse(localStorage.getItem('bmv_user'));    return userData.token;  };

  // ── Fetch venues ────────────────────────────────────────────────────────────
  const fetchVenues = async () => {    try {      const response = await fetch('http://localhost:8080/api/owner/venue/owner', {        headers: { Authorization: `Bearer ${getToken()}` },      });      if (!response.ok) throw new Error('Failed to load venues');      setVenues(await response.json());    } catch (error) {      console.error(error);    }  };

  // ── Fetch booking requests for owner's venues ───────────────────────────────
  const fetchBookingRequests = async () => {    setRequestsLoading(true);    try {      const response = await fetch('http://localhost:8080/api/owner/bookings/reviews', {        headers: { Authorization: `Bearer ${getToken()}` },      });      if (!response.ok) throw new Error('Failed to load booking requests');      setBookingRequests(await response.json());    } catch (error) {      console.error(error);      toast.error('Could not load booking requests');    } finally {      setRequestsLoading(false);    }  };

  // NEW: Fetch cancellation requests for owner's venues
  // GET /api/owner/cancellations
  const fetchCancelRequests = async () => {
    setCancelLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/owner/cancellations', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error('Failed to load cancellation requests');
      setCancelRequests(await response.json());
    } catch (error) {
      console.error(error);
      toast.error('Could not load cancellation requests');
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {    fetchVenues();    fetchBookingRequests();    fetchCancelRequests();  }, []);

  // ── Open review modal ──────────────────────────────────────────────────────
  const openReviewModal = (booking, action) => {    setReviewModal({      bookingId: booking.id,      venueName: booking.venueName,      bookingDate: booking.bookingDate,      action,    });    setOwnerComment('');  };

  const closeReviewModal = () => {    setReviewModal(null);    setOwnerComment('');  };

  // ── Confirm approve or reject booking ──────────────────────────────────────
  const handleConfirmReview = async () => {    if (reviewModal.action === 'REJECTED' && !ownerComment.trim()) {      toast.error('Please provide a reason for rejection');      return;    }    setReviewing(true);    try {      const res = await fetch(        `http://localhost:8080/api/owner/bookings/${reviewModal.bookingId}/review`,        {          method: 'PATCH',          headers: {            'Content-Type': 'application/json',            Authorization: `Bearer ${getToken()}`,          },          body: JSON.stringify({            bookingStatus: reviewModal.action,            ownerComments: ownerComment,          }),        }      );
      const text = await res.text();      if (!res.ok) {        try {          const data = JSON.parse(text);          throw new Error(data.error || data.message || 'Failed to review booking');        } catch {          throw new Error(text || 'Failed to review booking');        }      }
      toast.success(        `Booking ${reviewModal.action === 'APPROVED' ? 'approved' : 'rejected'} successfully!`      );      closeReviewModal();      await fetchBookingRequests();
    } catch (err) {      toast.error(err.message);    } finally {      setReviewing(false);    }  };

  // NEW: Open cancel review modal
  const openCancelReviewModal = (cancelRequest, action) => {
    setCancelReviewModal({
      cancellationId: cancelRequest.id,
      venueName:      cancelRequest.venueName,
      bookingDate:    cancelRequest.bookingDate,
      reason:         cancelRequest.reason,
      action,         // 'APPROVED' or 'REJECTED'
    });
    setCancelOwnerResponse('');
  };

  const closeCancelReviewModal = () => {
    setCancelReviewModal(null);
    setCancelOwnerResponse('');
  };

  // NEW: Confirm approve or reject cancellation request
  // PATCH /api/owner/cancellations/{id}/review
  const handleConfirmCancelReview = async () => {
    if (cancelReviewModal.action === 'REJECTED' && !cancelOwnerResponse.trim()) {
      toast.error('Please provide a reason for rejecting the cancellation');
      return;
    }
    setCancelReviewing(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/owner/cancellations/${cancelReviewModal.cancellationId}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            status:        cancelReviewModal.action,    // "APPROVED" or "REJECTED"
            ownerResponse: cancelOwnerResponse,         // message to user
          }),
        }
      );

      const text = await res.text();
      if (!res.ok) {
        try {
          const data = JSON.parse(text);
          throw new Error(data.error || data.message || 'Failed to review cancellation');
        } catch {
          throw new Error(text || 'Failed to review cancellation');
        }
      }

      toast.success(
        cancelReviewModal.action === 'APPROVED'
          ? 'Cancellation approved. Booking cancelled and refund initiated if applicable.'
          : 'Cancellation rejected. Booking remains active.'
      );
      closeCancelReviewModal();
      await fetchCancelRequests(); // refresh list

    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelReviewing(false);
    }
  };

  // ── ADD venue ──────────────────────────────────────────────────────────────
  const handleAddVenue = async (e) => {    e.preventDefault();    if (!name || !location || !capacity || !price) {      toast.warning('Please fill out all required fields.');      return;    }    try {      const response = await fetch('http://localhost:8080/api/owner/venue/register', {        method: 'POST',        headers: {          'Content-Type': 'application/json',          Authorization: `Bearer ${getToken()}`,        },        body: JSON.stringify({          venueName: name, venueType: type, location,          venueDescription: description,          capacity: Number(capacity), price: Number(price),          parkingAvailable: parking, imageUrl: image, termsAccepted,        }),      });      if (!response.ok) throw new Error('Failed to submit venue');      toast.success('Venue request submitted! Awaiting admin approval.');      await fetchVenues();    } catch (error) {      toast.error(error.message);    }    setName(''); setType(''); setLocation(''); setDescription('');    setCapacity(''); setParking(''); setPrice(''); setImage('');    setShowTermsModal(false); setTermsAccepted(false);    setActiveTab('listings');  };

  // ── DELETE venue ────────────────────────────────────────────────────────────
  const handleDelete = async (venueId) => {    if (!window.confirm('Are you sure you want to delete this venue?')) return;    try {      const response = await fetch(        `http://localhost:8080/api/owner/delete/venue/${venueId}`,        { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } }      );      if (!response.ok) throw new Error('Failed to delete venue');      toast.warning('Venue deleted successfully!');      await fetchVenues();    } catch (error) {      toast.error(error.message);    }  };

  // ── EDIT venue ─────────────────────────────────────────────────────────────
  const handleEditClick = (venue) => {    setEditingVenue(venue);    setEditName(venue.venueName);    setEditType(venue.venueType);    setEditLocation(venue.location);    setEditDescription(venue.venueDescription || '');    setEditParking(venue.parkingAvailable);    setEditCapacity(venue.capacity);    setEditPrice(venue.price);    setEditImage(venue.imageUrl || '');  };

  const handleEditCancel = () => setEditingVenue(null);

  const handleEditSave = async (e) => {    e.preventDefault();    try {      const response = await fetch(        `http://localhost:8080/api/owner/update/venue/${editingVenue.id}`,        {          method: 'PUT',          headers: {            'Content-Type': 'application/json',            Authorization: `Bearer ${getToken()}`,          },          body: JSON.stringify({            venueName: editName, venueType: editType,            location: editLocation, venueDescription: editDescription,            capacity: Number(editCapacity), price: Number(editPrice),            parkingAvailable: editParking, imageUrl: editImage,          }),        }      );      if (!response.ok) throw new Error('Failed to update venue');      toast.success('Venue updated! Status reset to PENDING for re-approval.');      setEditingVenue(null);      await fetchVenues();    } catch (error) {      toast.error(error.message);    }  };

  // ── Metrics ────────────────────────────────────────────────────────────────
  const totalBookings = venues.reduce((acc, curr) => acc + (curr.bookingsCount || 0), 0);  const totalRevenue  = venues.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

  // ── Booking request counts ─────────────────────────────────────────────────
  const pendingRequests  = bookingRequests.filter(b => b.bookingStatus === 'PENDING').length;  const approvedRequests = bookingRequests.filter(b => b.bookingStatus === 'APPROVED').length;

  // NEW: cancellation request counts
  const pendingCancelRequests = cancelRequests.filter(c => c.status === 'PENDING').length;

  // ── Status badge style ─────────────────────────────────────────────────────
  const statusColor = (status) => {    switch (status) {      case 'APPROVED': return { color: 'green' };      case 'REJECTED': return { color: 'red' };      default:         return { color: 'orange' };    }  };

  // ── Textarea shared style ──────────────────────────────────────────────────
  const taStyle = {    fontFamily: 'var(--sans)', fontSize: 15,    padding: '10px 13px',    border: '1px solid var(--border)',    borderRadius: 8,    background: 'var(--bg)', color: 'var(--text-h)',    outline: 'none', resize: 'none', lineHeight: 1.6,    width: '100%', boxSizing: 'border-box',    marginTop: 6,    transition: 'border-color 0.2s, box-shadow 0.2s',  };

  return (
    <div className="dashboard-container">

      {/* ── Header ── */}
      <header className="dashboard-nav">
        <div className="dashboard-user-info">
          <div className="avatar-small">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
          </div>
          <div className="user-text-info">
            <h3>{user?.name || 'Guest'}</h3>
            <span className="role-badge owner-badge">Host</span>
          </div>
        </div>
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings ({venues.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'add-venue' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-venue')}
          >
            Add New Venue
          </button>
          <button
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests {pendingRequests > 0 && (
              <span style={{
                background: 'var(--accent)', color: 'white',
                borderRadius: 20, fontSize: 11, fontWeight: 700,
                padding: '1px 7px', marginLeft: 4,
              }}>
                {pendingRequests}
              </span>
            )}
          </button>
          {/* NEW: Cancellations tab */}
          <button
            className={`tab-button ${activeTab === 'cancellations' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancellations')}
          >
            Cancellations {pendingCancelRequests > 0 && (
              <span style={{
                background: 'var(--accent)', color: 'white',
                borderRadius: 20, fontSize: 11, fontWeight: 700,
                padding: '1px 7px', marginLeft: 4,
              }}>
                {pendingCancelRequests}
              </span>
            )}
          </button>
          <button className="logout-link-btn" onClick={onLogout}>Sign Out</button>
        </div>
      </header>

      <main className="dashboard-content-area">

        {/* ── Metrics ── */}
        <div className="metrics-row">
          <div className="metric-card">
            <span className="metric-title">Total Listings</span>
            <span className="metric-val">{venues.length}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Pending Requests</span>
            <span className="metric-val">{pendingRequests}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Approved Bookings</span>
            <span className="metric-val">{approvedRequests}</span>
          </div>
          {/* NEW metric */}
          <div className="metric-card">
            <span className="metric-title">Pending Cancellations</span>
            <span className="metric-val">{pendingCancelRequests}</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            TAB 1 — MY LISTINGS
        ════════════════════════════════════════════════ */}
        {activeTab === 'listings' && (
          <div className="listings-section">
            <h3>My Listed Venues</h3>
            <div className="listings-grid">
              {venues.map(venue => (
                <div className="owner-venue-card" key={venue.id}>
                  <div
                    className="owner-venue-img"
                    style={{ backgroundImage: `url(${venue.imageUrl})` }}
                  />
                  <div className="owner-venue-info">
                    <h4>{venue.venueName}</h4>
                    <p className="venue-loc">{venue.location}</p>
                    <p style={{ margin: '4px 0', fontSize: 13 }}>
                      <strong>Status: </strong>
                      <span style={statusColor(venue.status)}>{venue.status}</span>
                    </p>
                    {venue.approverMessage && (
                      <div className="review-message">
                        <strong>Review message</strong>: {venue.approverMessage}
                      </div>
                    )}
                    <div className="owner-venue-stats">
                      <div><strong>Capacity</strong>: {venue.capacity} guests</div>
                      <div><strong>Price</strong>: ₹{venue.price}/day</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        onClick={() => handleEditClick(venue)}
                        style={{
                          padding: '6px 16px', backgroundColor: '#3b82f6',
                          color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(venue.id)}
                        style={{
                          padding: '6px 16px', backgroundColor: '#ef4444',
                          color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit modal */}
            {editingVenue && (
              <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: 500, width: '90%' }}>
                  <h3>Edit Venue — {editingVenue.venueName}</h3>
                  <form onSubmit={handleEditSave} className="auth-form">
                    <div className="form-group">
                      <label>Venue Name *</label>
                      <input type="text" value={editName}
                        onChange={(e) => setEditName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Venue Type *</label>
                      <select value={editType} onChange={(e) => setEditType(e.target.value)} required>
                        <option value="">Select Venue Type</option>
                        <option value="BANQUET_HALL">Banquet Hall</option>
                        <option value="OUTDOOR_GARDEN">Outdoor / Garden</option>
                        <option value="CONFERENCE_ROOM">Conference Room</option>
                        <option value="WEDDING_RECEPTION_HALL">Wedding/reception Hall</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Location *</label>
                      <input type="text" value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)} />
                    </div>
                    <div className="form-row-grid">
                      <div className="form-group">
                        <label>Capacity *</label>
                        <input type="number" value={editCapacity} min="1"
                          onChange={(e) => setEditCapacity(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label>Price Per Day (₹) *</label>
                        <input type="number" value={editPrice} min="1"
                          onChange={(e) => setEditPrice(e.target.value)} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Parking Available *</label>
                      <select value={editParking}
                        onChange={(e) => setEditParking(e.target.value)} required>
                        <option value="">Select parking option</option>
                        <option value="YES">Available</option>
                        <option value="NO">Not Available</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Image URL</label>
                      <input type="url" value={editImage}
                        onChange={(e) => setEditImage(e.target.value)} />
                    </div>
                    <div className="modal-actions">
                      <button type="button" onClick={handleEditCancel}>Cancel</button>
                      <button type="submit">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 2 — ADD VENUE
        ════════════════════════════════════════════════ */}
        {activeTab === 'add-venue' && (
          <div className="add-venue-section">
            <div className="form-card">
              <h3>Add New Venue Listing</h3>
              <form
                onSubmit={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                className="auth-form"
              >
                <div className="form-group">
                  <label htmlFor="venue-name">Venue Name *</label>
                  <input type="text" id="venue-name" placeholder="e.g. Elegant Garden Gazebo"
                    value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="venue-type">Venue Type *</label>
                  <select id="venue-type" value={type}
                    onChange={(e) => setType(e.target.value)} required>
                    <option value="">Select Venue Type</option>
                    <option value="BANQUET_HALL">Banquet Hall</option>
                    <option value="OUTDOOR_GARDEN">Outdoor / Garden</option>
                    <option value="CONFERENCE_ROOM">Conference Room</option>
                    <option value="WEDDING_RECEPTION_HALL">Wedding/reception Hall</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="venue-location">Location (City) *</label>
                  <input type="text" id="venue-location" placeholder="e.g. Kochi"
                    value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="venue-description">Venue Description</label>
                  <textarea id="venue-description" placeholder="Describe your venue details"
                    value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-row-grid">
                  <div className="form-group">
                    <label htmlFor="venue-capacity">Capacity (Guests) *</label>
                    <input type="number" id="venue-capacity" placeholder="e.g. 150"
                      value={capacity} onChange={(e) => setCapacity(e.target.value)}
                      required min="1" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="venue-price">Price Per Day (₹) *</label>
                    <input type="number" id="venue-price" placeholder="e.g. 25000"
                      value={price} onChange={(e) => setPrice(e.target.value)}
                      required min="1" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="parking-availablity">Parking Available *</label>
                  <select id="parking-availablity" value={parking}
                    onChange={(e) => setParking(e.target.value)} required>
                    <option value="">Select parking option</option>
                    <option value="YES">Available</option>
                    <option value="NO">Not Available</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="venue-image">Image URL</label>
                  <input type="url" id="venue-image"
                    placeholder="e.g. https://images.venueimage/..."
                    value={image} onChange={(e) => setImage(e.target.value)} />
                </div>
                <button type="submit" className="auth-button">
                  Send Venue Listing Request
                </button>

                {showTermsModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>Terms & Conditions</h3>
                      <div className="terms-content">
                        <p>By submitting this venue listing:</p>
                        <ul>
                          <li>You confirm that the venue information is accurate.</li>
                          <li>You are authorized to list this venue.</li>
                          <li>BookMyVenue may review and approve listings before publication.</li>
                          <li>False or misleading information may result in removal.</li>
                        </ul>
                      </div>
                      <div className="terms-checkbox">
                        <label>
                          <input type="checkbox" checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)} />
                          {' '}I agree to the Terms & Conditions
                        </label>
                      </div>
                      <div className="modal-actions">
                        <button type="button"
                          onClick={() => { setShowTermsModal(false); setTermsAccepted(false); }}>
                          Cancel
                        </button>
                        <button type="button" disabled={!termsAccepted}
                          onClick={(e) => handleAddVenue(e)}>
                          Accept & Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            TAB 3 — BOOKING REQUESTS FROM CUSTOMERS
        ════════════════════════════════════════════════ */}
        {activeTab === 'requests' && (
          <div className="admin-users-section">
            <h3>Booking Requests from Customers</h3>

            {requestsLoading && (
              <p style={{ color: 'var(--text)', marginTop: 16 }}>Loading requests...</p>
            )}

            {!requestsLoading && bookingRequests.length === 0 && (
              <p style={{ color: 'var(--text)', marginTop: 16 }}>
                No booking requests yet.
              </p>
            )}

            {!requestsLoading && bookingRequests.length > 0 && (
              <div className="bookings-table-wrapper">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>Venue</th>
                      <th>Booking date</th>
                      <th>Requested on</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingRequests.map(booking => (
                      <tr key={booking.id}>
                        <td>
                          <div className="user-table-cell">
                            <span className="bold">{booking.venueName}</span>
                            <span className="subtext">{booking.venueLocation}</span>
                          </div>
                        </td>
                        <td className="subtext">
                          {new Date(booking.bookingDate+ 'T00:00:00').toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="subtext">
                          {new Date(booking.bookedOn).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td>
                          <span style={{
                            fontSize: 12, fontWeight: 600,
                            padding: '2px 8px', borderRadius: 20,
                            background: booking.paymentStatus === 'PAID' ? '#d1fae5' : '#f3f4f6',
                            color: booking.paymentStatus === 'PAID' ? '#065f46' : '#374151',
                          }}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${
                            booking.bookingStatus === 'APPROVED' ? 'active' :
                            booking.bookingStatus === 'REJECTED' ? 'suspended' :
                            'pending-host-approval'
                          }`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                        <td>
                          {booking.bookingStatus === 'PENDING' ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="action-btn-sm activate-btn"
                                onClick={() => openReviewModal(booking, 'APPROVED')}
                              >
                                Approve
                              </button>
                              <button
                                className="action-btn-sm suspend-btn"
                                onClick={() => openReviewModal(booking, 'REJECTED')}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            booking.ownerComments ? (
                              <span style={{ fontSize: 12, color: 'var(--text)', fontStyle: 'italic' }}>
                                "{booking.ownerComments}"
                              </span>
                            ) : (
                              <span className="subtext">—</span>
                            )
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
            NEW TAB 4 — CANCELLATION REQUESTS
            GET  /api/owner/cancellations
            PATCH /api/owner/cancellations/{id}/review
        ════════════════════════════════════════════════ */}
        {activeTab === 'cancellations' && (
          <div className="admin-users-section">
            <h3>Cancellation Requests from Customers</h3>

            {cancelLoading && (
              <p style={{ color: 'var(--text)', marginTop: 16 }}>Loading cancellation requests...</p>
            )}

            {!cancelLoading && cancelRequests.length === 0 && (
              <p style={{ color: 'var(--text)', marginTop: 16 }}>
                No cancellation requests yet.
              </p>
            )}

            {!cancelLoading && cancelRequests.length > 0 && (
              <div className="bookings-table-wrapper">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>Venue</th>
                      <th>Booking date</th>
                      <th>Reason from customer</th>
                      <th>Payment status</th>
                      <th>Cancel status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancelRequests.map(cr => (
                      <tr key={cr.id}>

                        {/* Venue name + location — from CancellationResponse */}
                        <td>
                          <div className="user-table-cell">
                            <span className="bold">{cr.venueName}</span>
                            <span className="subtext">{cr.venueLocation}</span>
                          </div>
                        </td>

                        {/* bookingDate from API */}
                        <td className="subtext">
                          {cr.bookingDate
                            ? new Date(cr.bookingDate + 'T00:00:00').toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })
                            : '—'}
                        </td>

                        {/* Customer's cancel reason */}
                        <td style={{ maxWidth: 200, fontSize: 13, color: 'var(--text)', fontStyle: 'italic' }}>
                          "{cr.reason}"
                        </td>

                        {/* paymentStatus from booking */}
                        <td>
                          <span style={{
                            fontSize: 12, fontWeight: 600,
                            padding: '2px 8px', borderRadius: 20,
                            background: cr.paymentStatus === 'PAID' ? '#dbeafe' : '#f3f4f6',
                            color: cr.paymentStatus === 'PAID' ? '#1e40af' : '#374151',
                          }}>
                            {cr.paymentStatus}
                            {/* Warn owner that approving will trigger refund */}
                            {cr.paymentStatus === 'PAID' && (
                              <span style={{ marginLeft: 4, fontSize: 11 }}> refund</span>
                            )}
                          </span>
                        </td>

                        {/* Cancellation status badge */}
                        <td>
                          <span className={`status-badge ${
                            cr.status === 'APPROVED' ? 'active' :
                            cr.status === 'REJECTED' ? 'suspended' :
                            'pending-host-approval'
                          }`}>
                            {cr.status}
                          </span>
                        </td>

                        {/* Approve / Reject — only for PENDING cancel requests */}
                        <td>
                          {cr.status === 'PENDING' ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="action-btn-sm activate-btn"
                                onClick={() => openCancelReviewModal(cr, 'APPROVED')}
                              >
                                Approve
                              </button>
                              <button
                                className="action-btn-sm suspend-btn"
                                onClick={() => openCancelReviewModal(cr, 'REJECTED')}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            cr.ownerResponse ? (
                              <span style={{ fontSize: 12, color: 'var(--text)', fontStyle: 'italic' }}>
                                "{cr.ownerResponse}"
                              </span>
                            ) : (
                              <span className="subtext">—</span>
                            )
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
            BOOKING APPROVE / REJECT MODAL (unchanged)
        ════════════════════════════════════════════════ */}
        {reviewModal && (
          <div className="modal-overlay" onClick={closeReviewModal}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                {reviewModal.action === 'APPROVED' ? 'Approve booking' : 'Reject booking'}
              </h3>
              <div style={{
                background: 'var(--code-bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 14,
              }}>
                <div>
                  <span style={{ color: 'var(--text)' }}>Venue: </span>
                  <span className="bold">{reviewModal.venueName}</span>
                </div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ color: 'var(--text)' }}>Booking date: </span>
                  <span className="bold">
                    {new Date(reviewModal.bookingDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>
                  {reviewModal.action === 'APPROVED'
                    ? 'Message to customer (optional)'
                    : 'Reason for rejection (required)'}
                </label>
                <textarea
                  value={ownerComment}
                  onChange={(e) => setOwnerComment(e.target.value)}
                  rows={4}
                  placeholder={
                    reviewModal.action === 'APPROVED'
                      ? 'e.g. Your booking is confirmed! We look forward to hosting you.'
                      : 'e.g. The venue is already reserved for a private event on that date.'
                  }
                  style={taStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px var(--accent-bg)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {reviewModal.action === 'REJECTED' && (
                  <span style={{ fontSize: 12, color: 'var(--text)' }}>
                    A reason is required so the customer understands why.
                  </span>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeReviewModal}>Cancel</button>
                <button type="button" onClick={handleConfirmReview} disabled={reviewing}>
                  {reviewing
                    ? 'Saving...'
                    : reviewModal.action === 'APPROVED'
                    ? 'Confirm approve'
                    : 'Confirm reject'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════
            NEW: CANCELLATION APPROVE / REJECT MODAL
        ════════════════════════════════════════════════ */}
        {cancelReviewModal && (
          <div className="modal-overlay" onClick={closeCancelReviewModal}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                {cancelReviewModal.action === 'APPROVED'
                  ? 'Approve cancellation'
                  : 'Reject cancellation'}
              </h3>

              {/* Booking details */}
              <div style={{
                background: 'var(--code-bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 14,
              }}>
                <div>
                  <span style={{ color: 'var(--text)' }}>Venue: </span>
                  <span className="bold">{cancelReviewModal.venueName}</span>
                </div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ color: 'var(--text)' }}>Booking date: </span>
                  <span className="bold">
                    {new Date(cancelReviewModal.bookingDate + 'T00:00:00').toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ color: 'var(--text)' }}>Customer reason: </span>
                  <span style={{ fontStyle: 'italic' }}>"{cancelReviewModal.reason}"</span>
                </div>
              </div>

              {/* Refund warning if paid */}
              {cancelReviewModal.action === 'APPROVED' && (
                <div style={{
                  background: '#fef3c7', border: '1px solid #f59e0b',
                  borderRadius: 8, padding: '8px 12px', marginBottom: 16,
                  fontSize: 13, color: '#92400e',
                }}>
                  If this booking was paid, approving will automatically trigger a Stripe refund.
                </div>
              )}

              {/* Owner response */}
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>
                  {cancelReviewModal.action === 'APPROVED'
                    ? 'Message to customer (optional)'
                    : 'Reason for rejecting cancellation (required)'}
                </label>
                <textarea
                  value={cancelOwnerResponse}
                  onChange={(e) => setCancelOwnerResponse(e.target.value)}
                  rows={4}
                  placeholder={
                    cancelReviewModal.action === 'APPROVED'
                      ? 'e.g. Your cancellation has been approved. Refund will be processed shortly.'
                      : 'e.g. Cancellations are not allowed within 48 hours of the event date.'
                  }
                  style={taStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px var(--accent-bg)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {cancelReviewModal.action === 'REJECTED' && (
                  <span style={{ fontSize: 12, color: 'var(--text)' }}>
                    A reason is required so the customer understands why.
                  </span>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeCancelReviewModal}>Cancel</button>
                <button
                  type="button"
                  onClick={handleConfirmCancelReview}
                  disabled={cancelReviewing}
                >
                  {cancelReviewing
                    ? 'Saving...'
                    : cancelReviewModal.action === 'APPROVED'
                    ? 'Confirm approve'
                    : 'Confirm reject'}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default OwnerDashboard;