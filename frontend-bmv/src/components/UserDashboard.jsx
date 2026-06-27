import { useState, useEffect } from 'react';import { toast } from 'react-toastify';
function UserDashboard({ user, onLogout }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [venues, setVenues]     = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');console.log(bookings);

  // Search + filter
  const [searchTerm, setSearchTerm]     = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // NEW: search results from Meilisearch — null means not searched yet, show all venues
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Booking modal — null = closed, venue object = open
  const [bookingModal, setBookingModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  // Calendar navigation — tracks which month is shown
  const [calMonth, setCalMonth] = useState(new Date());

  // Cancel modal — null = closed, booking object = open
  const [cancelModal, setCancelModal]   = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Loading states
  const [venuesLoading, setVenuesLoading]     = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [submitting, setSubmitting]           = useState(false);

  // ── Helper ─────────────────────────────────────────────────────────────────
  const getToken = () => {
    const userData = JSON.parse(localStorage.getItem('bmv_user'));
    return userData.token;
  };

  // Safe fetch helper — handles both JSON and plain text error responses
  const safeFetch = async (url, options = {}) => {
    const res = await fetch(url, options);
    const text = await res.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      const message = typeof data === 'object'
        ? (data?.error || data?.message || 'Something went wrong')
        : (data || 'Something went wrong');
      throw new Error(message);
    }
    return data;
  };

  // ── Fetch approved venues ──────────────────────────────────────────────────
  const fetchVenues = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/user/venues', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to load venues');
      setVenues(await res.json());
    } catch (err) {
      toast.error('Could not load venues');
    } finally {
      setVenuesLoading(false);
    }
  };

  // ── Fetch user bookings ────────────────────────────────────────────────────
  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/user/bookings/my', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });console.log(res);
      if (!res.ok) throw new Error('Failed to load bookings');
      setBookings(await res.json());
    } catch (err) {
      toast.error('Could not load bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
    fetchBookings();
  }, []);

  // NEW: Search via Meilisearch API
  // Called automatically 400ms after user stops typing (debounce)
  const handleSearch = async (term, type) => {
    // If both are empty/all, reset to show all venues from MySQL
    if (!term.trim() && type === 'all') {
      setSearchResults(null); // null = show all venues
      return;
    }
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (term.trim()) params.append('q', term.trim());
      if (type !== 'all') params.append('venueType', type);

      const res = await fetch(
        `http://localhost:8080/api/user/venues/search?${params.toString()}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      // If search fails, fall back to local filter silently
      console.error('Search error:', err.message);
      setSearchResults(null);
    } finally {
      setSearchLoading(false);
    }
  };

  // NEW: Debounce — auto search 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm, selectedType);
    }, 400);
    return () => clearTimeout(timer); // cancel if user types again before 400ms
  }, [searchTerm, selectedType]);

  // ── Open booking modal ─────────────────────────────────────────────────────
  const openBookingModal = (venue) => {
    setBookingModal(venue);
    setSelectedDate(null);
    setCalMonth(new Date());
  };

  const closeBookingModal = () => {
    setBookingModal(null);
    setSelectedDate(null);
  };

  // ── Calendar helpers ───────────────────────────────────────────────────────
  const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const today = new Date();
  today.setHours(0,0,0,0);

  const getCalendarDays = () => {
    const year  = calMonth.getFullYear();
    const month = calMonth.getMonth();
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, date: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0,0,0,0);
      cells.push({ day: d, date });
    }
    return cells;
  };

  const isPast     = (date) => date < today;
  const isSelected = (date) => selectedDate && date.toDateString() === selectedDate.toDateString();
  const isToday    = (date) => date.toDateString() === today.toDateString();

  const prevMonth = () => {
    setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCalMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formatDate = (date) =>
    date.toLocaleDateString('en-IN', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
    });

  const formatDateForApi = (date) => {
    const year  = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day   = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ── Confirm booking ────────────────────────────────────────────────────────
  const handleConfirmBooking = async () => {
    if (!selectedDate) { toast.error('Please select a date'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:8080/api/user/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          venueId:     bookingModal.id,
          bookingDate: formatDateForApi(selectedDate),
        }),
      });
      const text = await res.text();
      if (!res.ok) {
        try {
          const data = JSON.parse(text);
          throw new Error(data.error || data.message || 'Failed to create booking');
        } catch {
          throw new Error(text || 'Failed to create booking');
        }
      }
      const data = JSON.parse(text);
      toast.success(`Booking requested for "${bookingModal.venueName}"!`);
      closeBookingModal();
      await fetchBookings();
      setActiveTab('bookings');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cancel booking ─────────────────────────────────────────────────────────
  const openCancelModal  = (booking) => { setCancelModal(booking); setCancelReason(''); };
  const closeCancelModal = () => { setCancelModal(null); setCancelReason(''); };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/${cancelModal.id}/cancel`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ cancelReason }),
        }
      );
      if (!res.ok) throw new Error('Failed to cancel booking');
      toast.success('Booking cancelled');
      closeCancelModal();
      await fetchBookings();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Proceed to pay placeholder ─────────────────────────────────────────────
  const handleProceedToPay = (booking) => {
    toast.info('Payment module coming in Phase 2!');
  };

  // CHANGED: use searchResults from Meilisearch if available
  // otherwise fall back to local filter on venues from MySQL
  const displayVenues = searchResults !== null
    ? searchResults  // Meilisearch results
    : venues.filter(venue => {
        const matchesSearch =
          venue.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
          selectedType === 'all' ||
          venue.venueType.toLowerCase().replace(/[\s/]+/g, '_').includes(selectedType);
        return matchesSearch && matchesType;
      });

  // ── Status badge class ─────────────────────────────────────────────────────
  const statusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
      case 'APPROVED':  return 'confirmed';
      case 'CANCELLED':
      case 'REJECTED':  return 'suspended';
      default:          return 'pending-host-approval';
    }
  };

  // ── Metrics ────────────────────────────────────────────────────────────────
  const totalBookings    = bookings.length;
  const pendingBookings  = bookings.filter(b => b.status?.toUpperCase() === 'PENDING').length;
  const approvedBookings = bookings.filter(b =>
    ['APPROVED','CONFIRMED'].includes(b.status?.toUpperCase())
  ).length;

  // ── Textarea focus style helper ────────────────────────────────────────────
  const taStyle = {
    fontFamily: 'var(--sans)', fontSize: 15,
    padding: '10px 13px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'var(--bg)', color: 'var(--text-h)',
    outline: 'none', resize: 'none', lineHeight: 1.6,
    width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="dashboard-container">

      {/* ── Header ── */}
      <header className="dashboard-nav">
        <div className="dashboard-user-info">
          <div className="avatar-small">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-text-info">
            <h3>{user?.name || 'Guest'}</h3>
            <span className="role-badge">User</span>
          </div>
        </div>
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            Browse Venues
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings ({totalBookings})
          </button>
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button className="logout-link-btn" onClick={onLogout}>Sign Out</button>
        </div>
      </header>

      <main className="dashboard-content-area">

        {/* ════════════════════════════════════════
            TAB 1 — BROWSE VENUES
        ════════════════════════════════════════ */}
        {activeTab === 'browse' && (
          <div className="browse-section">
            <div className="filter-bar">
              <input
                type="text"
                placeholder="Search by venue name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="BANQUET_HALL">Banquet Hall</option>
                <option value="OUTDOOR_GARDEN">Outdoor / Garden</option>
                <option value="CONFERENCE_ROOM">Conference Room</option>
                <option value="WEDDING_RECEPTION_HALL">Wedding / Reception Hall</option>
              </select>
            </div>

            {/* NEW: search loading indicator */}
            {searchLoading && (
              <p style={{ color: 'var(--text)', fontSize: 13, marginBottom: 12 }}>
                Searching...
              </p>
            )}

            {/* NEW: show "Showing results for..." when search is active */}
            {searchResults !== null && !searchLoading && (
              <p style={{ color: 'var(--text)', fontSize: 13, marginBottom: 12 }}>
                {searchResults.length > 0
                  ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`
                  : 'No results found'}
                {searchTerm && ` for "${searchTerm}"`}
                {' '}
                <button
                  onClick={() => { setSearchTerm(''); setSelectedType('all'); setSearchResults(null); }}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--accent)', cursor: 'pointer',
                    fontSize: 13, textDecoration: 'underline', padding: 0,
                  }}
                >
                  Clear
                </button>
              </p>
            )}

            {venuesLoading && (
              <p style={{ color: 'var(--text)', textAlign: 'center', padding: 48 }}>
                Loading venues...
              </p>
            )}

            {!venuesLoading && (
              <div className="venues-grid">
                {/* CHANGED: displayVenues uses Meilisearch results when available */}
                {displayVenues.length > 0 ? (
                  displayVenues.map(venue => (
                    <div className="venue-card" key={venue.id}>
                      <div
                        className="venue-image"
                        style={{
                          backgroundImage: venue.imageUrl
                            ? `url(${venue.imageUrl})`
                            : 'linear-gradient(135deg,#f3f4f6,#e5e7eb)',
                        }}
                      >
                        <span className="venue-type-tag">{venue.venueType}</span>
                      </div>
                      <div className="venue-card-body">
                        <h4>{venue.venueName}</h4>
                        <p className="venue-loc">{venue.location}</p>
                        <div className="venue-meta">
                          <span> Max {venue.capacity} guests</span>
                          <span className="venue-price">
                            ₹{venue.price.toLocaleString('en-IN')}/day
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text)', marginBottom: 12 }}>
                          Parking: {venue.parkingAvailable}
                        </p>
                        <button
                          className="book-btn"
                          onClick={() => openBookingModal(venue)}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">No venues found matching your criteria.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 2 — MY BOOKINGS
        ════════════════════════════════════════ */}
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="metrics-row">
              <div className="metric-card">
                <span className="metric-title">Total bookings</span>
                <span className="metric-val">{totalBookings}</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Pending</span>
                <span className="metric-val">{pendingBookings}</span>
              </div>
              <div className="metric-card">
                <span className="metric-title">Approved</span>
                <span className="metric-val">{approvedBookings}</span>
              </div>
            </div>

            <h3>My Event Bookings</h3>

            {bookingsLoading && (
              <p style={{ color: 'var(--text)' }}>Loading bookings...</p>
            )}

            {!bookingsLoading && bookings.length === 0 && (
              <div className="no-results">
                <p>You have no bookings yet.</p>
                <button
                  className="auth-button"
                  style={{ marginTop: 16, width: 'auto', padding: '10px 24px' }}
                  onClick={() => setActiveTab('browse')}
                >
                  Browse Venues
                </button>
              </div>
            )}

            {!bookingsLoading && bookings.length > 0 && (
              <div className="bookings-table-wrapper">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Venue</th>
                      <th>Booking date</th>
                      <th>Booked on</th>
                      <th>Status</th>
                      <th>Owner message</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                       <tr key={booking.id}>

                        <td>
                          <div className="user-table-cell">
                            <span className="bold">{booking.venueName}</span>
                            <span className="subtext">{booking.venueLocation}</span>
                          </div>
                        </td>

                        <td className="subtext">
                          {booking.bookingDate
                            ? new Date(booking.bookingDate + 'T00:00:00').toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })
                            : '—'}
                        </td>

                        <td className="subtext">
                          {booking.bookedOn
                            ? new Date(booking.bookedOn+ 'T00:00:00').toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })
                            : '—'}
                        </td>

                        <td>
                          <span className={`status-badge ${statusClass(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>

                        <td style={{ maxWidth: 180 }}>
                          {booking.ownerComments ? (
                            <span style={{
                              fontSize: 13, color: 'var(--text)',
                              fontStyle: 'italic', display: 'block',
                              padding: '6px 10px',
                              background: 'var(--code-bg)',
                              borderRadius: 6,
                              border: '1px solid var(--border)',
                            }}>
                              "{booking.ownerComments}"
                            </span>
                          ) : (
                            <span className="subtext">—</span>
                          )}
                        </td>

                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {['APPROVED','CONFIRMED'].includes(
                              booking.bookingStatus?.toUpperCase()
                            ) && (
                              <button
                                className="auth-button"
                                style={{ padding:'6px 14px', fontSize:13, marginTop:0, width:'auto' }}
                                onClick={() => handleProceedToPay(booking)}
                              >
                                Proceed to Pay
                              </button>
                            )}
                            {['PENDING','APPROVED'].includes(
                              booking.bookingStatus?.toUpperCase()
                            ) && (
                              <button
                                className="action-btn-sm suspend-btn"
                                onClick={() => openCancelModal(booking)}
                              >
                                Cancel
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

        {/* ════════════════════════════════════════
            TAB 3 — MY PROFILE (Phase 2)
        ════════════════════════════════════════ */}
        {activeTab === 'profile' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--accent-bg)',
              border: '2px solid var(--accent-border)',
              color: 'var(--accent)',
              fontSize: 28, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 style={{ margin: '0 0 6px', color: 'var(--text-h)', fontSize: 20 }}>
              {user?.name}
            </h3>
            <p style={{ color: 'var(--text)', fontSize: 14, marginBottom: 6 }}>{user?.email}</p>
            <span className="role-badge" style={{ marginBottom: 24, display: 'inline-block' }}>
              User
            </span>
            <div style={{
              background: 'var(--code-bg)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '24px 32px',
              maxWidth: 400, margin: '24px auto 0',
            }}>
              <p style={{ fontSize: 15, color: 'var(--text-h)', fontWeight: 600, marginBottom: 8 }}>
                Profile editing coming in Phase 2
              </p>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>
                Update your name, location, profile photo and password.
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            BOOKING MODAL WITH CALENDAR
        ════════════════════════════════════════ */}
        {bookingModal && (
          <div className="modal-overlay" onClick={closeBookingModal}>
            <div
              className="modal-content"
              style={{ maxWidth: 480 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Book venue</h3>

              <div style={{
                background: 'var(--code-bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '10px 14px',
                margin: '12px 0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-h)' }}>
                    {bookingModal.venueName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 2 }}>
                    {bookingModal.location}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>
                  ₹{bookingModal.price?.toLocaleString('en-IN')}/day
                </div>
              </div>

              <div style={{
                fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.6px',
                color: 'var(--text)', marginBottom: 10,
              }}>
                Select date
              </div>

              <div style={{
                border: '1px solid var(--border)',
                borderRadius: 10,
                overflow: 'hidden',
                marginBottom: 20,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--code-bg)',
                }}>
                  <button
                    onClick={prevMonth}
                    style={{
                      background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 18,
                      color: 'var(--text)', padding: '0 6px',
                    }}
                    aria-label="Previous month"
                  >
                    ‹
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-h)' }}>
                    {MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
                  </span>
                  <button
                    onClick={nextMonth}
                    style={{
                      background: 'none', border: 'none',
                      cursor: 'pointer', fontSize: 18,
                      color: 'var(--text)', padding: '0 6px',
                    }}
                    aria-label="Next month"
                  >
                    ›
                  </button>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  padding: '8px',
                  gap: 2,
                }}>
                  {DAYS.map(d => (
                    <div key={d} style={{
                      textAlign: 'center', fontSize: 11,
                      fontWeight: 700, color: 'var(--text)',
                      padding: '4px 0', textTransform: 'uppercase',
                    }}>
                      {d}
                    </div>
                  ))}

                  {getCalendarDays().map((cell, i) => {
                    if (!cell.date) {
                      return <div key={`empty-${i}`} />;
                    }
                    const past     = isPast(cell.date);
                    const selected = isSelected(cell.date);
                    const todayDay = isToday(cell.date);
                    return (
                      <div
                        key={i}
                        onClick={() => !past && setSelectedDate(cell.date)}
                        style={{
                          textAlign: 'center',
                          fontSize: 13,
                          padding: '7px 4px',
                          borderRadius: 6,
                          cursor: past ? 'not-allowed' : 'pointer',
                          background: selected ? 'var(--accent)' : 'transparent',
                          color: selected
                            ? '#fff'
                            : past
                            ? 'var(--border)'
                            : todayDay
                            ? 'var(--accent)'
                            : 'var(--text-h)',
                          fontWeight: selected || todayDay ? 700 : 400,
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          if (!past && !selected)
                            e.currentTarget.style.background = 'var(--accent-bg)';
                        }}
                        onMouseLeave={e => {
                          if (!selected)
                            e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {cell.day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedDate ? (
                <div style={{
                  background: 'var(--code-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  marginBottom: 20,
                }}>
                  {[
                    { label: 'Venue',      value: bookingModal.venueName },
                    { label: 'Date',       value: formatDate(selectedDate) },
                    { label: 'Price/day',  value: `₹${bookingModal.price?.toLocaleString('en-IN')}` },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 13, padding: '4px 0',
                    }}>
                      <span style={{ color: 'var(--text)' }}>{row.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-h)' }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 14, padding: '8px 0 0',
                    borderTop: '1px solid var(--border)', marginTop: 6,
                  }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h)' }}>Total</span>
                    <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 15 }}>
                      ₹{bookingModal.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ) : (
                <p style={{
                  textAlign: 'center', fontSize: 13,
                  color: 'var(--text)', marginBottom: 20,
                }}>
                  Please select a date to continue
                </p>
              )}

              <div className="modal-actions">
                <button type="button" onClick={closeBookingModal}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={!selectedDate || submitting}
                >
                  {submitting ? 'Submitting...' : 'Confirm booking'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            CANCEL BOOKING MODAL
        ════════════════════════════════════════ */}
        {cancelModal && (
          <div className="modal-overlay" onClick={closeCancelModal}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Cancel booking</h3>

              <div style={{
                background: 'var(--code-bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px',
                marginBottom: 20, fontSize: 14,
              }}>
                <span style={{ color: 'var(--text)' }}>Venue: </span>
                <span className="bold">{cancelModal.venueName}</span>
                {cancelModal.bookingDate && (
                  <>
                    <span style={{ color: 'var(--text)', marginLeft: 12 }}>Date: </span>
                    <span className="bold">
                      {new Date(cancelModal.bookingDate+ 'T00:00:00').toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Reason for cancellation (required)</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  placeholder="e.g. Change of plans, event postponed..."
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
                <span style={{ fontSize: 12, color: 'var(--text)' }}>
                  This will be shared with the venue owner.
                </span>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeCancelModal}>Keep booking</button>
                <button type="button" onClick={handleConfirmCancel}>Confirm cancel</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default UserDashboard;