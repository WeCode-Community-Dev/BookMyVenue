import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services';
import toast from 'react-hot-toast';
import { MdEmail, MdLocationOn } from 'react-icons/md';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-bg-primary">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] top-[-100px] right-[-100px]" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[80px] bottom-[-100px] left-[-100px]" />
      </div>

      <div className="w-full max-w-[440px] glass bg-bg-card/40 backdrop-blur-2xl border border-white/8 rounded-3xl p-8 relative z-10 shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-2 text-xl font-extrabold text-white mb-6">
          <MdLocationOn className="text-2xl text-primary" />
          <span>Book<span className="text-primary-light">My</span>Venue</span>
        </div>
        
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          {sent ? 'Check your email' : 'Reset password'}
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          {sent ? `We sent a password reset link to ${email}` : 'Enter your email to receive a password reset link'}
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />
                <input
                  id="forgot-email"
                  type="email"
                  className="w-full py-3.5 pl-12 pr-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all duration-200"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              id="forgot-submit"
              type="submit"
              className="w-full mt-2 py-3.5 font-bold rounded-xl bg-gradient-to-r from-primary to-primary-light hover:brightness-110 active:scale-[0.98] text-white shadow-lg shadow-primary/25 transition-all duration-200 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="flex justify-center items-center py-6 text-5xl">
            ✨
          </div>
        )}

        <p className="text-center text-sm text-slate-400 mt-6">
          <Link to="/login" className="font-semibold text-primary-light hover:text-white transition-colors">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
