import React, { useState } from'react';
import { useNavigate, useLocation } from'react-router-dom';
import { login, register, parseJwt } from '../services/authApi';

const AuthPage = ({ setIsAuthenticated, setUserRole, showToast }) => {
 const navigate = useNavigate();
 const location = useLocation();
 const [isLogin, setIsLogin] = useState(true);
 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [role, setRole] = useState('CUSTOMER');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 if (isLogin) {
 await login(username, password);
 } else {
 await register({ username, password, role });
 await login(username, password); // login automatically after register
 }
 const token = localStorage.getItem('token');
 const payload = parseJwt(token);
 if (payload && payload.role) {
 setUserRole(payload.role);
 }
 setIsAuthenticated(true);
 showToast('Authenticated successfully!');
 
 const from = location.state?.from || (payload?.role ==='SUPER_ADMIN'?'/admin': payload?.role ==='PARTNER'?'/partner':'/');
 navigate(from, { replace: true });
 } catch (err) {
 setError(err.message ||'Authentication failed');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
 <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-[slide-up_0.3s_ease-out] border border-slate-800">
 <div className="px-8 pt-8 pb-6 text-center">
 <div className="w-16 h-16 bg-indigo-900/30 text-indigo-400 rounded-2xl mx-auto flex items-center justify-center mb-4 transform -rotate-6">
 <svg className="w-8 h-8"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
 </div>
 <h2 className="text-3xl font-extrabold text-slate-100 mb-2">
 {isLogin ?'Welcome back':'Create account'}
 </h2>
 <p className="text-slate-400">
 {isLogin ?'Enter your details to sign in':'Start booking amazing venues'}
 </p>
 </div>

 <div className="p-8 pt-0">
 {error && (
 <div className="bg-red-900/20 border border-red-800/50 text-red-400 text-sm p-4 rounded-xl mb-6 flex items-start">
 <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5 text-red-500"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
 <span>{error}</span>
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-sm font-semibold text-slate-300 mb-2">Username</label>
 <input
 type="text"
 name="username"
 value={username}
 onChange={(e) => setUsername(e.target.value)}
 className="input-field py-3"
 placeholder="johndoe"
 required
 />
 </div>

 {!isLogin && (
 <div>
 <label className="block text-sm font-semibold text-slate-300 mb-2">Account Type</label>
 <select 
 name="role"
 className="input-field py-3"
 value={role}
 onChange={(e) => setRole(e.target.value)}
 >
 <option value="CUSTOMER">Customer (Book venues)</option>
 <option value="PARTNER">Venue Partner (List venues)</option>
 </select>
 </div>
 )}
 
 <div>
 <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
 <input
 type="password"
 name="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="input-field py-3"
 placeholder="••••••••"
 required
 />
 {!isLogin && (
 <p className="text-xs text-slate-500 mt-2">
 Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.
 </p>
 )}
 </div>

 <button 
 type="submit"
 disabled={loading}
 className="btn-primary w-full py-3 text-lg mt-2 flex justify-center items-center"
 >
 {loading ? (
 <svg className="animate-spin h-5 w-5 text-white"fill="none"viewBox="0 0 24 24">
 <circle className="opacity-25"cx="12"cy="12"r="10"stroke="currentColor"strokeWidth="4"></circle>
 <path className="opacity-75"fill="currentColor"d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 ) : (
 isLogin ?'Sign In':'Create Account'
 )}
 </button>
 </form>
 
 <div className="mt-8 text-center text-sm text-slate-400">
 &nbsp;{isLogin ?"Don't have an account?":"Already have an account?"}
 <button 
 onClick={() => setIsLogin(!isLogin)}
 className="font-bold text-indigo-400 hover:text-indigo-300 focus:outline-none focus:underline transition-colors ml-1"
 >
 {isLogin ?'Sign up':'Log in'}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

export default AuthPage;
