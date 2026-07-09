import React, { useState } from "react";

const AddVenueFormByAdmin = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        city: '',
        address: '',
        capacity: '',
        price_per_hour: '',
        owner_email: ''
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/add-venue', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const textError = await response.text();
                try {
                    const data = JSON.parse(textError);
                    throw new Error(data.error || 'Failed to add venue');
                } catch {
                    throw new Error(`Server Error: Status ${response.status}`);
                }
            }

            const data = await response.json();
            setIsError(false);
            setMessage(data.message || 'Venue added successfully!');
            
            setFormData({ 
                name: '', 
                description: '', 
                city: '', 
                address: '', 
                capacity: '', 
                price_per_hour: '', 
                owner_email: '' 
            });
            
            setTimeout(() => { if (onClose) onClose(); }, 1500);

        } catch (err) {
            setIsError(true);
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const labelStyle = {
        display: 'block',
        marginBottom: '6px',
        color: '#E0E0E0',
        fontWeight: '500'
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(199, 255, 46, 0.25)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1rem',
        outline: 'none'
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
                maxWidth: '520px',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '30px' 
                }}>
                    <h3 style={{ 
                        margin: 0, 
                        fontSize: '2rem', 
                        fontWeight: '800',
                        color: '#FFFFFF'
                    }}>
                        Add New Venue
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
                    
                    <div>
                        <label style={labelStyle}>Venue Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle} 
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            required 
                            style={{ ...inputStyle, height: '80px', resize: 'vertical' }} 
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>City</label>
                        <input 
                            type="text" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle} 
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle} 
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Capacity</label>
                            <input 
                                type="number" 
                                name="capacity" 
                                value={formData.capacity} 
                                onChange={handleChange} 
                                required 
                                min="1" 
                                style={inputStyle} 
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Price/Hour ($)</label>
                            <input 
                                type="number" 
                                name="price_per_hour" 
                                value={formData.price_per_hour} 
                                onChange={handleChange} 
                                required 
                                min="0" 
                                step="0.01" 
                                style={inputStyle} 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Owner Email</label>
                        <input 
                            type="email" 
                            name="owner_email" 
                            value={formData.owner_email} 
                            onChange={handleChange} 
                            required 
                            style={inputStyle} 
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
                        {loading ? 'Processing...' : 'Add Venue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVenueFormByAdmin;