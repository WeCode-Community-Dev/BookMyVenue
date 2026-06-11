import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdPerson, MdPhone, MdLocationOn, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const userData = await register(form);
      toast.success(`Welcome to BookMyVenue, ${userData.name}!`);
      if (userData && !userData.isOtpVerified) navigate('/verify-otp');
      else if (userData.role === 'venue_owner') navigate('/owner/dashboard');
      else navigate('/venues');
    } catch (err) {
      toast.error(err.response?.data?.message?.[0] || 'Registration failed');
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

      <div className="w-full max-w-[560px] bg-white border border-slate-200 rounded-3xl p-8 relative z-10 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] hover:border-slate-300 transition-all duration-300">
        <div className="flex items-center gap-2 text-xl font-extrabold text-slate-900 mb-6">
          <MdLocationOn className="text-2xl text-primary animate-pulse" />
          <span>Book<span className="text-primary font-black">My</span>Venue</span>
        </div>
        
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">Join thousands discovering perfect venues</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              type="button"
              id="role-user"
              className={`py-3.5 px-4 font-bold text-sm rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                form.role === 'user'
                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-primary/50 hover:text-slate-700'
              }`}
              onClick={() => setForm({ ...form, role: 'user' })}
            >
              🙋 I'm a Guest
            </button>
            <button
              type="button"
              id="role-owner"
              className={`py-3.5 px-4 font-bold text-sm rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                form.role === 'venue_owner'
                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-primary/50 hover:text-slate-700'
              }`}
              onClick={() => setForm({ ...form, role: 'venue_owner' })}
            >
              🏢 I'm an Owner
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name *</label>
              <div className="relative">
                <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                <input
                  id="reg-name"
                  type="text"
                  className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <div className="relative">
                <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                <input
                  id="reg-phone"
                  type="tel"
                  className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                id="reg-email"
                type="email"
                className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="w-full py-3.5 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="Min 6 characters"
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
            id="reg-submit"
            type="submit"
            className="w-full mt-4 py-3.5 font-bold rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.98] text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 flex justify-center items-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
