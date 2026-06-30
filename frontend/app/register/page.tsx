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

export default function RegisterPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mock registration triggered!");
  };

  const handleGoogleLogin = () => {
    alert("Mock Google registration triggered!");
  };

  return (
    <AuthLayout>
      <AuthCard>
        {/* Headings */}
        <div className="text-center mb-8 space-y-2 select-none">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Join BookMyVenue and find the perfect spaces for your events.
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
            />
          </div>

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
            <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none">
              Password
            </label>
            <PasswordInput
              id="password"
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 uppercase tracking-wider block select-none">
              Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start justify-between pt-1">
            <Checkbox
              id="terms"
              label="I agree to the Terms of Service and Privacy Policy"
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
        <div className="mt-8 text-center text-sm font-medium text-slate-500 select-none">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700 transition-colors">
            Sign In
          </Link>
        </div>
      </AuthCard>

      {/* Developer helper drawer */}
      <DeveloperLogin />
    </AuthLayout>
  );
}
