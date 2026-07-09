import React, { useState, useEffect } from 'react';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/owner-booking',{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        let bookingList = [];

        if (Array.isArray(data)) {
        bookingList = data;
        } else if (data.bookings && Array.isArray(data.bookings)) {
        bookingList = data.bookings;
        } else if (data.data && Array.isArray(data.data)) {
        bookingList = data.data;
        } else if (data.venues) {   // in case you still get venues
        bookingList = data.venues;
        }

        setBookings(bookingList);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h1>Error Loading Bookings</h1>
        <p>{error}</p>
        <p>Check your backend is running and the URL is correct.</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F1A0F 100%)',
        color: '#FFFFFF',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
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
                    <h1 style={{ 
                        margin: 0, 
                        fontSize: '2.6rem', 
                        fontWeight: '800',
                        color: '#C7FF2E'
                    }}>
                        My Venue Bookings
                    </h1>
                </div>
                
                <button 
                    onClick={() => window.location.reload()} 
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
                    ← Back to Dashboard
                </button>
            </div>

            {bookings.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    background: 'rgba(26, 26, 26, 0.6)',
                    borderRadius: '20px',
                    border: '1px solid rgba(199, 255, 46, 0.2)'
                }}>
                    <p style={{ fontSize: '1.3rem', color: '#B0B0B0' }}>
                        No bookings found for your venues yet.
                    </p>
                </div>
            ) : (
                <div>
                    <h2 style={{ 
                        marginBottom: '30px', 
                        color: '#C7FF2E',
                        fontSize: '1.8rem'
                    }}>
                        Total Bookings: {bookings.length}
                    </h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gap: '20px',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))'
                    }}>
                        {bookings.map((booking, i) => (
                            <div 
                                key={i} 
                                style={{
                                    background: 'rgba(26, 26, 26, 0.85)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(199, 255, 46, 0.2)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                }}
                            >
                                <h3 style={{ 
                                    marginTop: 0, 
                                    marginBottom: '18px',
                                    color: '#FFFFFF'
                                }}>
                                    {booking.venue_name || `Booking #${booking.id}`}
                                </h3>

                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                                    gap: '14px',
                                    fontSize: '1.02rem'
                                }}>
                                    <div>
                                        <strong>Status:</strong>{' '}
                                        <span style={{ 
                                            padding: '4px 14px', 
                                            borderRadius: '30px', 
                                            backgroundColor: booking.status === 'confirmed' ? 'rgba(199, 255, 46, 0.2)' : 'rgba(255, 204, 0, 0.2)',
                                            color: booking.status === 'confirmed' ? '#C7FF2E' : '#ffcc00',
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div><strong>Start:</strong> {new Date(booking.start_datetime).toLocaleString()}</div>
                                    <div><strong>End:</strong> {new Date(booking.end_datetime).toLocaleString()}</div>
                                    <div><strong>Total Price:</strong> ₹{parseFloat(booking.total_price).toLocaleString()}</div>
                                    <div><strong>Booked By User ID:</strong> {booking.user_id}</div>
                                </div>

                                {booking.notes && (
                                    <div style={{ marginTop: '18px', paddingTop: '15px', borderTop: '1px solid rgba(199, 255, 46, 0.15)' }}>
                                        <strong>Notes:</strong> {booking.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
);

};

export default OwnerBookings;