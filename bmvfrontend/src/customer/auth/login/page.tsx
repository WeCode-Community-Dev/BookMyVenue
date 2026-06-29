"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/src/lib/authStore";
import { apiFetch } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ShieldAlert } from "lucide-react";
import { login } from "../../../common/auth/route";
import { LogoTicket } from "@/components/Logo";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const data = await login(email, password)

      // Set user session in UI store (secrets/tokens are secured in HttpOnly cookies)
      setSession({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        role: (data.user.role === "venue_owner" ? "venue_owner" : "customer") as "customer" | "venue_owner",
        isProfileCompleted: data.user.isProfileCompleted,
      });

      // Navigate to return URL or default dashboard
      if (data.user.role === "customer") {
        if (!data.user.isProfileCompleted) {
          router.push("/customer/profile");
        } else if (returnUrl && returnUrl !== "/") {
          router.push(returnUrl);
        } else {
          router.push("/customer");
        }
      } else {
        if (returnUrl && returnUrl !== "/") {
          router.push(returnUrl);
        } else {
          router.push("/partner/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please try again.");
    }
  };

  // const handleGoogleLogin = () => {
  //   // Set mock customer session
  //   setSession({
  //     name: "Google User",
  //     email: "googleuser@gmail.com",
  //     phone: "9988776655",
  //     role: "customer"
  //   });
  //   router.push(returnUrl);
  // };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">

      {/* Top right escape link */}
      <div className="absolute top-8 right-8 text-sm font-semibold">
        <Link href="/partner/login" className="text-teal-primary hover:underline flex items-center gap-1">
          Are you a venue partner? Login here &rarr;
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center items-center mb-3">
            <Link href="/" className="inline-block">
              <LogoTicket />
            </Link>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-dark">Welcome back</h2>
          <p className="mt-1.5 text-xs text-neutral-muted">
            Login to your customer account to manage bookings and wishlists.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border border-neutral-light shadow-xl bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2 items-center">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-muted uppercase">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-9 h-10 border-input rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Password</label>
                  <a href="#" className="text-xs font-semibold text-teal-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-9 h-10 border-input rounded-xl bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-neutral-dark"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-teal-primary hover:bg-teal-hover text-white py-3 h-auto text-sm font-bold shadow-md shadow-teal-primary/25 rounded-xl mt-2"
              >
                Log In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-light"></div>
              <span className="flex-shrink mx-3 text-neutral-muted text-[10px] font-bold uppercase">Or continue with</span>
              <div className="flex-grow border-t border-neutral-light"></div>
            </div>

            {/* Google Login */}
            {/* <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full border-input hover:bg-neutral-light h-10 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button> */}

            {/* Register link */}
            <p className="text-center text-xs text-neutral-muted pt-2">
              Don't have an account?{" "}
              <Link href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`} className="font-bold text-teal-primary hover:underline">
                Register
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
