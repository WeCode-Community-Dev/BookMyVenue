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

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
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
      console.error("Google login failed:", err);
      setError(err?.message || "Google sign-in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Headings */}
        <div className="text-center mb-8 space-y-2 select-none">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Sign in to continue booking amazing venues.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-650 text-xs font-bold text-left">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left font-sans">
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

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-bold text-slate-550 uppercase tracking-wider block select-none text-left font-sans">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition select-none">
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <Checkbox id="remember-me" label="Remember Me" />
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          {/* Divider */}
          <Divider>OR</Divider>

          {/* Google SSO */}
          <GoogleButton onClick={handleGoogleLogin} disabled={isGoogleLoading} label={isGoogleLoading ? "Connecting to Google..." : "Continue with Google"} />
        </form>

        {/* Bottom Switch Link */}
        <div className="mt-8 text-center text-sm font-medium text-slate-500 select-none">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-rose-600 hover:text-rose-700 transition-colors">
            Create Account
          </Link>
        </div>
      </AuthCard>

      {/* Developer helper drawer */}
    </AuthLayout>
  );
}



