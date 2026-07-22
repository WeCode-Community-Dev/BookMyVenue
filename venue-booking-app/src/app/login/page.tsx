"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useApp();

  const messageParam = searchParams.get("message");
  const redirectParam = searchParams.get("redirect");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"customer" | "owner" | "admin">("customer");
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  // Forgot password states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Helper redirect destination
  const getDestination = (defaultPath: string) => {
    return redirectParam ? redirectParam : defaultPath;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    // Determine backend path & target details based on selected role
    let loginUrl = "http://localhost:8080/user/login";
    let targetRole: "customer" | "owner" | "admin" = selectedRole;
    let defaultRedirect = "/dashboard";
    let displayName = "Customer Guest";

    if (selectedRole === "admin") {
      loginUrl = "http://localhost:8080/admin/login";
      defaultRedirect = "/admin";
      displayName = "Admin User";
    } else if (selectedRole === "owner") {
      loginUrl = "http://localhost:8080/owner/login";
      defaultRedirect = "/host";
      displayName = "Venue Owner";
    }

    const lowerEmail = email.toLowerCase();

    try {
      const response = await fetch(
        loginUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email || email);
      localStorage.setItem("userRole", data.role || (targetRole === "owner" ? "OWNER" : targetRole === "admin" ? "ADMIN" : "USER"));

      // Synchronize frontend context state
      login(email, targetRole, displayName);

      toast.success("Login successful!");
      router.push(getDestination(defaultRedirect));
    } catch (error) {
      console.warn("Backend auth down. Simulating login locally.");
      
      // Fallback local simulation: authenticate locally using user-defined demo creds
      if (
        (lowerEmail === "user@bookmyvenue.com" && password === "user123") ||
        (lowerEmail === "customer@bookmyvenue.com" && password === "customer123") ||
        (lowerEmail === "owner@bookmyvenue.com" && password === "owner123") ||
        (lowerEmail === "admin@bookmyvenue.com" && password === "admin123")
      ) {
        localStorage.setItem("token", "simulated-jwt-token-xyz");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", targetRole === "owner" ? "OWNER" : targetRole === "admin" ? "ADMIN" : "USER");
        
        login(email, targetRole, displayName);
        toast.success("Login successful! (Simulated Mode)");
        router.push(getDestination(defaultRedirect));
      } else {
        toast.error("Unable to connect to server and invalid mock credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Login Mock
  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      login("john.doe@gmail.com", "customer", "John Doe");
      setIsGoogleLoading(false);
      toast.success("Successfully authenticated with Google!");
      router.push(getDestination("/venues"));
    }, 1500);
  };

  // Pre-fill demo accounts helper
  const fillDemoAccount = (roleType: "customer" | "owner" | "admin") => {
    setSelectedRole(roleType);
    if (roleType === "customer") {
      setEmail("customer@bookmyvenue.com");
      setPassword("customer123");
    } else if (roleType === "owner") {
      setEmail("owner@bookmyvenue.com");
      setPassword("owner123");
    } else if (roleType === "admin") {
      setEmail("admin@bookmyvenue.com");
      setPassword("admin123");
    }
    toast.info(`Pre-filled ${roleType.toUpperCase()} demo credentials.`);
  };

  // Forgot password email submission mock
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    setForgotSubmitted(true);
    toast.success("Password recovery link sent successfully!");
    setTimeout(() => {
      setForgotPasswordOpen(false);
      setForgotEmail("");
      setForgotSubmitted(false);
    }, 2500);
  };

  return (
    <div className="flex-1 min-h-screen flex items-stretch bg-background">
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
            Reserve spaces for meetings, weddings, and events.
          </h2>
          <p className="text-blue-100 text-base leading-relaxed">
            Gain access to hundreds of verified local boardrooms, production studios, ballrooms, and rooftop lounges in minutes.
          </p>

          {/* Testimonial preview */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-lg mt-8">
            <p className="text-sm italic text-blue-50 leading-normal">
              "BookMyVenue cut down our booking coordination from three days of phone tags to less than five minutes of automated requests."
            </p>
            <div className="mt-3 flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                EC
              </div>
              <div>
                <div className="text-xs font-bold">Emma Chen</div>
                <div className="text-xxs text-blue-200">Director of Operations, Acme Inc.</div>
              </div>
            </div>
          </div>
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

      {/* Right Column: Clean Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Logo brand for mobile */}
          <div className="flex items-center space-x-2 lg:hidden justify-center mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              BookMyVenue
            </span>
          </div>

          <Card className="border border-border bg-card shadow-sm rounded-2xl overflow-hidden">
            {/* Notice Alert Banner if redirected from booking */}
            {messageParam && (
              <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center space-x-2.5">
                <Lock className="h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{messageParam}</span>
              </div>
            )}

            <CardHeader className="space-y-1.5 p-6 sm:p-8">
              <CardTitle className="text-2xl font-extrabold tracking-tight text-foreground">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enter your email address and password to access your dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 pt-0 space-y-5">
              {/* Role selector tabs */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-secondary/60 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground select-none">
                <button
                  type="button"
                  onClick={() => setSelectedRole("customer")}
                  className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                    selectedRole === "customer"
                      ? "bg-card text-foreground shadow-sm font-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Customer
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
                  Host/Owner
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("admin")}
                  className={`py-2 rounded-lg transition-all cursor-pointer text-center ${
                    selectedRole === "admin"
                      ? "bg-card text-foreground shadow-sm font-black"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Admin
                </button>
              </div>

              {/* Form container */}
              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-bold text-foreground">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
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
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me option */}
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="rounded"
                  />
                  <Label htmlFor="remember" className="text-xs font-semibold text-muted-foreground cursor-pointer select-none">
                    Keep me signed in for 30 days
                  </Label>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-5 shadow transition-all cursor-pointer flex items-center justify-center mt-6"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-primary-foreground mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Separator lines */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border/80"></div>
                <span className="flex-shrink mx-4 text-xxs text-muted-foreground uppercase font-bold tracking-wider">
                  or continue with
                </span>
                <div className="flex-grow border-t border-border/80"></div>
              </div>

              {/* Continue with Google */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                variant="outline"
                className="w-full rounded-xl border-border bg-background hover:bg-muted text-foreground font-semibold py-5 shadow-sm transition-all cursor-pointer flex items-center justify-center"
              >
                {isGoogleLoading ? (
                  <div className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-primary mr-2" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                )}
                Continue with Google
              </Button>

              {/* Developer Demo Logins Banner */}
              <div className="bg-secondary/60 border border-border p-4 rounded-xl space-y-2.5">
                <span className="text-xxs font-bold text-muted-foreground uppercase tracking-wider flex items-center">
                  <UserCheck className="h-3.5 w-3.5 text-primary mr-1 shrink-0" />
                  Quick Developer Demo Login
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => fillDemoAccount("customer")}
                    className="bg-card hover:bg-primary/5 text-xxs font-semibold border border-border hover:border-primary py-1.5 rounded-lg text-foreground transition-all cursor-pointer"
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => fillDemoAccount("owner")}
                    className="bg-card hover:bg-primary/5 text-xxs font-semibold border border-border hover:border-primary py-1.5 rounded-lg text-foreground transition-all cursor-pointer"
                  >
                    Venue Owner
                  </button>
                  <button
                    onClick={() => fillDemoAccount("admin")}
                    className="bg-card hover:bg-primary/5 text-xxs font-semibold border border-border hover:border-primary py-1.5 rounded-lg text-foreground transition-all cursor-pointer"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center p-6 border-t border-border bg-muted/20 dark:bg-muted/5 rounded-b-2xl">
              <span className="text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Create an account
                </Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center">
              <AlertCircle className="h-5.5 w-5.5 text-primary mr-2" />
              Reset your password
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter the email address associated with your account, and we'll send you a recovery link.
            </DialogDescription>
          </DialogHeader>

          {forgotSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-6 space-y-3">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2 animate-pulse">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="font-extrabold text-sm text-foreground">Recovery email sent</h4>
              <p className="text-xxs text-muted-foreground max-w-xs leading-normal">
                An email containing instructions to reset your password has been sent to <strong>{forgotEmail}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="forgotEmail" className="text-xs font-bold text-foreground">
                  Email Address
                </Label>
                <Input
                  id="forgotEmail"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="rounded-xl border-border bg-background"
                />
              </div>

              <DialogFooter className="pt-4 border-t border-border flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold">
                  Send Recovery Link
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
