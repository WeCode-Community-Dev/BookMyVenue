import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { resetPasswordApi } from '../services/auth.api';
import { toast } from 'sonner';

const ResetPassword = () => {
  const navigate = useNavigate();
  const resetToken = useAuthStore((state) => state.resetToken);
  const resetForgotPasswordFlow = useAuthStore((state) => state.resetForgotPasswordFlow);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken) {
      setError('Invalid session. Please start the password reset process again.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resetPasswordApi({
        resetToken,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast.success('Password reset successfully! Please sign in with your new password.');
      resetForgotPasswordFlow();
      navigate('/signin', { replace: true });
    } catch (err: any) {
      let msg = 'Failed to reset password';
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
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-600/10 border border-primary-500/30 mx-auto mb-3">
          <ShieldCheck className="w-6 h-6 text-primary-400" />
        </div>
        <h2 className="text-lg font-semibold text-white tracking-tight">Create New Password</h2>
        <p className="text-[11px] text-slate-400 mt-1 leading-5">
          Enter a strong new password for your account.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* New Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">
            NEW PASSWORD
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-bg-base/50 border border-slate-700/60 rounded-xl px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-slate-400 tracking-wide">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-bg-base/50 border border-slate-700/60 rounded-xl px-3 py-2 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.password || !formData.confirmPassword}
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
              RESETTING…
            </>
          ) : (
            <>
              RESET PASSWORD
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default ResetPassword;
