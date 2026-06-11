import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { MdSecurity, MdLocationOn, MdRefresh } from 'react-icons/md';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const { user, isAuthenticated, verifyOtp, resendOtp, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is not authenticated or already verified
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.isOtpVerified) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'venue_owner') navigate('/owner/dashboard');
      else navigate('/venues');
    }
  }, [isAuthenticated, user, navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP');
    if (otp.length !== 6) return toast.error('OTP must be exactly 6 digits');

    setLoading(true);
    try {
      const updatedUser = await verifyOtp(user.email, otp);
      toast.success('Account verified successfully!');
      
      // Redirect to appropriate dashboard/page after verification
      if (updatedUser.role === 'venue_owner') {
        navigate('/owner/dashboard');
      } else if (updatedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/venues');
      }
    } catch (err) {
      toast.error(err.response?.data?.message?.[0] || err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    try {
      await resendOtp(user.email);
      toast.success('A new OTP has been sent to your registered email!');
      setTimer(30);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      toast.error(err.response?.data?.message?.[0] || err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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

        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Verify account</h1>
        <p className="text-sm text-slate-500 mb-6">
          We sent a verification code to <span className="font-semibold text-slate-800">{user?.email}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verification Code (6-Digits)</label>
            <div className="relative">
              <MdSecurity className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
              <input
                id="otp-input"
                type="text"
                maxLength={6}
                className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-lg font-mono tracking-[0.5em] text-center placeholder-slate-300 focus:outline-none focus:border-primary focus:bg-white transition-all duration-200"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 6) setOtp(val);
                }}
              />
            </div>
          </div>

          <button
            id="otp-submit"
            type="submit"
            className="w-full py-3.5 font-bold rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.98] text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 flex justify-center items-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Verify & Activate'
            )}
          </button>
        </form>

        <div className="flex flex-col items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || resending}
            className={`flex items-center gap-2 font-bold text-sm transition-colors cursor-pointer ${
              canResend
                ? 'text-primary hover:text-primary-dark'
                : 'text-slate-400 cursor-not-allowed'
            }`}
          >
            <MdRefresh className={`text-lg ${resending ? 'animate-spin' : ''}`} />
            {canResend ? 'Resend Verification Code' : `Resend code in ${timer}s`}
          </button>

          <button
            type="button"
            onClick={logout}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Back to Sign In / Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
