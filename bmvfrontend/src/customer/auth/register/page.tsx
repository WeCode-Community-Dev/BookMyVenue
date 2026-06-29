"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { setSession } from "@/src/lib/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Smartphone,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ChevronLeft,
  ShieldAlert,
  Sparkles,
  PartyPopper
} from "lucide-react";
import { sendOtp, verifyOtp, register } from "../../../common/auth/route"
import { LogoTicket } from "@/components/Logo";
export interface VerifyOtpResponse {
  verified: boolean;
  phone: string;
  phoneVerifiedToken: string;
}

export default function Register() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  // Step state: 1, 2, or 3
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Step 1: Mobile verification
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(30);

  // Step 2: Basic details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Step 3: Personalization
  const [favOccasion, setFavOccasion] = useState("");

  const [phoneToken, setPhoneToken] = useState<string | null>(null);
  const role = "customer";
  // OTP resend timer
  useEffect(() => {
    let interval: any;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // setError("");
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      await sendOtp(phone);
      console.log(phone)
      setOtpSent(true);
      setTimer(30);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
      console.error(error);
    }
  };
  const handleVerifyOtp = async () => {
    if (otpValue.length < 6) {
      setError("Please enter a valid  6-digit Otp");
      return;
    }

    try {
      const response = await verifyOtp(phone, otpValue);
      console.log(response);
      setPhoneToken(response.phoneVerifiedToken);
      setStep(2)
    }
    catch (error) {
      setError("Failed to verify");
      console.error(error);
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setOtpValue("");
    setError("");
  };

  const handleBasicDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!phoneToken) {
      setError("Please verify OTP first");
      return;
    }

    try {
      await register(name, phone, email, password, phoneToken, role);

      setSession({
        name,
        email,
        phone,
        role: "customer",
        isProfileCompleted: false,
      });

      router.push('/customer/profile');
    }
    catch (error) {
      setError("Failed to register");
      console.error(error);
    }


  };

  // const handleCompleteRegistration = (skipped = false) => {
  //   // Save customer session
  //   setSession({
  //     name: name,
  //     email: email,
  //     phone: phone,
  //     role: "customer"
  //   });

  //   // Success redirect
  //   router.push(returnUrl);
  // };

  // Step Progress values
  const progressPercent = step === 1 ? 50 : step === 2 ? 100 : 100;

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="text-center">
          <div className="flex justify-center items-center mb-3">
            <Link href="/" className="inline-block">
              <LogoTicket />
            </Link>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-dark">Create Account</h2>
          <p className="mt-1 text-xs text-neutral-muted">
            Join BookMyVenue to discover and book premium venues.
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        {/* Progress Bar */}
        <div className="mb-4 px-2">
          <div className="flex justify-between text-[10px] font-bold text-neutral-muted uppercase mb-1.5">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? "Verification" : step === 2 ? "Basic Info" : "Personalize"}</span>
          </div>
          <Progress value={progressPercent} className="h-1 bg-neutral-light">
            {/* Standard nested components from UI progress if customized, otherwise default handles value */}
          </Progress>
        </div>

        <Card className="border border-neutral-light shadow-xl bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8 space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2 items-center">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: MOBILE VERIFICATION */}
            {step === 1 && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <p className="text-xs text-neutral-muted leading-relaxed">
                      Enter your mobile number to receive a 6-digit OTP verification code.
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Phone Number</label>
                      <div className="flex gap-2">
                        <select className="h-10 border border-input rounded-xl bg-white text-xs px-2 outline-none font-semibold text-neutral-dark">
                          <option>+91 (IN)</option>
                          <option>+1 (US)</option>
                          <option>+44 (UK)</option>
                        </select>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                            <Smartphone className="h-4 w-4" />
                          </span>
                          <Input
                            type="tel"
                            required
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="**********"
                            className="pl-9 h-10 border-input rounded-xl bg-white"
                          />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-teal-primary hover:bg-teal-hover text-white py-3 h-auto text-sm font-bold shadow-md shadow-teal-primary/20 rounded-xl">
                      Send OTP Code
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="text-xs text-neutral-muted">
                      We've sent a 6-digit OTP to <strong className="text-neutral-dark">+91 {phone}</strong>.

                    </div>

                    <div className="flex flex-col items-center gap-4 py-2">
                      <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot index={0} className="w-10 h-10 bg-white border rounded-lg text-base" />
                          <InputOTPSlot index={1} className="w-10 h-10 bg-white border rounded-lg text-base" />
                          <InputOTPSlot index={2} className="w-10 h-10 bg-white border rounded-lg text-base" />
                          <InputOTPSlot index={3} className="w-10 h-10 bg-white border rounded-lg text-base" />
                          <InputOTPSlot index={4} className="w-10 h-10 bg-white border rounded-lg text-base" />
                          <InputOTPSlot index={5} className="w-10 h-10 bg-white border rounded-lg text-base" />
                        </InputOTPGroup>
                      </InputOTP>

                      {timer > 0 ? (
                        <span className="text-xs text-neutral-muted">Resend OTP in {timer}s</span>
                      ) : (
                        <button onClick={handleResendOtp} className="text-xs text-teal-primary font-bold hover:underline">
                          Resend OTP Code
                        </button>
                      )}
                    </div>

                    <Button onClick={handleVerifyOtp} className="w-full bg-teal-primary hover:bg-teal-hover text-white py-3 h-auto text-sm font-bold shadow-md shadow-teal-primary/20 rounded-xl">
                      Verify & Proceed
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: BASIC DETAILS */}
            {step === 2 && (
              <form onSubmit={handleBasicDetailsSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                      <User className="h-4 w-4" />
                    </span>
                    <Input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-9 h-10 border-input rounded-xl bg-white"
                    />
                  </div>
                </div>

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
                      placeholder="john@example.com"
                      className="pl-9 h-10 border-input rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
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

                {/* <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-9 pr-9 h-10 border-input rounded-xl bg-white"
                    />
                  </div>
                </div> */}

                <Button type="submit" className="w-full bg-teal-primary hover:bg-teal-hover text-white py-3 h-auto text-sm font-bold shadow-md shadow-teal-primary/20 rounded-xl">
                  Create Account
                </Button>
              </form>
            )}



            {step < 3 && (
              <p className="text-center text-xs text-neutral-muted pt-2 border-t border-neutral-light">
                Already have an account?{" "}
                <Link href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} className="font-bold text-teal-primary hover:underline">
                  Login
                </Link>
              </p>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
