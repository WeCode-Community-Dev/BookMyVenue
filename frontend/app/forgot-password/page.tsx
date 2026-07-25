"use client";

import React, { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, KeyRound, CheckCircle2, Lock } from "lucide-react";
import * as authService from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setStep(2);
    } catch (err: any) {
      console.error("Forgot password request failed:", err);
      setError(err.response?.data?.message || "Failed to send verification code. Check email address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.verifyForgotPasswordOtp({ email, otp });
      setStep(3);
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(err.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({ email, newPassword: password, confirmPassword });
      setStep(4);
    } catch (err: any) {
      console.error("Password reset failed:", err);
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Back to Login Link for Steps 1, 2, and 3 */}
        {step < 4 && (
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-450 hover:text-slate-600 transition mb-6 select-none"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Sign In</span>
          </Link>
        )}

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2 select-none">
              <div className="mx-auto size-12 rounded-full bg-rose-50 flex items-center justify-center mb-1">
                <Mail className="size-6 text-rose-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight animate-in slide-in-from-top-1.5 duration-300">Forgot Password?</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed max-w-[280px] mx-auto">
                Enter your registered email address and we&apos;ll send you a verification code to reset your password.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-650 text-xs font-bold text-left">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none text-left">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2 select-none">
              <div className="mx-auto size-12 rounded-full bg-rose-50 flex items-center justify-center mb-1">
                <KeyRound className="size-6 text-rose-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify Code</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed max-w-[280px] mx-auto">
                We sent a 6-digit verification code to <span className="font-extrabold text-slate-800">{email}</span>. Please enter it below.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-650 text-xs font-bold text-left">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="otp" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none text-left">
                  Verification Code
                </label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center tracking-widest text-lg font-black h-11"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    setError("");
                    setIsLoading(true);
                    try {
                      await authService.forgotPassword({ email });
                      alert(`A new verification code has been successfully sent to ${email}.`);
                    } catch (err: any) {
                      setError(err.response?.data?.message || "Failed to resend code.");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer bg-transparent border-none disabled:opacity-50"
                >
                  {isLoading ? "Resending..." : "Resend Code"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2 select-none">
              <div className="mx-auto size-12 rounded-full bg-rose-50 flex items-center justify-center mb-1">
                <Lock className="size-6 text-rose-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">New Password</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed max-w-[280px] mx-auto">
                Create a strong, new password for your account.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-650 text-xs font-bold text-left">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none text-left">
                  New Password
                </label>
                <PasswordInput
                  id="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none text-left">
                  Confirm Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none disabled:opacity-50"
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </form>
          </div>
        )}

        {/* Step 4: Success Screen */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in scale-in duration-200">
            <div className="text-center space-y-3 select-none">
              <div className="mx-auto size-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="size-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-905 tracking-tight">Password Reset</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed max-w-[280px] mx-auto">
                Your password has been reset successfully! You can now log back in with your new credentials.
              </p>
            </div>

            <Link href="/login" className="block w-full">
              <Button
                type="button"
                className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold h-11 rounded-xl cursor-pointer shadow-xs border-none"
              >
                Go to Sign In
              </Button>
            </Link>
          </div>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
