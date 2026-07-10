import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, User, Building } from 'lucide-react';
import { signupApi, googleAuthApi } from '../services/auth.api';
import { useAuthStore } from '../store/auth.store';
import { useAppStore } from '../../../store/app.store';
import OtpVerification from './OtpVerification';
import { GoogleLogin } from '@react-oauth/google';

const getRoleRedirect = (role: string) => {
  if (role === 'owner') return '/owner/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/';
};

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;

  const { signupStep, setRegistrationData, resetSignupFlow } = useAuthStore();
  const setAuth = useAppStore((state) => state.setAuth);

  React.useEffect(() => {
    resetSignupFlow();
    return () => {
      resetSignupFlow();
    };
  }, [resetSignupFlow]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [role, setRole] = useState<string>(location?.state?.role ?? 'user');
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await signupApi({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role,
      });

      setRegistrationData(data.data.email, data.data.verificationToken);
    } catch (err: any) {
      let msg = 'Something went wrong';
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

  // Google OAuth signup
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await googleAuthApi(credentialResponse.credential, role);

      const user = data.data.user;
      setAuth(user);

      let path = getRoleRedirect(user.role);

      navigate(path);
    } catch (error) {
      console.log('Google auth Error: ', error);
      setError('Google Auth Failed');
    } finally {
      setLoading(false);
    }
  };

  if (signupStep === 'otp') {
    return <OtpVerification mode="signup" />;
  }

  return (
    <>
      <div className="mb-5 text-center">
        <h2 id="signup-header-title" className="text-lg font-semibold text-white tracking-tight">
          Create Account
        </h2>
        <p className="text-[11px] text-slate-400 mt-1">Join our premium venue dashboard</p>
      </div>

      {error && (
        <div
          id="signup-error-alert"
          className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2"
        >
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Role Toggle */}
        <div className="flex flex-col gap-1.5">
          <label
            id="signup-role-label"
            className="text-[10px] font-medium text-slate-400 tracking-wide uppercase"
          >
            ROLE
          </label>
          <div className="grid grid-cols-2 gap-3 mt-0.5">
            {/* User / Guest Card */}
            <button
              id="signup-role-user-btn"
              type="button"
              onClick={() => setRole('user')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer select-none group focus:outline-none focus:ring-1 focus:ring-primary/40
                ${
                  role === 'user'
                    ? 'bg-primary/10 border-primary shadow-[0_0_12px_rgba(245,101,101,0.15)]'
                    : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-900/50 hover:border-slate-600'
                }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200
                  ${
                    role === 'user'
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                  }`}
              >
                <User size={15} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${
                    role === 'user' ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  Customer
                </span>
                <span className="text-[9px] text-slate-500 leading-tight">
                  Find and book premium venues
                </span>
              </div>
            </button>

            {/* Owner Card */}
            <button
              id="signup-role-owner-btn"
              type="button"
              onClick={() => setRole('owner')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer select-none group focus:outline-none focus:ring-1 focus:ring-primary/40
                ${
                  role === 'owner'
                    ? 'bg-primary/10 border-primary shadow-[0_0_12px_rgba(245,101,101,0.15)]'
                    : 'bg-slate-900/30 border-slate-700/50 hover:bg-slate-900/50 hover:border-slate-600'
                }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200
                  ${
                    role === 'owner'
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                  }`}
              >
                <Building size={15} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span
                  className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${
                    role === 'owner' ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  Venue Owner
                </span>
                <span className="text-[9px] text-slate-500 leading-tight">
                  List & manage your venues
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-fullName"
            className="text-[10px] font-medium text-slate-400 tracking-wide uppercase"
          >
            FULL NAME
          </label>
          <input
            type="text"
            id="signup-fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            required
            minLength={3}
            className="w-full bg-slate-950/35 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-email"
            className="text-[10px] font-medium text-slate-400 tracking-wide uppercase"
          >
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            id="signup-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            className="w-full bg-slate-950/35 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-phoneNumber"
            className="text-[10px] font-medium text-slate-400 tracking-wide uppercase"
          >
            PHONE NUMBER
          </label>
          <input
            type="tel"
            id="signup-phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+15550000000"
            required
            pattern="^\+?[1-9]\d{1,14}$"
            title="Please enter a valid phone number with country code, e.g. +15550000000 (digits only, no spaces or dashes)."
            className="w-full bg-slate-950/35 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-password"
            className="text-[10px] font-medium text-slate-400 tracking-wide uppercase"
          >
            PASSWORD
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="signup-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$"
              title="Min 8 chars with uppercase, lowercase, number and special character."
              className="w-full bg-slate-950/35 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
            />
            <button
              type="button"
              id="signup-toggle-password-btn"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="signup-confirmPassword"
            className="text-[10px] font-medium text-slate-400 tracking-wide uppercase"
          >
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="signup-confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-slate-950/35 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
            />
            <button
              type="button"
              id="signup-toggle-confirm-password-btn"
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
          id="signup-submit-btn"
          disabled={loading}
          className="w-full mt-2 bg-primary hover:bg-primary/95 text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center transition-all group disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg
                id="signup-spinner"
                className="w-4 h-4 animate-spin mr-2"
                viewBox="0 0 24 24"
                fill="none"
              >
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
              CREATE ACCOUNT
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center my-1">
          <div className="flex-grow border-t border-slate-700/60"></div>
          <span className="px-3 text-[10px] text-slate-500 uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-700/60"></div>
        </div>

        {/* Google Login */}
        <div id="signup-google-btn-wrapper" className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            theme="filled_black"
            text="continue_with"
            width="100%"
          />
        </div>
      </form>

      <div className="mt-4 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link
          to="/signin"
          id="signup-signin-link"
          className="text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          Sign In
        </Link>
      </div>
    </>
  );
};

export default Signup;
