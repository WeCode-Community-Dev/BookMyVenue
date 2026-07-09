import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [ venues, setVenues ] = useState([]);
    const [ error, setError ] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedVenue, setSelectedVenue ] = useState(null);
    const [userBookings, setUserBookings] = useState([]);
    const [exploreVenueId, setExploreVenueId] = useState(null);
    const [exploreVenueData, setExploreVenueData] = useState(null);
    

    const [showBookingsModal, setShowBookingsModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/'); 
    };

    const handleBooking = (venue) =>{
        setSelectedVenue(venue);
        setExploreVenueId(null);
        setExploreVenueData(null);
    };

    const handleCloseForm = () => {
        setSelectedVenue(null);
    };

    
    const handleCancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmCancel) return;

        try {
            const token = localStorage.getItem('token');
            
        
            const response = await fetch(`http://localhost:5000/api/booking/${bookingId}`, {
                method: 'PATCH', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to cancel booking");
            }

            alert(data.message || "Booking cancelled successfully!");
            
            


        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleExploreButton = async (venueId) => {
        try {
            const token = localStorage.getItem('token');
            setExploreVenueId(venueId)
        
            const response = await fetch(`http://localhost:5000/api/venues/${venueId}`, {
                method: 'GET', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setExploreVenueData(data.venue);
            console.log(data);
            console.log(exploreVenueData);

            if (!response.ok) {
                throw new Error(data.message || "Failed to get venue details");
            }


        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    }


    const handleBackToDashboard = () => {
        setExploreVenueId(null);
        setExploreVenueData(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); 
            return;
        }

        const fetchVenues = async () => {
            try {
                const response  = await fetch('http://localhost:5000/venues', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                 
                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch venues");
                }

                setVenues(data);
            }catch(err){
                setError(err.message);
            }
        };

        const fetchUserBookings = async () => {
            try{
                const response = await fetch('http://localhost:5000/booking/my-bookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();

                if(!response.ok){
                    throw new Error(data.message || "Failed to fetch your bookings");
                }

                setUserBookings(data.bookings || []);
            }catch(err){
                console.error("History fetch error: ", err.message);
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
            }
        };

        Promise.all([fetchVenues(), fetchUserBookings()]).finally(() => {
            setLoading(false);
        });
    }, []);

    if(loading) return <p style={{padding: '20px'}}>Loading Available Venues....</p>
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error}</p>;


    return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F1A0F 100%)',
        color: '#FFFFFF',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
        
        {/* Explore Venue Detail View */}
        {exploreVenueId && exploreVenueData ? (
            <div style={{ padding: '40px 20px' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <div style={{
                        background: 'rgba(26, 26, 26, 0.92)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(199, 255, 46, 0.25)',
                        borderRadius: '24px',
                        padding: '45px',
                        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7)'
                    }}>
                        <button 
                            onClick={handleBackToDashboard}
                            style={{
                                marginBottom: '25px',
                                padding: '10px 20px',
                                background: 'transparent',
                                color: '#C7FF2E',
                                border: '1px solid rgba(199, 255, 46, 0.5)',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            ← Back to Venues
                        </button>

                        <h2 style={{ marginTop: 0, color: '#C7FF2E', fontSize: '2.2rem' }}>
                            {exploreVenueData.name}
                        </h2>

                        <div style={{ margin: '25px 0', lineHeight: '1.8' }}>
                            <p><strong>City:</strong> {exploreVenueData.city}</p>
                            <p><strong>Address:</strong> {exploreVenueData.address}</p>
                            <p><strong>Capacity:</strong> {exploreVenueData.capacity} people</p>
                            <p><strong>Price:</strong> ₹{exploreVenueData.price_per_hour} / hour</p>
                            <p><strong>Description:</strong> {exploreVenueData.description || 'No description provided.'}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginTop: '35px' }}>
                            <button 
                                onClick={() => handleBooking(exploreVenueData)}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    background: '#C7FF2E',
                                    color: '#0F0F0F',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontWeight: '700',
                                    fontSize: '1.1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                Book This Venue
                            </button>

                            <button 
                                onClick={handleBackToDashboard}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    background: 'transparent',
                                    color: '#C7FF2E',
                                    border: '2px solid #C7FF2E',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => e.target.style.background = 'rgba(199, 255, 46, 0.1)'}
                                onMouseOut={(e) => e.target.style.background = 'transparent'}
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            /* ==================== MAIN USER DASHBOARD ==================== */
            <div style={{ padding: '40px 20px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                    {/* Booking Form Modal */}
                    {selectedVenue && (
                        <div style={{
                            position: 'fixed', 
                            top: 0, left: 0, width: '100vw', height: '100vh',
                            backgroundColor: 'rgba(15, 15, 15, 0.9)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            zIndex: 1000
                        }}>
                            <div style={{ position: 'relative' }}>
                                <BookingForm 
                                    venueId={selectedVenue.id} 
                                    venueName={selectedVenue.name} 
                                    onClose={handleCloseForm}
                                />
                            </div>
                        </div>
                    )}

                    {/* My Bookings Modal */}
                    {showBookingsModal && (
                        <div style={{
                            position: 'fixed', 
                            top: 0, left: 0, width: '100vw', height: '100vh',
                            backgroundColor: 'rgba(15, 15, 15, 0.9)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            zIndex: 1000
                        }}>
                            <div style={{ 
                                background: 'rgba(26, 26, 26, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(199, 255, 46, 0.2)',
                                borderRadius: '20px',
                                width: '520px',
                                maxHeight: '85vh',
                                overflowY: 'auto',
                                position: 'relative',
                                padding: '30px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                                    <h2 style={{ margin: 0, color: '#C7FF2E' }}>My Bookings</h2>
                                    <button 
                                        onClick={() => setShowBookingsModal(false)} 
                                        style={{ 
                                            background: 'none', 
                                            border: 'none', 
                                            fontSize: '28px', 
                                            color: '#808080',
                                            cursor: 'pointer' 
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                
                                {userBookings.length === 0 ? (
                                    <p style={{ color: '#B0B0B0', fontSize: '1.1rem', textAlign: 'center', padding: '40px 0' }}>
                                        You don't have any booking records yet.
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {userBookings.map((booking) => (
                                            <div 
                                                key={booking.id} 
                                                style={{
                                                    background: 'rgba(40, 40, 40, 0.8)',
                                                    border: '1px solid rgba(199, 255, 46, 0.15)',
                                                    borderRadius: '12px',
                                                    padding: '18px'
                                                }}
                                            >
                                                <h4 style={{ margin: '0 0 10px 0', color: '#FFFFFF' }}>
                                                    Booking #{booking.id}
                                                </h4>
                                                <p style={{ margin: '6px 0' }}><strong>Start:</strong> {new Date(booking.start_datetime).toLocaleString()}</p>
                                                <p style={{ margin: '6px 0' }}><strong>End:</strong> {new Date(booking.end_datetime).toLocaleString()}</p>
                                                <p style={{ margin: '6px 0' }}><strong>Total Cost:</strong> ₹{booking.total_price}</p>
                                                
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                                                    <span style={{
                                                        padding: '5px 14px',
                                                        borderRadius: '30px',
                                                        fontSize: '13px',
                                                        fontWeight: '600',
                                                        backgroundColor: booking.status === 'confirmed' ? 'rgba(199, 255, 46, 0.2)' : 'rgba(255, 204, 0, 0.2)',
                                                        color: booking.status === 'confirmed' ? '#C7FF2E' : '#ffcc00'
                                                    }}>
                                                        {booking.status}
                                                    </span>
                                                    
                                                    {booking.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            style={{
                                                                padding: '6px 16px',
                                                                backgroundColor: '#ff4757',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '50px',
                                                                cursor: 'pointer',
                                                                fontSize: '13px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Main Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                        <h2 style={{ margin: 0, fontSize: '2.4rem', fontWeight: '800', color: '#C7FF2E' }}>
                            Available Venues
                        </h2>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={() => setShowBookingsModal(true)} 
                                style={{
                                    padding: '12px 24px',
                                    background: '#C7FF2E',
                                    color: '#0F0F0F',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                My Bookings
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
                                    cursor: 'pointer'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Venues Grid */}
                    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
                        {venues.map((venue) => (
                            <div 
                                key={venue.id} 
                                style={{
                                    background: 'rgba(26, 26, 26, 0.85)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(199, 255, 46, 0.2)',
                                    borderRadius: '16px',
                                    padding: '24px'
                                }}
                            >
                                <h3 style={{ margin: '0 0 16px 0', color: '#FFFFFF' }}>{venue.name}</h3>
                                <p><strong>Location:</strong> {venue.city}</p>
                                <p><strong>Address:</strong> {venue.address}</p>
                                <p><strong>Capacity:</strong> {venue.capacity} people</p>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                    <button 
                                        onClick={() => handleBooking(venue)}
                                        style={{
                                            flex: 1,
                                            padding: '14px',
                                            backgroundColor: '#C7FF2E',
                                            color: '#0F0F0F',
                                            border: 'none',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            fontWeight: '700'
                                        }}
                                    >
                                        Book Venue
                                    </button>

                                    <button 
                                        onClick={() => handleExploreButton(venue.id)}
                                        style={{
                                            flex: 1,
                                            padding: '14px',
                                            backgroundColor: '#2E2E2E',
                                            color: '#FFFFFF',
                                            border: '1px solid rgba(199, 255, 46, 0.4)',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Explore More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default UserDashboard;