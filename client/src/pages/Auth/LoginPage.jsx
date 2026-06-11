import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdLocationOn, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user && !user.isOtpVerified) navigate('/verify-otp');
      else if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'venue_owner') navigate('/owner/dashboard');
      else navigate('/venues');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const userData = await login(form.email, form.password);
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message?.[0] || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-100/60">
      {/* Background Subtle Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] top-[-100px] right-[-100px] animate-pulse duration-[8000ms]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[80px] bottom-[-100px] left-[-100px] animate-pulse duration-[6000ms]" />
      </div>

      <div className="w-full max-w-[440px] bg-white border border-slate-200 rounded-3xl p-8 relative z-10 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] hover:border-slate-300 transition-all duration-300">
        <div className="flex items-center gap-2 text-xl font-extrabold text-slate-900 mb-8">
          <MdLocationOn className="text-2xl text-primary animate-pulse" />
          <span>Book<span className="text-primary font-black">My</span>Venue</span>
        </div>
        
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Welcome back</h1>
        <p className="text-sm text-slate-500 mb-8">Sign in to discover and book amazing venues</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                id="login-email"
                type="email"
                className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="w-full py-3.5 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex items-center justify-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="w-full mt-4 py-3.5 font-bold rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.98] text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 flex justify-center items-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
