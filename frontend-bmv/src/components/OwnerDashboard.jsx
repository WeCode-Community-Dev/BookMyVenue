import { useState, useEffect } from 'react';

function OwnerDashboard({ user, onLogout }) {

  const [venues, setVenues] = useState([]);
  const [activeTab, setActiveTab] = useState('listings');

  // Form states for ADD VENUE — same as your original
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [parking, setParking] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // NEW: which venue is being edited right now (null means no edit open)
  const [editingVenue, setEditingVenue] = useState(null);

  // NEW: form fields for the EDIT form (separate from the add form)
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editParking, setEditParking] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState('');

  // ─── Helper: get token from localStorage ───────────────────────────────────
  const getToken = () => {
    const userData = JSON.parse(localStorage.getItem('bmv_user'));
    return userData.token;
  };

  // ─── Fetch venues from backend ──────────────────────────────────────────────
  const fetchVenues = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8080/api/owner/venue/owner', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to load venues');
      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Run fetchVenues once when page loads
  useEffect(() => {
    fetchVenues();
  }, []);

  // ─── ADD venue — same as your original ─────────────────────────────────────
  const handleAddVenue = async (e) => {
    e.preventDefault();
    if (!name || !location || !capacity || !price) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      const token = getToken();
      const response = await fetch('http://localhost:8080/api/owner/venue/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueName: name,
          venueType: type,
          location,
          venueDescription: description,
          capacity: Number(capacity),
          price: Number(price),
          parkingAvailable: parking,
          imageUrl: image,
          termsAccepted,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit venue');
      alert('Venue request submitted successfully. Awaiting admin approval.');
      await fetchVenues();
    } catch (error) {
      alert(error.message);
    }
    // Reset add form
    setName(''); setType(''); setLocation(''); setDescription('');
    setCapacity(''); setParking(''); setPrice(''); setImage('');
    setShowTermsModal(false); setTermsAccepted(false);
    setActiveTab('listings');
  };

  // ─── DELETE venue ───────────────────────────────────────────────────────────
  // Called when owner clicks the Delete button on a venue card
  const handleDelete = async (venueId) => {

    // Ask the user to confirm before deleting
    const confirmed = window.confirm('Are you sure you want to delete this venue?');
    if (!confirmed) return; // if they click Cancel, do nothing

    try {
      const token = getToken();

      // Call DELETE /api/owner/venue/{id} on the backend
      const response = await fetch(`http://localhost:8080/api/owner/delete/venue/${venueId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete venue');

      alert('Venue deleted successfully!');

      // Refresh the list so deleted venue disappears from screen
      await fetchVenues();

    } catch (error) {
      alert(error.message);
    }
  };

  // ─── OPEN edit form ─────────────────────────────────────────────────────────
  // When owner clicks Edit on a venue card, we:
  // 1. Save that venue in editingVenue state
  // 2. Pre-fill the edit form fields with current values
  const handleEditClick = (venue) => {
    setEditingVenue(venue);         // remember which venue we're editing
    setEditName(venue.venueName);
    setEditType(venue.venueType);
    setEditLocation(venue.location);
    setEditDescription(venue.venueDescription || '');
    setEditParking(venue.parkingAvailable);
    setEditCapacity(venue.capacity);
    setEditPrice(venue.price);
    setEditImage(venue.imageUrl || '');
  };

  // ─── CLOSE edit form without saving ────────────────────────────────────────
  const handleEditCancel = () => {
    setEditingVenue(null); // clear the editing venue → hides the edit form
  };

  // ─── SAVE edit (UPDATE) ─────────────────────────────────────────────────────
  // Called when owner clicks Save in the edit form
  const handleEditSave = async (e) => {
    e.preventDefault();

    try {
      const token = getToken();

      // Call PUT /api/owner/venue/{id} with the updated fields
      const response = await fetch(`http://localhost:8080/api/owner/update/venue/${editingVenue.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueName: editName,
          venueType: editType,
          location: editLocation,
          venueDescription: editDescription,
          capacity: Number(editCapacity),
          price: Number(editPrice),
          parkingAvailable: editParking,
          imageUrl: editImage,
        }),
      });

      if (!response.ok) throw new Error('Failed to update venue');

      alert('Venue updated successfully! Status reset to PENDING for re-approval.');

      setEditingVenue(null); // close the edit form

      // Refresh list so updated values show immediately
      await fetchVenues();

    } catch (error) {
      alert(error.message);
    }
  };

  // Metrics
  const totalBookings = venues.reduce((acc, curr) => acc + (curr.bookingsCount || 0), 0);
  const totalRevenue  = venues.reduce((acc, curr) => acc + (curr.revenue || 0), 0);

  return (
    <div className="dashboard-container">

      {/* Header — same as your original */}
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
            Requests from customers
          </button>
          <button className="logout-link-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-content-area">

        {/* Metrics — same as your original */}
        <div className="metrics-row">
          <div className="metric-card">
            <span className="metric-title">Total Listings</span>
            <span className="metric-val">{venues.length}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Total Bookings</span>
            <span className="metric-val">{totalBookings}</span>
          </div>
          <div className="metric-card">
            <span className="metric-title">Total Revenue</span>
            <span className="metric-val">₹{totalRevenue}</span>
          </div>
        </div>

        {/* ── LISTINGS TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'listings' ? (
          <div className="listings-section">
            <h3>My Listed Venues</h3>
            <div className="listings-grid">
              {venues.map(venue => (
                <div className="owner-venue-card" key={venue.id}>

                  <div
                    className="owner-venue-img"
                    style={{ backgroundImage: `url(${venue.imageUrl})` }}
                  ></div>

                  <div className="owner-venue-info">
                    <h4>{venue.venueName}</h4>
                    <p className="venue-loc">{venue.location}</p>

                    {/* NEW: Status badge */}
                    <p style={{ margin: '4px 0', fontSize: 13 }}>
                      <strong>Status: </strong>
                      <span style={{
                        color: venue.status === 'APPROVED' ? 'green'
                             : venue.status === 'REJECTED' ? 'red'
                             : 'orange'
                      }}>
                        {venue.status}
                      </span>
                    </p>

                    <div className="owner-venue-stats">
                      <div><strong>Capacity</strong>: {venue.capacity} guests</div>
                      <div><strong>Price</strong>: ₹{venue.price}/day</div>
                    </div>

                    {/* NEW: Edit and Delete buttons */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>

                      {/* Edit button — opens the edit form below */}
                      <button
                        onClick={() => handleEditClick(venue)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>

                      {/* Delete button — calls handleDelete with this venue's id */}
                      <button
                        onClick={() => handleDelete(venue.id)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* NEW: EDIT FORM — only shows when editingVenue is not null */}
            {/* This appears below the cards when Edit is clicked */}
            {editingVenue && (
              <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: 500, width: '90%' }}>
                  <h3>Edit Venue — {editingVenue.venueName}</h3>

                  <form onSubmit={handleEditSave} className="auth-form">

                    <div className="form-group">
                      <label>Venue Name *</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Venue Type *</label>
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        required
                      >
                        <option value="">Select Venue Type</option>
                        <option value="BANQUET_HALL">Banquet Hall</option>
                        <option value="OUTDOOR_GARDEN">Outdoor / Garden</option>
                        <option value="CONFERENCE_ROOM">Conference Room</option>
                        <option value="WEDDING_RECEPTION_HALL">Wedding/reception Hall</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Location *</label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </div>

                    <div className="form-row-grid">
                      <div className="form-group">
                        <label>Capacity *</label>
                        <input
                          type="number"
                          value={editCapacity}
                          onChange={(e) => setEditCapacity(e.target.value)}
                          required
                          min="1"
                        />
                      </div>
                      <div className="form-group">
                        <label>Price Per Day (₹) *</label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          required
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Parking Available *</label>
                      <select
                        value={editParking}
                        onChange={(e) => setEditParking(e.target.value)}
                        required
                      >
                        <option value="">Select parking option</option>
                        <option value="YES">Available</option>
                        <option value="NO">Not Available</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                      />
                    </div>

                    {/* Save and Cancel buttons */}
                    <div className="modal-actions">
                      {/* Cancel — closes the edit form without saving */}
                      <button type="button" onClick={handleEditCancel}>
                        Cancel
                      </button>
                      {/* Save — submits the form → calls handleEditSave */}
                      <button
                        type="submit"
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 20px',
                          cursor: 'pointer'
                        }}
                      >
                        Save Changes
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>

        ) : (

          /* ── ADD VENUE TAB — exactly same as your original ───────────────── */
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
                  <select id="venue-type" value={type} onChange={(e) => setType(e.target.value)} required>
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
                      value={capacity} onChange={(e) => setCapacity(e.target.value)} required min="1" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="venue-price">Price Per Day (₹) *</label>
                    <input type="number" id="venue-price" placeholder="e.g. 25000"
                      value={price} onChange={(e) => setPrice(e.target.value)} required min="1" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="parking-availablity">Parking Available *</label>
                  <select id="parking-availablity" value={parking} onChange={(e) => setParking(e.target.value)} required>
                    <option value="">Select parking option</option>
                    <option value="YES">Available</option>
                    <option value="NO">Not Available</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="venue-image">Image URL</label>
                  <input type="url" id="venue-image" placeholder="e.g. https://images.venueimage/..."
                    value={image} onChange={(e) => setImage(e.target.value)} />
                </div>

                <button type="submit" className="auth-button">
                  Send Venue Listing Request
                </button>

                {/* Terms modal — same as your original */}
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

      </main>
    </div>
  );
}

export default OwnerDashboard;