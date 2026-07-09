import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddVenueFormByAdmin from './AddVenueFormByAdmin';
import AllVenues from './AllVenues';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/'); 
    };

    

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/'); 
                    return;
                }
                
                
                const response = await fetch('http://localhost:5000/api/all-bookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch bookings");
                }

                setBookings(data.bookings || []); 
            } catch (err) {
                setError(err.message);
                const errMsg = err.response?.data?.message || err.message || '';
                if (error.response?.status === 401 || 
                    error.response?.status === 403 || 
                    errMsg.toLowerCase().includes("access") || 
                    errMsg.toLowerCase().includes("unauthorized")) {
                
                alert("Session expired or access denied. Redirecting to login...");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';} 
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <p style={{ padding: '20px' }}>Loading total bookings...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

    return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F1A0F 100%)',
        color: '#FFFFFF',
        padding: '30px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
        
        {/* Header */}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '15px'
        }}>
            <div>
                <h2 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '2.4rem', 
                    fontWeight: '800',
                    color: '#C7FF2E'
                }}>
                    Admin Control Center
                </h2>
                <h3 style={{ margin: 0, color: '#B0B0B0', fontWeight: '500' }}>
                    All Booking Details
                </h3>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                    onClick={() => setShowModal(true)}
                    style={{
                        padding: '12px 24px',
                        background: '#C7FF2E',
                        color: '#0F0F0F',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    + Add Venue
                </button>

                <button 
                    onClick={() => navigate('/admin/venues')}
                    style={{
                        padding: '12px 24px',
                        background: '#C7FF2E',
                        color: '#0F0F0F',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    View All Venues
                </button>

                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '12px 24px',
                        background: '#ff4757',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>

        {/* Bookings List */}
        <div style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))'
        }}>
            {bookings.length === 0 ? (
                <p style={{ color: '#888', fontSize: '1.1rem' }}>No bookings found.</p>
            ) : (
                bookings.map((booking) => (
                    <div 
                        key={booking.id} 
                        style={{
                            background: 'rgba(26, 26, 26, 0.85)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(199, 255, 46, 0.2)',
                            borderRadius: '16px',
                            padding: '20px',
                            transition: 'all 0.3s'
                        }}
                    >
                        <p><strong>Booking ID:</strong> {booking.id}</p>
                        <p><strong>User ID:</strong> {booking.user_id}</p>
                        <p><strong>Venue ID:</strong> {booking.venue_id}</p>
                        <p><strong>Start Time:</strong> {new Date(booking.start_datetime).toLocaleString()}</p>
                        <p><strong>End Time:</strong> {new Date(booking.end_datetime).toLocaleString()}</p>
                        <p><strong>Status:</strong> 
                            <span style={{ 
                                color: booking.status === 'confirmed' ? '#C7FF2E' : '#ffcc00',
                                fontWeight: '600'
                            }}>
                                {booking.status}
                            </span>
                        </p>
                        <p><strong>Price Paid:</strong> ${booking.total_price}</p>
                    </div>
                ))
            )}
        </div>

        {/* Add Venue Modal */}
        {showModal && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(15, 15, 15, 0.9)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000
            }}>
                <AddVenueFormByAdmin onClose={() => setShowModal(false)} />
            </div>
        )}
    </div>
);

};

export default AdminDashboard;