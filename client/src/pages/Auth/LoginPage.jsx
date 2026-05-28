import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdLocationOn } from 'react-icons/md';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin');
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-bg-primary">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] top-[-100px] right-[-100px] animate-pulse duration-[8000ms]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[80px] bottom-[-100px] left-[-100px] animate-pulse duration-[6000ms]" />
      </div>

      <div className="w-full max-w-[440px] glass bg-bg-card/40 backdrop-blur-2xl border border-white/8 rounded-3xl p-8 relative z-10 shadow-2xl transition-all duration-300 hover:border-white/12">
        <div className="flex items-center gap-2 text-xl font-extrabold text-white mb-8">
          <MdLocationOn className="text-2xl text-primary" />
          <span>Book<span className="text-primary-light">My</span>Venue</span>
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome back</h1>
        <p className="text-sm text-slate-400 mb-8">Sign in to discover and book amazing venues</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />
              <input
                id="login-email"
                type="email"
                className="w-full py-3.5 pl-12 pr-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all duration-200"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-primary-light hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />
              <input
                id="login-password"
                type="password"
                className="w-full py-3.5 pl-12 pr-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all duration-200"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            className="w-full mt-4 py-3.5 font-bold rounded-xl bg-gradient-to-r from-primary to-primary-light hover:brightness-110 active:scale-[0.98] text-white shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-200 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-light hover:text-white transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
