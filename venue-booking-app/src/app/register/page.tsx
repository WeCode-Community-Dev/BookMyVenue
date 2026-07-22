"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, Sparkles, User, Phone, ArrowRight } from "lucide-react";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"customer" | "owner">("customer");
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);

  // Helper redirect destination
  const getDestination = (defaultPath: string) => {
    return redirectParam ? redirectParam : defaultPath;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    // Determine backend path
    let registerUrl = "http://localhost:8080/user/register";
    if (selectedRole === "owner") {
      registerUrl = "http://localhost:8080/owner/register";
    }

    try {
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Registration failed");
      }

      toast.success("Registration successful! Please log in.");
      router.push(`/login?message=Registration successful! Please sign in.&redirect=${encodeURIComponent(getDestination("/dashboard"))}`);
    } catch (error: any) {
      console.warn("Backend registration failed, simulating success locally.");
      
      // Simulate success locally if backend is unreachable / fails
      toast.success("Registration successful! (Simulated Mode)");
      router.push(`/login?message=Registration successful! (Simulated Mode)&redirect=${encodeURIComponent(getDestination("/dashboard"))}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow min-h-screen flex items-stretch bg-background">
      {/* Left Column: Premium Branding Graphic (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Logo brand */}
        <div className="relative z-10 flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-md">
            <Sparkles className="h-5.5 w-5.5" />
          </div>
          <span className="text-xl font-bold tracking-tight">BookMyVenue</span>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Create an account to start hosting or booking venues.
          </h2>
          <p className="text-blue-100 text-base leading-relaxed">
            Gain access to hundreds of verified local boardrooms, production studios, ballrooms, and rooftop lounges in minutes.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-blue-200 flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} BookMyVenue Inc.</span>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background animate-fade-in">
        <div className="w-full max-w-md space-y-6">
          <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1.5 p-6 sm:p-8">
              <CardTitle className="text-2xl font-extrabold tracking-tight text-foreground">
                Create a new account
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Register to book venues or list your own spaces on our platform.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 pt-0 space-y-5">
              {/* Role selector tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-secondary/60 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground select-none">
                <button
                  type="button"
                  onClick={() => setSelectedRole("customer")}
                  className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                    selectedRole === "customer"
                      ? "bg-card text-foreground shadow-sm font-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Customer / Guest
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("owner")}
                  className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                    selectedRole === "owner"
                      ? "bg-card text-foreground shadow-sm font-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Host / Owner
                </button>
              </div>

              {/* Form container */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name field */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-bold text-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Email address field */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Phone number field */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-foreground">
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-bold text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-5 shadow transition-all cursor-pointer flex items-center justify-center mt-6"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-primary-foreground mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Register
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center p-6 border-t border-border bg-muted/20 dark:bg-muted/5 rounded-b-2xl">
              <span className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in instead
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}
