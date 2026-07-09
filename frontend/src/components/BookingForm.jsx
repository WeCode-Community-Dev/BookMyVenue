import React, { useState, useEffect } from "react";

const BookingForm = ({venueId, venueName, onClose }) => {
    const [formData, setFormData ] = useState({
        venue_id: '',
        start_datetime: '',
        end_datetime: ''
    });
   


    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(venueId){
            setFormData((prev) => ({ ...prev, venue_id: venueId}));
        }
    }, [venueId]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const getLocalDateTimeString = () => {
        const tzOffset = new Date().getTimezoneOffset() * 60000; 
        const localISOTime = new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
        return localISOTime;
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const token = localStorage.getItem('token');

            const response =await fetch('http://localhost:5000/booking', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Failed to create booking');
            }

            setIsError(false);
            setMessage(data.message || 'Booking created succesfully');

            setFormData((prev) => ({ ...prev, start_datetime: '', end_datetime: ''}));
        }catch(err){
            setIsError(true);
            setMessage(err.message);
        }finally{
            setLoading(false);
        }
    };

    return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F1A0F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
        
        <div style={{
            background: 'rgba(26, 26, 26, 0.92)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(199, 255, 46, 0.25)',
            borderRadius: '24px',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.7)',
            padding: '40px 45px',
            width: '100%',
            maxWidth: '480px',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '30px' 
            }}>
                <h3 style={{ 
                    margin: 0, 
                    fontSize: '1.9rem', 
                    fontWeight: '800',
                    color: '#FFFFFF'
                }}>
                    Book {venueName || 'Venue'}
                </h3>
                
                {onClose && (
                    <button 
                        onClick={onClose} 
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            fontSize: '28px', 
                            color: '#808080',
                            cursor: 'pointer',
                            lineHeight: '1'
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Message */}
            {message && (
                <p style={{ 
                    padding: '12px 16px', 
                    borderRadius: '10px', 
                    backgroundColor: isError ? 'rgba(255, 107, 107, 0.15)' : 'rgba(199, 255, 46, 0.15)', 
                    color: isError ? '#ff6b6b' : '#C7FF2E',
                    fontSize: '15px',
                    marginBottom: '25px',
                    border: isError ? '1px solid rgba(255,107,107,0.3)' : '1px solid rgba(199,255,46,0.3)'
                }}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <input type="hidden" name="venue_id" value={formData.venue_id} />

                <div>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        color: '#E0E0E0', 
                        fontWeight: '500' 
                    }}>
                        Start Date & Time
                    </label>
                    <input 
                        type="datetime-local" 
                        name="start_datetime"
                        value={formData.start_datetime}
                        onChange={handleChange}
                        min={getLocalDateTimeString()}
                        required
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(199, 255, 46, 0.25)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '6px', 
                        color: '#E0E0E0', 
                        fontWeight: '500' 
                    }}>
                        End Date & Time
                    </label>
                    <input 
                        type="datetime-local" 
                        name="end_datetime"
                        value={formData.end_datetime}
                        onChange={handleChange}
                        required
                        min={getLocalDateTimeString()}
                        style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(199, 255, 46, 0.25)',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        marginTop: '15px',
                        padding: '16px', 
                        background: loading ? '#555' : '#C7FF2E', 
                        color: loading ? '#aaa' : '#0F0F0F', 
                        border: 'none', 
                        borderRadius: '60px', 
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-3px)')}
                    onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    </div>
);

};

export default BookingForm;