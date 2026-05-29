import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { userService } from '../../services';
import toast from 'react-hot-toast';
import { MdLock, MdLocationOn, MdArrowBack } from 'react-icons/md';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Reset token is missing from your link URL');
    if (!newPassword || !confirmPassword) return toast.error('Please fill all fields');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await userService.resetPassword(token, newPassword);
      toast.success('Your account password has been successfully reset.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-100/60">
      {/* Background Subtle Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] top-[-100px] right-[-100px] animate-pulse duration-[8000ms]" />
      </div>

      <div className="w-full max-w-[440px] bg-white border border-slate-200 rounded-3xl p-8 relative z-10 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] hover:border-slate-300 transition-all duration-300">
        <div className="flex items-center gap-2 text-xl font-extrabold text-slate-900 mb-8">
          <MdLocationOn className="text-2xl text-primary animate-pulse" />
          <span>Book<span className="text-primary font-black">My</span>Venue</span>
        </div>
        
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Reset Password</h1>
        <p className="text-sm text-slate-500 mb-8">Please enter your new password details below.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                type="password"
                className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                type="password"
                className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 font-bold rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.98] text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 flex justify-center items-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
          <Link to="/login" className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark transition-colors">
            <MdArrowBack /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
