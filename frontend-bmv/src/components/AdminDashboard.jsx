import { useState, useEffect } from 'react';import { toast } from "react-toastify";
function AdminDashboard({ user, onLogout }) {
 const [users, setUsers] = useState([]); const [pendingVenues, setPendingVenues] = useState([]); const [allBookings, setAllBookings] = useState([]); const [allVenues, setAllVenues] = useState([]); const [loading, setLoading] = useState(true); const [activeTab, setActiveTab] = useState('users');

 // ✅ NEW: pagination state for all-bookings tab
 const [bookingsPage, setBookingsPage] = useState(0);
 const [bookingsTotalPages, setBookingsTotalPages] = useState(0);
 const [bookingsTotalElements, setBookingsTotalElements] = useState(0);
 const bookingsSize = 10;

 // ✅ NEW: pagination state for all-venues tab
 const [venuesPage, setVenuesPage] = useState(0);
 const [venuesTotalPages, setVenuesTotalPages] = useState(0);
 const [venuesTotalElements, setVenuesTotalElements] = useState(0);
 const venuesSize = 10;

 // ✅ NEW: pagination state for users tab
 const [usersPage, setUsersPage] = useState(0);
 const [usersTotalPages, setUsersTotalPages] = useState(0);
 const [usersTotalElements, setUsersTotalElements] = useState(0);
 const usersSize = 10;

 // Detail modal
 const [detailVenue, setDetailVenue] = useState(null);

 // Review modal
 const [modal, setModal] = useState(null); const [comment, setComment] = useState('');

 // ── Helper ─────────────────────────────────────────────────────────────────
 const getToken = () => { const userData = JSON.parse(localStorage.getItem('bmv_user')); return userData.token; };

 // ── Fetch users — with pagination ──────────────────────────────────────────
 // GET /api/admin/users?page=0&size=10&sort=createdAt,desc
 const fetchUsers = async (page = 0) => {
   try {
     const res = await fetch(
       `http://localhost:8080/api/admin/users?page=${page}&size=${usersSize}&sort=createdAt,desc`,
       { headers: { Authorization: `Bearer ${getToken()}` } }
     );
     if (!res.ok) throw new Error('Failed to fetch users');
     const data = await res.json();
     // ✅ Spring Page response: data.content has the items
     setUsers(data.content);
     setUsersTotalPages(data.totalPages);
     setUsersTotalElements(data.totalElements);
   } catch (err) { console.error(err); }
 };

 // ── Fetch pending venues ───────────────────────────────────────────────────
 const fetchPendingVenues = async () => {
   try {
     const res = await fetch('http://localhost:8080/api/admin/venue/review', {
       headers: { Authorization: `Bearer ${getToken()}` },
     });
     if (!res.ok) throw new Error('Failed to fetch venues');
     setPendingVenues(await res.json());
   } catch (err) { console.error(err); }
 };

 // ── Fetch all bookings — with pagination ───────────────────────────────────
 // GET /api/admin/bookings?page=0&size=10&sort=bookedOn,desc
 const fetchAllBookings = async (page = 0) => {
   try {
     const res = await fetch(
       `http://localhost:8080/api/admin/bookings?page=${page}&size=${bookingsSize}&sort=bookedOn,desc`,
       { headers: { Authorization: `Bearer ${getToken()}` } }
     );
     if (!res.ok) throw new Error('Failed to fetch bookings');
     const data = await res.json();
     // ✅ Spring Page response: data.content has the items
     setAllBookings(data.content);
     setBookingsTotalPages(data.totalPages);
     setBookingsTotalElements(data.totalElements);
   } catch (err) { console.error(err); }
 };

 // ── Fetch all venues — with pagination ────────────────────────────────────
 // GET /api/admin/venues?page=0&size=10&sort=createdAt,desc
 const fetchAllVenues = async (page = 0) => {
   try {
     const res = await fetch(
       `http://localhost:8080/api/admin/venues?page=${page}&size=${venuesSize}&sort=createdAt,desc`,
       { headers: { Authorization: `Bearer ${getToken()}` } }
     );
     if (!res.ok) throw new Error('Failed to fetch all venues');
     const data = await res.json();
     // ✅ Spring Page response: data.content has the items
     setAllVenues(data.content);
     setVenuesTotalPages(data.totalPages);
     setVenuesTotalElements(data.totalElements);
   } catch (err) { console.error(err); }
 };

 useEffect(() => {
   const loadAll = async () => {
     await fetchUsers(0);
     await fetchPendingVenues();
     await fetchAllBookings(0);
     await fetchAllVenues(0);
     setLoading(false);
   };
   loadAll();
 }, []);

 // ✅ NEW: re-fetch when page changes
 useEffect(() => { if (!loading) fetchAllBookings(bookingsPage); }, [bookingsPage]);
 useEffect(() => { if (!loading) fetchAllVenues(venuesPage); }, [venuesPage]);
 useEffect(() => { if (!loading) fetchUsers(usersPage); }, [usersPage]);

 // ── Toggle user active / inactive ──────────────────────────────────────────
 const handleToggleUser = async (userId, currentActive) => {
   try {
     const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/status`, {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
       body: JSON.stringify({ active: !currentActive }),
     });
     if (!res.ok) throw new Error('Failed to update user status');
     setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !currentActive } : u));
     toast.success(`User marked as ${!currentActive ? 'active' : 'inactive'}`);
   } catch (err) { toast.error(err.message); }
 };

 // ── Detail modal ───────────────────────────────────────────────────────────
 const openDetail = (venue) => setDetailVenue(venue);
 const closeDetail = () => setDetailVenue(null);

 // ── Review modal ───────────────────────────────────────────────────────────
 const openModal = (venue, action) => {
   setDetailVenue(null);
   setModal({ venueId: venue.id, venueName: venue.venueName, action });
   setComment('');
 };
 const closeModal = () => { setModal(null); setComment(''); };

 const handleConfirmReview = async () => {
   if (!modal) return;
   if (modal.action === 'REJECTED' && !comment.trim()) {
     toast.error('Please provide a reason for rejection'); return;
   }
   try {
     const res = await fetch(
       `http://localhost:8080/api/admin/venue/${modal.venueId}/review`,
       {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
         body: JSON.stringify({ status: modal.action, approverMessage: comment }),
       }
     );
     if (!res.ok) throw new Error('Failed to review venue');
     toast.success(`"${modal.venueName}" ${modal.action === 'APPROVED' ? 'approved' : 'rejected'}!`);
     closeModal();
     await fetchPendingVenues();
     await fetchAllVenues(venuesPage);
   } catch (err) { toast.error(err.message); }
 };

 // NEW: Update booking status
 const handleUpdateBookingStatus = async (bookingId, newStatus) => {
   try {
     const res = await fetch(
       `http://localhost:8080/api/admin/booking/${bookingId}/status?bookingStatus=${newStatus}`,
       { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } }
     );
     if (!res.ok) throw new Error('Failed to update booking status');
     toast.success(`Booking status updated to ${newStatus}`);
     await fetchAllBookings(bookingsPage);
   } catch (err) { toast.error(err.message); }
 };

 // NEW: Update payment status
 const handleUpdatePaymentStatus = async (bookingId, newStatus) => {
   try {
     const res = await fetch(
       `http://localhost:8080/api/admin/booking/${bookingId}/payment/status?paymentStatus=${newStatus}`,
       { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } }
     );
     if (!res.ok) throw new Error('Failed to update payment status');
     toast.success(`Payment status updated to ${newStatus}`);
     await fetchAllBookings(bookingsPage);
   } catch (err) { toast.error(err.message); }
 };

 // NEW: Update venue status
 const handleUpdateVenueStatus = async (venueId, newStatus) => {
   try {
     const res = await fetch(
       `http://localhost:8080/api/admin/venue/${venueId}/status?status=${newStatus}`,
       { method: 'PATCH', headers: { Authorization: `Bearer ${getToken()}` } }
     );
     if (!res.ok) throw new Error('Failed to update venue status');
     toast.success(`Venue status updated to ${newStatus}`);
     await fetchAllVenues(venuesPage);
     await fetchPendingVenues();
   } catch (err) { toast.error(err.message); }
 };

 // ── Metrics ────────────────────────────────────────────────────────────────
 const totalUsers   = usersTotalElements || users.length;
 const activeUsers  = users.filter(u => u.active).length;
 const totalPending = pendingVenues.length;

 // ── Shared select style ────────────────────────────────────────────────────
 const selectStyle = {
   fontSize: 12, padding: '4px 6px', borderRadius: 6,
   border: '1px solid var(--border)',
   background: 'var(--bg)', color: 'var(--text-h)',
   cursor: 'pointer', fontFamily: 'var(--sans)',
 };

 // ✅ NEW: reusable pagination controls component
 const Pagination = ({ page, totalPages, totalElements, size, onPageChange, label }) => {
   if (totalPages <= 1) return null;
   const from = page * size + 1;
   const to   = Math.min((page + 1) * size, totalElements);
   return (
     <div style={{
       display: 'flex', alignItems: 'center', justifyContent: 'space-between',
       marginTop: 16, padding: '10px 0',
       borderTop: '0.5px solid var(--border)',
     }}>
       {/* Showing X–Y of Z */}
       <span style={{ fontSize: 13, color: 'var(--text)' }}>
         Showing {from}–{to} of {totalElements} {label}
       </span>

       {/* Page buttons */}
       <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
         {/* First */}
         <button
           onClick={() => onPageChange(0)}
           disabled={page === 0}
           style={pageBtn(page === 0)}
           aria-label="First page"
         >
           «
         </button>
         {/* Prev */}
         <button
           onClick={() => onPageChange(page - 1)}
           disabled={page === 0}
           style={pageBtn(page === 0)}
           aria-label="Previous page"
         >
           ‹
         </button>

         {/* Page number pills */}
         {Array.from({ length: totalPages }, (_, i) => i)
           .filter(i => i === 0 || i === totalPages - 1 ||
                        (i >= page - 1 && i <= page + 1))
           .reduce((acc, i, idx, arr) => {
             if (idx > 0 && i - arr[idx - 1] > 1) {
               acc.push('...');
             }
             acc.push(i);
             return acc;
           }, [])
           .map((item, idx) =>
             item === '...' ? (
               <span key={`dots-${idx}`} style={{ padding: '0 4px', color: 'var(--text)' }}>
                 …
               </span>
             ) : (
               <button
                 key={item}
                 onClick={() => onPageChange(item)}
                 style={pageBtn(false, item === page)}
                 aria-label={`Page ${item + 1}`}
               >
                 {item + 1}
               </button>
             )
           )
         }

         {/* Next */}
         <button
           onClick={() => onPageChange(page + 1)}
           disabled={page === totalPages - 1}
           style={pageBtn(page === totalPages - 1)}
           aria-label="Next page"
         >
           ›
         </button>
         {/* Last */}
         <button
           onClick={() => onPageChange(totalPages - 1)}
           disabled={page === totalPages - 1}
           style={pageBtn(page === totalPages - 1)}
           aria-label="Last page"
         >
           »
         </button>
       </div>
     </div>
   );
 };

 // ✅ page button style helper
 const pageBtn = (disabled, active = false) => ({
   padding: '4px 10px', borderRadius: 6, fontSize: 13,
   border: '0.5px solid var(--border)',
   background: active ? 'var(--accent)' : 'var(--bg)',
   color: active ? '#fff' : disabled ? 'var(--border)' : 'var(--text-h)',
   cursor: disabled ? 'not-allowed' : 'pointer',
   fontFamily: 'var(--sans)',
   opacity: disabled ? 0.4 : 1,
 });

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
         <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
           onClick={() => setActiveTab('users')}>
           User management ({usersTotalElements || users.length})
         </button>
         <button className={`tab-button ${activeTab === 'venues' ? 'active' : ''}`}
           onClick={() => setActiveTab('venues')}>
           Pending venues ({totalPending})
         </button>
         <button className={`tab-button ${activeTab === 'all-bookings' ? 'active' : ''}`}
           onClick={() => setActiveTab('all-bookings')}>
           All Bookings ({bookingsTotalElements})
         </button>
         <button className={`tab-button ${activeTab === 'all-venues' ? 'active' : ''}`}
           onClick={() => setActiveTab('all-venues')}>
           All Venues ({venuesTotalElements})
         </button>
         <button className="logout-link-btn" onClick={onLogout}>Sign Out</button>
       </div>
     </header>

     <main className="dashboard-content-area">

       {/* ── Metrics ── */}
       <div className="metrics-row">
         <div className="metric-card">
           <span className="metric-title">Total users</span>
           <span className="metric-val">{usersTotalElements || users.length}</span>
         </div>
         <div className="metric-card">
           <span className="metric-title">Active users</span>
           <span className="metric-val">{activeUsers}</span>
         </div>
         <div className="metric-card">
           <span className="metric-title">Pending approvals</span>
           <span className="metric-val">{totalPending}</span>
         </div>
         <div className="metric-card">
           <span className="metric-title">Total bookings</span>
           <span className="metric-val">{bookingsTotalElements}</span>
         </div>
       </div>

       {loading && <p style={{ color: 'var(--text)', marginTop: 24 }}>Loading...</p>}

       {/* ════════════════════════════════════════════════
           TAB 1 — USER MANAGEMENT
       ════════════════════════════════════════════════ */}
       {activeTab === 'users' && !loading && (
         <div className="admin-users-section">
           <h3>User accounts registry</h3>
           {users.length === 0 && <p className="no-results">No users found.</p>}
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
                     <th>Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {users.map(u => (
                     <tr key={u.id}>
                       <td>
                         <div className="user-table-cell">
                           <span className="bold">{u.name}</span>
                           <span className="subtext">{u.email}</span>
                         </div>
                       </td>
                       <td className="subtext">{u.location || '—'}</td>
                       <td>
                         <span
                           className={`role-badge ${u.role === 'admin' ? 'admin-badge' : u.role === 'owner' ? 'owner-badge' : ''}`}
                           style={u.role === 'user' ? {
                             background: 'rgba(107,114,128,0.1)', color: '#374151',
                             padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                           } : {}}
                         >
                           {u.role}
                         </span>
                       </td>
                       <td className="subtext">
                         {new Date(u.createdAt).toLocaleDateString('en-IN', {
                           day: 'numeric', month: 'short', year: 'numeric',
                         })}
                       </td>
                       <td>
                         <span className={`status-badge ${u.active ? 'active' : 'suspended'}`}>
                           {u.active ? 'active' : 'inactive'}
                         </span>
                       </td>
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
               {/* ✅ Pagination for users */}
               <Pagination
                 page={usersPage}
                 totalPages={usersTotalPages}
                 totalElements={usersTotalElements}
                 size={usersSize}
                 onPageChange={(p) => setUsersPage(p)}
                 label="users"
               />
             </div>
           )}
         </div>
       )}

       {/* ════════════════════════════════════════════════
           TAB 2 — PENDING VENUES (unchanged)
       ════════════════════════════════════════════════ */}
       {activeTab === 'venues' && !loading && (
         <div className="admin-users-section">
           <h3>Pending venue approvals</h3>
           {pendingVenues.length === 0 && <p className="no-results">No pending venues to review.</p>}
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
                       <td>
                         <span className={`status-badge ${
                           venue.status === 'APPROVED' ? 'active' :
                           venue.status === 'REJECTED' ? 'suspended' :
                           'pending-host-approval'
                         }`}>
                           {venue.status}
                         </span>
                       </td>
                       <td>
                         {venue.status === 'PENDING' ? (
                           <div style={{ display: 'flex', gap: 6 }}>
                             <button className="action-btn-sm activate-btn"
                               onClick={() => openModal(venue, 'APPROVED')}>
                               Approve
                             </button>
                             <button className="action-btn-sm suspend-btn"
                               onClick={() => openModal(venue, 'REJECTED')}>
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
           TAB 3 — ALL BOOKINGS with pagination
       ════════════════════════════════════════════════ */}
       {activeTab === 'all-bookings' && !loading && (
         <div className="admin-users-section">
           <h3>All Bookings</h3>
           {allBookings.length === 0 && <p className="no-results">No bookings found.</p>}
           {allBookings.length > 0 && (
             <div className="bookings-table-wrapper">
               <table className="admin-users-table">
                 <thead>
                   <tr>
                     <th>Venue</th>
                     <th>User</th>
                     <th>Booking date</th>
                     <th>Booked on</th>
                     <th>Booking status</th>
                     <th>Payment status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {allBookings.map(booking => (
                     <tr key={booking.id}>
                       <td>
                         <div className="user-table-cell">
                           <span className="bold">{booking.venueName}</span>
                           <span className="subtext">{booking.venueLocation}</span>
                         </div>
                       </td>
                       <td>
                         <div className="user-table-cell">
                           <span className="bold">{booking.customerName || '—'}</span>
                           <span className="subtext">{booking.customerEmail || '—'}</span>
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
                           ? new Date(booking.bookedOn).toLocaleDateString('en-IN', {
                               day: 'numeric', month: 'short', year: 'numeric',
                             })
                           : '—'}
                       </td>
                       <td>
                         <select style={selectStyle} value={booking.bookingStatus}
                           onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}>
                           <option value="PENDING">PENDING</option>
                           <option value="APPROVED">APPROVED</option>
                           <option value="REJECTED">REJECTED</option>
                           <option value="CANCELLED">CANCELLED</option>
                         </select>
                       </td>
                       <td>
                         <select style={selectStyle} value={booking.paymentStatus}
                           onChange={(e) => handleUpdatePaymentStatus(booking.id, e.target.value)}>
                           <option value="UNPAID">UNPAID</option>
                           <option value="PAID">PAID</option>
                           <option value="REFUNDED">REFUNDED</option>
                         </select>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {/* ✅ Pagination for bookings */}
               <Pagination
                 page={bookingsPage}
                 totalPages={bookingsTotalPages}
                 totalElements={bookingsTotalElements}
                 size={bookingsSize}
                 onPageChange={(p) => setBookingsPage(p)}
                 label="bookings"
               />
             </div>
           )}
         </div>
       )}

       {/* ════════════════════════════════════════════════
           TAB 4 — ALL VENUES with pagination
       ════════════════════════════════════════════════ */}
       {activeTab === 'all-venues' && !loading && (
         <div className="admin-users-section">
           <h3>All Venues</h3>
           {allVenues.length === 0 && <p className="no-results">No venues found.</p>}
           {allVenues.length > 0 && (
             <div className="bookings-table-wrapper">
               <table className="admin-users-table">
                 <thead>
                   <tr>
                     <th>Venue details</th>
                     <th>Owner</th>
                     <th>Type</th>
                     <th>Price</th>
                     <th>Capacity</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {allVenues.map(venue => (
                     <tr key={venue.id}>
                       <td>
                         <div className="user-table-cell">
                           <span className="bold">{venue.venueName}</span>
                           <span className="subtext">{venue.location}</span>
                         </div>
                       </td>
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
                       <td className="subtext">{venue.capacity} guests</td>
                       <td>
                         <select style={selectStyle} value={venue.status}
                           onChange={(e) => handleUpdateVenueStatus(venue.id, e.target.value)}>
                           <option value="PENDING">PENDING</option>
                           <option value="APPROVED">APPROVED</option>
                           <option value="REJECTED">REJECTED</option>
                         </select>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {/* ✅ Pagination for venues */}
               <Pagination
                 page={venuesPage}
                 totalPages={venuesTotalPages}
                 totalElements={venuesTotalElements}
                 size={venuesSize}
                 onPageChange={(p) => setVenuesPage(p)}
                 label="venues"
               />
             </div>
           )}
         </div>
       )}

       {/* ════════════════════════════════════════════════
           VENUE DETAIL MODAL (unchanged)
       ════════════════════════════════════════════════ */}
       {detailVenue && (
         <div className="modal-overlay" onClick={closeDetail}>
           <div className="modal-content" style={{ maxWidth: 580 }}
             onClick={(e) => e.stopPropagation()}>
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
             {detailVenue.imageUrl && (
               <div style={{
                 width: '100%', height: 180,
                 backgroundImage: `url(${detailVenue.imageUrl})`,
                 backgroundSize: 'cover', backgroundPosition: 'center',
                 borderRadius: 10, marginBottom: 20, border: '1px solid var(--border)',
               }} />
             )}
             {detailVenue.venueDescription && (
               <p style={{
                 fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 20,
                 padding: '12px 14px', background: 'var(--code-bg)',
                 borderRadius: 8, border: '1px solid var(--border)',
               }}>
                 {detailVenue.venueDescription}
               </p>
             )}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
               {[
                 { label: 'Venue type',    value: detailVenue.venueType },
                 { label: 'Capacity',      value: `${detailVenue.capacity} guests` },
                 { label: 'Price per day', value: `₹${detailVenue.price.toLocaleString('en-IN')}` },
                 { label: 'Parking',       value: detailVenue.parkingAvailable },
                 { label: 'Owner',         value: detailVenue.ownerName },
                 { label: 'Owner email',   value: detailVenue.ownerEmail },
                 { label: 'Submitted on',  value: new Date(detailVenue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
                 { label: 'Terms accepted',value: detailVenue.termsAccepted ? 'Yes' : 'No' },
               ].map(item => (
                 <div key={item.label} style={{
                   background: 'var(--code-bg)', border: '1px solid var(--border)',
                   borderRadius: 8, padding: '10px 14px',
                 }}>
                   <div style={{
                     fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                     letterSpacing: '0.5px', color: 'var(--text)', marginBottom: 4,
                   }}>
                     {item.label}
                   </div>
                   <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-h)' }}>
                     {item.value}
                   </div>
                 </div>
               ))}
             </div>
             <div className="modal-actions">
               <button onClick={closeDetail}>Close</button>
               {detailVenue.status === 'PENDING' && (
                 <>
                   <button
                     onClick={() => openModal(detailVenue, 'REJECTED')}
                     style={{
                       background: 'rgba(220,38,38,0.1)', color: '#dc2626',
                       border: '1px solid rgba(220,38,38,0.25)',
                       padding: '10px 18px', borderRadius: 8,
                       cursor: 'pointer', fontSize: 14, fontWeight: 600,
                       fontFamily: 'var(--sans)',
                     }}
                   >
                     Reject
                   </button>
                   <button onClick={() => openModal(detailVenue, 'APPROVED')}>Approve</button>
                 </>
               )}
             </div>
           </div>
         </div>
       )}

       {/* ════════════════════════════════════════════════
           APPROVE / REJECT MODAL (unchanged)
       ════════════════════════════════════════════════ */}
       {modal && (
         <div className="modal-overlay" onClick={closeModal}>
           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
             <h3>
               {modal.action === 'APPROVED' ? 'Approve venue' : 'Reject venue'}
             </h3>
             <div style={{
               background: 'var(--code-bg)', border: '1px solid var(--border)',
               borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 14,
             }}>
               <span style={{ color: 'var(--text)' }}>Venue: </span>
               <span className="bold">{modal.venueName}</span>
             </div>
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
                   fontFamily: 'var(--sans)', fontSize: 15,
                   padding: '10px 13px', border: '1px solid var(--border)',
                   borderRadius: 8, background: 'var(--bg)', color: 'var(--text-h)',
                   outline: 'none', resize: 'none', lineHeight: 1.6,
                   width: '100%', boxSizing: 'border-box',
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
               {modal.action === 'REJECTED' && (
                 <span style={{ fontSize: 12, color: 'var(--text)' }}>
                   A reason is required so the owner can improve their listing.
                 </span>
               )}
             </div>
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