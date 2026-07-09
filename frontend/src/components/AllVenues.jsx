import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

 const onClose = () => {
        navigate('/admin-dashboard');
    }; 

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token'); // if you use token

      const response = await fetch('http://localhost:5000/venues', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      setVenues(data);
    } catch (err) {
      console.error(err);

      const errMsg = err.message || '';

      if (errMsg.toLowerCase().includes('access') || 
          errMsg.toLowerCase().includes('unauthorized') ||
          err.status === 401 || err.status === 403) {
        
        alert("You don't have access or session expired. Redirecting to login...");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        setError(errMsg || "Failed to load venues. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">Loading venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
        <button 
          onClick={fetchVenues}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
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
                marginBottom: '40px'
            }}>
                <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', color: '#C7FF2E' }}>
                    All Venues
                </h1>
              <div
              style={{ display: 'flex', gap: '12px' }}>
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    🔄 Refresh
                </button>
                 {onClose && (
                <button 
                    onClick={onClose} 
                    style={{
                        padding: '12px 24px',
                        background: '#C7FF2E',
                        color: '#0F0F0F',
                        border: 'none',
                        borderRadius: '50px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                  }}
                >
                         Go Back
                </button>
            )}
            </div>  
            </div>

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
                    gap: '20px',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))'
                }}>
                    {venues.map((venue) => (
                        <div 
                            key={venue.id} 
                            style={{
                                background: 'rgba(26, 26, 26, 0.85)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(199, 255, 46, 0.25)',
                                borderRadius: '20px',
                                padding: '28px',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-6px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, color: '#FFFFFF' }}>{venue.name}</h3>
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {venue.is_verified && (
                                        <span style={{ 
                                            width: '80px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '30px',
                                            boxsizing: 'border-box',
                                            padding: '4px 12px', 
                                            background: 'rgba(199, 255, 46, 0.2)', 
                                            color: '#C7FF2E',
                                            borderRadius: '30px',
                                            fontSize: '13px',
                                            fontWeight: '600'
                                        }}>
                                            ✓ Verified
                                        </span>
                                    )}
                                    {venue.is_active && (
                                        <span style={{ 
                                            width: '80px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '30px',
                                            boxsizing: 'border-box',
                                            padding: '4px 12px', 
                                            background: 'rgba(0, 255, 100, 0.2)', 
                                            color: '#00ff88',
                                            borderRadius: '30px',
                                            fontSize: '13px',
                                            fontWeight: '600'
                                        }}>
                                            Active
                                        </span>
                                    )}
                                   
                                </div>
                            </div>

                            <p style={{ margin: '12px 0', color: '#B0B0B0', lineHeight: '1.5' }}>
                                {venue.description || 'No description available.'}
                            </p>

                            <div style={{ margin: '20px 0', color: '#C0C0C0' }}>
                                📍 <strong>{venue.city}</strong> — {venue.address}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem' }}>
                                <div><strong>Capacity:</strong> {venue.capacity} guests</div>
                                <div><strong>Price:</strong> ₹{Number(venue.price_per_hour).toLocaleString()} / hour</div>
                            </div>

                            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(199, 255, 46, 0.15)' }}>
                                <button 
                                    onClick={() => alert(`Details for: ${venue.name}`)}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: 'transparent',
                                        color: '#C7FF2E',
                                        border: '2px solid #C7FF2E',
                                        borderRadius: '50px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = '#C7FF2E';
                                        e.target.style.color = '#0F0F0F';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.color = '#C7FF2E';
                                    }}
                                >
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);
};
export default AllVenues;