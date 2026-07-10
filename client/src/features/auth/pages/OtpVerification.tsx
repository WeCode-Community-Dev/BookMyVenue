import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ShieldCheck, Mail } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { resendOtpApi, verifyOtpApi, verifyForgotPasswordOtpApi } from '../services/auth.api';

interface OtpVerificationProps {
  mode?: 'signup' | 'forgot-password';
}

const OTP_LENGTH = 6;

const OtpVerification: React.FC<OtpVerificationProps> = ({ mode = 'signup' }) => {
  const {
    pendingEmail,
    verificationToken,
    resendTimer,
    resendCount,
    maxResends,
    tickTimer,
    startResendTimer,
    incrementResendCount,
    resetSignupFlow,
    setSignupStep,
    setForgotPasswordStep,
    setResetToken,
  } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(id);
  }, [resendTimer, tickTimer]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    setError(null);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => {
      updated[i] = ch;
    });
    setOtp(updated);

    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const res = await verifyOtpApi(verificationToken as string, otpString);
        toast.success(res?.data?.message || 'User verified successfully!');
        resetSignupFlow();
        navigate('/signin');
      } else {
        const res = await verifyForgotPasswordOtpApi(verificationToken as string, otpString);
        toast.success(res?.data?.message || 'OTP verified successfully!');
        setResetToken(res.data.data.resetToken);
        setForgotPasswordStep('reset');
      }
    } catch (err: any) {
      let msg = 'Verification failed. Please try again.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);

      setOtp(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [otp, verificationToken, navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading) handleVerify();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleVerify, loading]);

  const handleResend = async () => {
    if (resendTimer > 0 || resendCount >= maxResends || resending) return;
    setResending(true);
    setError(null);
    try {
      await resendOtpApi(verificationToken as string);
      incrementResendCount();
      startResendTimer();
      setOtp(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
      toast.success('A new OTP has been sent to your email.');
    } catch (err: any) {
      let msg = 'Could not resend OTP. Please try again.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = pendingEmail
    ? pendingEmail.replace(
        /^(.{2})(.*)(@.*)$/,
        (_: string, a: string, b: string, c: string) => a + '*'.repeat(b.length) + c
      )
    : '';

  const allFilled = otp.every((d) => d !== '');

  return (
    <>
      {/* Header */}
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-600/10 border border-primary-500/30 mx-auto mb-3">
          <ShieldCheck className="w-6 h-6 text-primary-400" />
        </div>
        <h2 className="text-lg font-semibold text-white tracking-tight">Verify Your Email</h2>
        <p className="text-[11px] text-slate-400 mt-1 leading-5">
          We sent a 6-digit code to
          <br />
          <span className="text-slate-200 font-medium">{maskedEmail}</span>
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* OTP Input Grid */}
      <div className="flex gap-2 justify-center mb-5" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={loading}
            className={`
              w-10 h-12 text-center text-lg font-bold rounded-xl border transition-all duration-150 outline-none
              bg-bg-base/70 text-white caret-primary-500
              ${
                digit
                  ? 'border-primary-500 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]'
                  : 'border-slate-700/60 focus:border-primary-500 focus:shadow-[0_0_0_1px_rgba(239,68,68,0.3)]'
              }
              disabled:opacity-50
            `}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading || !allFilled}
        className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-xl shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 transition-all"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
            Verifying…
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            Verify Email
          </>
        )}
      </button>

      {/* Resend Section */}
      <div className="mt-4 text-center">
        {resendCount < maxResends ? (
          resendTimer > 0 ? (
            <p className="text-[11px] text-slate-500">
              Resend OTP in{' '}
              <span className="text-slate-300 font-semibold tabular-nums">
                {String(Math.floor(resendTimer / 60)).padStart(2, '0')}:
                {String(resendTimer % 60).padStart(2, '0')}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[11px] text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 mx-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending…' : 'Resend OTP'}
            </button>
          )
        ) : (
          <p className="text-[11px] text-slate-500">
            Max resends reached. Please{' '}
            <button
              onClick={() => {
                if (mode === 'signup') resetSignupFlow();
                else setForgotPasswordStep('details');
              }}
              className="text-primary-400 hover:text-primary-300 transition-colors underline"
            >
              start over
            </button>
            .
          </p>
        )}

        {/* Back button */}
        <button
          onClick={() => {
            if (mode === 'signup') setSignupStep('details');
            else setForgotPasswordStep('details');
          }}
          className="mt-3 text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 mx-auto transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Change email address
        </button>

        {/* Resend counter badge */}
        {resendCount > 0 && resendCount < maxResends && (
          <p className="mt-2 text-[10px] text-slate-600">
            <Mail className="inline w-3 h-3 mr-1" />
            {maxResends - resendCount} resend{maxResends - resendCount === 1 ? '' : 's'} remaining
          </p>
        )}
      </div>
    </>
  );
};

export default OtpVerification;
