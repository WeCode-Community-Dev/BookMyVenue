import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { forgotPasswordApi } from '../services/auth.api';
import OtpVerification from './OtpVerification';
import ResetPassword from './ResetPassword';
import { toast } from 'sonner';

const ForgotPasswordDetails = () => {
  const setForgotPasswordData = useAuthStore((state) => state.setForgotPasswordData);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await forgotPasswordApi(email);
      setForgotPasswordData(email, data.data.verificationToken);
      toast.success(data.message || 'OTP sent to your email');
    } catch (err: any) {
      let msg = 'Failed to send OTP';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5 text-center">
        <h2 className="text-lg font-semibold text-white tracking-tight">Forgot Password</h2>
        <p className="text-[11px] text-slate-400 mt-1 leading-5">
          Enter your registered email address and we'll send you an OTP to reset your password.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="name@company.com"
              required
              className="w-full bg-bg-base/50 border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !email}
          className="w-full mt-2 bg-primary hover:bg-primary-500 text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-primary-600/20 flex items-center justify-center transition-all group disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              SENDING OTP…
            </>
          ) : (
            <>
              SEND OTP
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-slate-400">
        Remember your password?{' '}
        <Link
          to="/signin"
          className="text-primary-500 hover:text-primary-400 font-semibold transition-colors"
        >
          Sign In
        </Link>
      </div>
    </>
  );
};

const ForgotPassword = () => {
  const step = useAuthStore((state) => state.forgotPasswordStep);

  return (
    <>
      {step === 'details' && <ForgotPasswordDetails />}
      {step === 'otp' && <OtpVerification mode="forgot-password" />}
      {step === 'reset' && <ResetPassword />}
    </>
  );
};

export default ForgotPassword;
