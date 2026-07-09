import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VenuesBooking from './OwnerBookings';

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [venuesBooking, setVenuesBooking] = useState([]);
    const [showBooking, setShowBooking] = useState(false);
    const [showBookingsPage, setShowBookingsPage] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    let response = '';
    const handleVenueBookingsClick = () => {
    setShowBookingsPage(true);
  };

   
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const token = localStorage.getItem('token');
                    if (!token) {
                    navigate('/'); 
                    return;
            }
                
                response = await fetch('http://localhost:5000/api/owner-venues', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch venues");
                }

                

                if (data.venues) {
                    setVenues(data.venues);
                } else if (data.count === 0) {
                    setVenues([]);
                } else {
                    throw new Error("Invalid data format received from server");
                }

               
                
            } catch (err) {
                setError(err.message);
                console.error("Error fetching venues:", err);
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

        fetchVenues();
    }, []);

    if (loading) return <p style={{ padding: '20px' }}>Loading venues...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;

    return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F1A0F 100%)',
        color: '#FFFFFF',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
        {!showBookingsPage ? (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <h2 style={{ 
                            margin: '0 0 8px 0', 
                            fontSize: '2.5rem', 
                            fontWeight: '800',
                            color: '#C7FF2E'
                        }}>
                            Owner's Dashboard
                        </h2>
                        <h3 style={{ margin: 0, color: '#B0B0B0', fontWeight: '500' }}>
                            Your Venues Details
                        </h3>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={() => setShowBookingsPage(true)}
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
                            My Venue's Bookings
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

                {/* Venues List */}
                {venues.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: 'rgba(26, 26, 26, 0.7)',
                        borderRadius: '20px',
                        border: '1px solid rgba(199, 255, 46, 0.2)'
                    }}>
                        <p style={{ fontSize: '1.3rem', color: '#B0B0B0' }}>
                            No venues found.
                        </p>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gap: '18px',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))'
                    }}>
                        {venues.map((venue) => (
                            <div 
                                key={venue.id} 
                                style={{
                                    background: 'rgba(26, 26, 26, 0.85)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(199, 255, 46, 0.25)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                }}
                            >
                                <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#C7FF2E' }}>
                                    {venue.name}
                                </h3>
                                <p><strong>City:</strong> {venue.city}</p>
                                <p><strong>Address:</strong> {venue.address}</p>
                                <p><strong>Capacity:</strong> {venue.capacity} people</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ) : (
            <VenuesBooking />
        )}
    </div>
);
};

export default OwnerDashboard;