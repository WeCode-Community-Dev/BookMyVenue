import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bmv_access_token') || localStorage.getItem('bmv_token');
    const savedUser = localStorage.getItem('bmv_user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('bmv_access_token');
        localStorage.removeItem('bmv_token');
        localStorage.removeItem('bmv_refresh_token');
        localStorage.removeItem('bmv_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { user: userData, accessToken, refreshToken } = res.data;
    localStorage.setItem('bmv_access_token', accessToken);
    localStorage.setItem('bmv_token', accessToken); // backward compatibility
    localStorage.setItem('bmv_refresh_token', refreshToken);
    localStorage.setItem('bmv_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const { user: userData, accessToken, refreshToken } = res.data;
    localStorage.setItem('bmv_access_token', accessToken);
    localStorage.setItem('bmv_token', accessToken); // backward compatibility
    localStorage.setItem('bmv_refresh_token', refreshToken);
    localStorage.setItem('bmv_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const verifyOtp = async (email, otp) => {
    const res = await authService.verifyOtp(email, otp);
    const { user: userData } = res.data;
    localStorage.setItem('bmv_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const resendOtp = async (email) => {
    const res = await authService.resendOtp(email);
    return res.data;
  };

  const logout = async () => {
    try {
      authService.logout().catch((err) => {
        console.error('Failed to log out from backend', err);
      });
    } catch (err) {
      console.error('Failed to log out from backend', err);
    }
    localStorage.removeItem('bmv_access_token');
    localStorage.removeItem('bmv_token');
    localStorage.removeItem('bmv_refresh_token');
    localStorage.removeItem('bmv_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifyOtp,
    resendOtp,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isVenueOwner: user?.role === 'venue_owner',
    isUser: user?.role === 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
