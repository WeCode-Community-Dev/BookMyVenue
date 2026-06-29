"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/src/lib/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ShieldAlert } from "lucide-react";
import Login from "@/src/customer/auth/login/page";
import { login } from "@/src/common/auth/route";
import { LogoTicket } from "@/components/Logo";
export default function PartnerLogin() {
  const router = useRouter();

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
        role: (data.user.role === "venue_owner" ? "venue_owner" : "admin") as "admin" | "venue_owner",
        // isProfileCompleted: data.user.isProfileCompleted,
      });

      // Navigate to return URL or home
      if (data.user.role === "venue_owner" && !data.user.isProfileCompleted) {
        router.push("/partner/status");
      }
      else if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      }
      else {
        router.push("/partner/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">

      {/* Top right escape link */}
      <div className="absolute top-8 right-8 text-sm font-semibold">
        <Link href="/login" className="text-teal-primary hover:underline flex items-center gap-1">
          Looking to book a venue? Customer login &rarr;
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex justify-center items-center mb-3 gap-2">
            <Link href="/" className="inline-block">
              <LogoTicket />
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-neutral-dark text-white px-2 py-0.5 rounded-md self-center">Partner</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-dark mt-3">Welcome Back, Partner</h2>
          <p className="mt-1.5 text-xs text-neutral-muted">
            Access your venue management panel, check calendar slots, and view payouts.
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
                <label className="text-xs font-bold text-neutral-muted uppercase">Business Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@yourvenue.com"
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

              <Button
                type="submit"
                className="w-full bg-teal-primary hover:bg-teal-hover text-white py-3 h-auto text-sm font-bold shadow-md shadow-teal-primary/25 rounded-xl mt-2"
              >
                Log In to Business Panel
              </Button>
            </form>

            <p className="text-center text-xs text-neutral-muted pt-2 border-t border-neutral-light">
              New partner?{" "}
              <Link href="/partner/register" className="font-bold text-teal-primary hover:underline">
                Register here
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
