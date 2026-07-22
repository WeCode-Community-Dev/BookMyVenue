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
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login, signup, updateUser, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);

    try {
      await signup(email, password, confirmPassword);
      await login(email, password);
      if (name.trim()) {
        await updateUser({ name: name.trim() });
      }
      router.push("/");
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.response?.data?.message || err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      router.push("/");
    } catch (err: any) {
      console.error("Google signup failed:", err);
      setError(err?.message || "Google sign-in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="animate-in fade-in duration-200">
          <div className="text-center mb-6 space-y-2 select-none">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
              Join BookMyVenue and start booking venues right away.
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
              <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left">
                Email Address
              </label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left">
                Password
              </label>
              <PasswordInput id="password" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left">
                Confirm Password
              </label>
              <PasswordInput id="confirmPassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <div className="flex items-start justify-between pt-1 select-none">
              <Checkbox
                id="terms"
                label="I agree to the Terms of Service and Privacy Policy"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <Divider>OR</Divider>

            <GoogleButton
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              label={isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
            />
          </form>

          <div className="mt-6 text-center text-sm font-medium text-slate-500 select-none">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
