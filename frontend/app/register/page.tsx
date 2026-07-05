"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/auth/PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/auth/GoogleButton";
import Divider from "@/components/auth/Divider";
import DeveloperLogin from "@/components/auth/DeveloperLogin";
import { useAuth } from "@/context/AuthContext";
import { Mail, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"User" | "Venue Owner">("User");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // OTP Verification states
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);

    // Mock alert trigger
    alert(`[Mock Verification Service] A verification code "${generatedOtp}" has been sent to ${email} to verify your account.`);
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp !== sentOtp) {
      setError("Invalid verification code. Please check and try again.");
      return;
    }

    // Success! Log the user in and update their profile details
    login(role);
    updateUser({
      name,
      email,
      role,
    });

    setStep(3);
  };

  const handleGoogleLogin = () => {
    alert("Mock Google registration triggered!");
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Step 1: Registration Form */}
        {step === 1 && (
          <div className="animate-in fade-in duration-200">
            {/* Headings */}
            <div className="text-center mb-6 space-y-2 select-none">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight animate-in slide-in-from-top-1.5 duration-300">Create Account</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
                Join BookMyVenue and find the perfect spaces for your events.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-650 text-xs font-bold text-left">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left">
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

              {/* Role Selection Tabs */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left">
                  I want to:
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1 rounded-xl select-none">
                  <button
                    type="button"
                    onClick={() => setRole("User")}
                    className={`py-2 rounded-lg text-xs font-extrabold cursor-pointer transition ${
                      role === "User" 
                        ? "bg-white text-rose-600 shadow-xs border-none" 
                        : "text-slate-500 hover:text-slate-800 bg-transparent border-none"
                    }`}
                  >
                    Book Venues
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("Venue Owner")}
                    className={`py-2 rounded-lg text-xs font-extrabold cursor-pointer transition ${
                      role === "Venue Owner" 
                        ? "bg-white text-rose-600 shadow-xs border-none" 
                        : "text-slate-500 hover:text-slate-800 bg-transparent border-none"
                    }`}
                  >
                    Host Venues
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left">
                  Confirm Password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start justify-between pt-1 select-none">
                <Checkbox
                  id="terms"
                  label="I agree to the Terms of Service and Privacy Policy"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                />
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none"
              >
                Create Account
              </Button>

              {/* Divider */}
              <Divider>OR</Divider>

              {/* Google SSO */}
              <GoogleButton onClick={handleGoogleLogin} />
            </form>

            {/* Bottom Switch Link */}
            <div className="mt-6 text-center text-sm font-medium text-slate-500 select-none">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Step 2: Email Verification (OTP) */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-450 hover:text-slate-655 transition cursor-pointer bg-transparent border-none"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Edit Profile</span>
            </button>

            <div className="text-center space-y-2 select-none">
              <div className="mx-auto size-12 rounded-full bg-rose-50 flex items-center justify-center mb-1">
                <KeyRound className="size-6 text-rose-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verify Your Email</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed max-w-[280px] mx-auto">
                We sent a 6-digit verification code to <span className="font-extrabold text-slate-800">{email}</span>. Enter the code to verify your account.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-655 text-xs font-bold text-left">
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
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none"
              >
                Verify & Activate
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setSentOtp(newOtp);
                    alert(`[Mock Verification Service] A new verification code "${newOtp}" has been sent to ${email}.`);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer bg-transparent border-none"
                >
                  Resend Code
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Registration Success */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in scale-in duration-200">
            <div className="text-center space-y-3 select-none">
              <div className="mx-auto size-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="size-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-905 tracking-tight">Account Verified!</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed max-w-[280px] mx-auto">
                Welcome to BookMyVenue! Your email <span className="font-extrabold text-slate-800">{email}</span> has been verified successfully. Let&apos;s get you started.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => {
                if (role === "Venue Owner") {
                  router.push("/profile?tab=become-owner"); // Open become owner tab or dashboard
                } else {
                  router.push("/");
                }
              }}
              className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold h-11 rounded-xl cursor-pointer shadow-xs border-none"
            >
              Get Started
            </Button>
          </div>
        )}
      </AuthCard>

      {/* Developer helper drawer */}
      <DeveloperLogin />
    </AuthLayout>
  );
}
