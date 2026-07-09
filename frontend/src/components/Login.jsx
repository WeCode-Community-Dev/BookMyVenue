import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            Swal.fire({
                title: 'Success!',
                text: 'Already logged in!',
                icon: 'success',
                timer: 1500, 
                showConfirmButton: false 
            });

            try {
                const payload = JSON.parse(atob(savedToken.split('.')[1]));
                const userRole = payload.role;
                
                setTimeout(() => {
                    if (userRole === 'admin') navigate('/admin-dashboard');
                    else if (userRole === 'user') navigate('/user-dashboard'); 
                    else if (userRole === 'owner') navigate('/owner-dashboard');
                }, 1500);
            } catch (e) {
                localStorage.removeItem('token');
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                const tokenParts = data.token.split('.');
                
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    const userRole = payload.role;
                    
                    Swal.fire({
                        title: 'Success!',
                        text: 'Login successful!',
                        icon: 'success',
                        timer: 1500, 
                        showConfirmButton: false 
                    });

                    setTimeout(() => {
                        if (userRole === 'admin') {
                            navigate('/admin-dashboard');
                        } else if (userRole === 'user') {
                            navigate('/user-dashboard'); 
                        } else if (userRole === 'owner') {
                            navigate('/owner-dashboard');
                        }
                    }, 1500);
                }
            }

        } catch (error) {
            setError(error.message || "Something went wrong. Please try again");
        } finally {
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
                background: 'rgba(26, 26, 26, 0.9)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(199, 255, 46, 0.2)',
                borderRadius: '24px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
                padding: '50px 45px',
                width: '100%',
                maxWidth: '440px',
                position: 'relative'
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '25px',
                        background: 'none',
                        border: 'none',
                        color: '#808080',
                        fontSize: '18px',
                        cursor: 'pointer'
                    }}
                >
                    ← Back
                </button>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{
                        fontSize: '2.8rem',
                        fontWeight: '800',
                        marginBottom: '8px',
                        color: '#FFFFFF'
                    }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: '#B0B0B0' }}>
                        Sign in to continue
                    </p>
                </div>

                {error && (
                    <p style={{
                        color: '#ff6b6b',
                        background: 'rgba(255, 107, 107, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#E0E0E0', fontWeight: '500' }}>
                            Email Address
                        </label>
                        <input 
                            type="email"      
                            name="email"            
                            value={formData.email}  
                            onChange={handleChange} 
                            required 
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(199, 255, 46, 0.2)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#C7FF2E'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(199, 255, 46, 0.2)'}
                        />
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#E0E0E0', fontWeight: '500' }}>
                            Password
                        </label>
                        <input 
                            type="password"        
                            name="password"         
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(199, 255, 46, 0.2)',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#C7FF2E'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(199, 255, 46, 0.2)'}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: '#C7FF2E',
                            color: '#0F0F0F',
                            border: 'none',
                            borderRadius: '60px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 25px rgba(199, 255, 46, 0.3)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 12px 35px rgba(199, 255, 46, 0.4)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 25px rgba(199, 255, 46, 0.3)';
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', color: '#888' }}>
                    Don't have an account?{' '}
                    <span 
                        onClick={() => navigate('/signup')}
                        style={{ color: '#C7FF2E', cursor: 'pointer', fontWeight: '600' }}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;