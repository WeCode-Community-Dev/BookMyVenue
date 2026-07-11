import React, { useState } from 'react';
import { Lock, KeyRound, Mail, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { profileApi } from '../../services/profile.api';
import { toast } from 'sonner';
import { useAppStore } from '@/store/app.store';

const ChangePasswordSection = () => {
  const { user } = useAppStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleRequestOtp = async () => {
    try {
      setLoading(true);
      const res = await profileApi.requestPasswordOtp();
      if (res.success) {
        toast.success(res.message || 'OTP sent to your email.');
        setStep(2);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error('OTP is required');
    if (!newPassword) return toast.error('New password is required');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    if (!passwordRegex.test(newPassword)) {
      return toast.error('Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.');
    }

    try {
      setLoading(true);
      const res = await profileApi.changePassword({ otp, newPassword });
      if (res.success) {
        toast.success(res.message || 'Password updated successfully!');
        setStep(1);
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return null;
    if (passwordRegex.test(newPassword)) return <span className="text-xs text-green-500 flex items-center gap-1 mt-1"><CheckCircle size={12} /> Strong password</span>;
    return <span className="text-xs text-error flex items-center gap-1 mt-1"><AlertCircle size={12} /> Weak password</span>;
  };

  return (
    <div className="space-y-8 mt-12 pt-12 border-t border-border">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">Security & Password</h3>
        <p className="text-sm text-foreground/50 mt-1.5">
          {user?.authProvider === 'google' && !user.password
            ? 'Set a password for your account to allow email login.'
            : 'Update your password to keep your account secure.'}
        </p>
      </div>

      <div className="max-w-xl">
        {step === 1 ? (
          <div className="space-y-4 bg-muted/20 p-6 rounded-2xl border border-border/50">
            <div className="flex items-center gap-3 text-foreground/80 mb-2">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm">
                For security reasons, we will send a One-Time Password (OTP) to your registered email to verify your identity before you can {user?.authProvider === 'google' && !user.password ? 'set' : 'change'} your password.
              </p>
            </div>
            <button
              onClick={handleRequestOtp}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-accent text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail size={16} />
              {loading ? 'Sending OTP...' : 'Send OTP to Email'}
            </button>
          </div>
        ) : (
          <div className="space-y-5 bg-muted/10 p-6 rounded-2xl border border-border/50">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-semibold text-foreground/80">
                Enter OTP
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200 shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-semibold text-foreground/80">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {getPasswordStrength()}
              <p className="text-xs text-foreground/40 mt-1">
                Must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/80">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200 shadow-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={loading}
                className="px-6 py-2.5 bg-primary hover:bg-accent text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordSection;
