"use client";

import React from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/auth/PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/auth/GoogleButton";
import Divider from "@/components/auth/Divider";
import DeveloperLogin from "@/components/auth/DeveloperLogin";

export default function LoginPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mock sign-in triggered!");
  };

  const handleGoogleLogin = () => {
    alert("Mock Google sign-in triggered!");
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
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition select-none">
                Forgot Password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
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
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl cursor-pointer shadow-xs active:translate-y-px transition-all border-none"
          >
            Sign In
          </Button>

          {/* Divider */}
          <Divider>OR</Divider>

          {/* Google SSO */}
          <GoogleButton onClick={handleGoogleLogin} />
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
      <DeveloperLogin />
    </AuthLayout>
  );
}
