import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services';
import toast from 'react-hot-toast';
import { MdLock, MdLocationOn } from 'react-icons/md';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return toast.error('Please fill all fields');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (!token) return toast.error('Reset token is missing from the URL');

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message?.[0] || 'Reset failed. Token might be expired.');
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
        
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Reset password</h1>
        <p className="text-sm text-slate-400 mb-6">Enter your new password below</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />
              <input
                id="reset-password"
                type="password"
                className="w-full py-3.5 pl-12 pr-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500" />
              <input
                id="reset-confirm-password"
                type="password"
                className="w-full py-3.5 pl-12 pr-4 bg-white/5 border border-white/8 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-all duration-200"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            id="reset-submit"
            type="submit"
            className="w-full mt-2 py-3.5 font-bold rounded-xl bg-gradient-to-r from-primary to-primary-light hover:brightness-110 active:scale-[0.98] text-white shadow-lg shadow-primary/25 transition-all duration-200 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          <Link to="/login" className="font-semibold text-primary-light hover:text-white transition-colors">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
