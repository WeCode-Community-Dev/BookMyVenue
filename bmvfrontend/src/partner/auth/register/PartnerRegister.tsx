"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Building,
  MapPin,
  ChevronLeft,
  ShieldAlert,
  Sparkles,
  Store
} from "lucide-react";
import { sendOtp, verifyOtp } from "@/src/common/auth/route";
import { register } from "@/src/common/auth/route";
import { LogoTicket } from "@/components/Logo";
import { email } from "zod";
export default function PartnerRegister() {
  const router = useRouter();

  // Step state: 1, 2, or 3
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Step 1: Mobile verification
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(30);

  // Step 2: Business details
  const [ownerName, setOwnerName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [venueName, setVenueName] = useState("");
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneToken, setPhoneToken] = useState<string | null>(null);
  // Step 3: Venue Onboarding Questions
  const [venueType, setVenueType] = useState("");
  const [venueCapacity, setVenueCapacity] = useState("");
  const role = "venue_owner";
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
    setError("");
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    try {
      await sendOtp(phone)

      setOtpSent(true);
      setTimer(30);
    }
    catch (error) {
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

  const handleBusinessDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!ownerName.trim()) {
      setError("Owner/Manager name is required.");
      return;
    }
    if (!businessEmail.includes("@")) {
      setError("Please enter a valid business email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }


    if (!phoneToken) {
      setError("Please verify OTP first");
      return;
    }
    try {
      await register(ownerName, phone, businessEmail, password, phoneToken, role);

      setSession({
        name: ownerName,
        email: businessEmail,
        phone,
        role,
        isProfileCompleted: false,
      });

      router.push('/partner/onboarding');
    }
    catch (error) {
      setError("Failed to register");
      console.error(error);
    }


    // setStep(3);
  };

  // const handleCompleteRegistration = (skipped = false) => {
  //   // Save partner session
  //   setSession({
  //     name: ownerName,
  //     email: businessEmail,
  //     phone: phone,
  //     role: "venue_owner"
  //   });

  //   // Go to dashboard
  //   router.push("/partner/dashboard");
  // };

  const progressPercent = step === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">

      {/* Back button */}
      {step > 1 && (
        <button
          onClick={() => {
            setError("");
            setStep((prev) => prev - 1);
          }}
          className="absolute top-8 left-8 text-sm font-semibold text-neutral-muted hover:text-teal-primary flex items-center gap-1 focus:outline-none"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Step {step - 1}
        </button>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="text-center">
          <div className="flex justify-center items-center mb-3 gap-2">
            <Link href="/" className="inline-block">
              <LogoTicket />
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-neutral-dark text-white px-2 py-0.5 rounded-md self-center">Partner</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-neutral-dark mt-3">Register Venue Business</h2>
          <p className="mt-1 text-xs text-neutral-muted">
            Partner with us to capture local inquiries and bookings.
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        {/* Progress Bar */}
        <div className="mb-4 px-2">
          <div className="flex justify-between text-[10px] font-bold text-neutral-muted uppercase mb-1.5">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? "Owner Verify" : "Business Info"}</span>
          </div>
          <Progress value={progressPercent} className="h-1 bg-neutral-light" />
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
                      Enter your mobile number to verify your partner profile identity.
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-muted uppercase">Owner Phone Number</label>
                      <div className="flex gap-2">
                        <select className="h-10 border border-input rounded-xl bg-white text-xs px-2 outline-none font-semibold text-neutral-dark">
                          <option>+91 (IN)</option>
                          {/* <option>+1 (US)</option>
                          <option>+44 (UK)</option> */}
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
                            placeholder="9876543210"
                            className="pl-9 h-10 border-input rounded-xl bg-white"
                          />
                        </div>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-teal-primary hover:bg-teal-hover text-white py-3 h-auto text-sm font-bold shadow-md shadow-teal-primary/20 rounded-xl">
                      Send Verification Code
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="text-xs text-neutral-muted">
                      We've sent a 6-digit OTP code to <strong className="text-neutral-dark">+91 {phone}</strong>.
                      <p className="text-[10px] text-teal-primary mt-1 font-semibold">Demo Code: Enter 123456</p>
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

            {/* STEP 2: BUSINESS DETAILS */}
            {step === 2 && (
              <form onSubmit={handleBusinessDetailsSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Owner / Manager Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                        <User className="h-4 w-4" />
                      </span>
                      <Input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Rajesh Kumar"
                        className="pl-9 h-10 border-input rounded-xl bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Business Email</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                        <Mail className="h-4 w-4" />
                      </span>
                      <Input
                        type="email"
                        required
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="rajesh@banquets.com"
                        className="pl-9 h-10 border-input rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {/* 
                  <div className="space-y-1.5">
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
                        placeholder="Confirm Password"
                        className="pl-9 pr-9 h-10 border-input rounded-xl bg-white"
                      />
                    </div>
                  </div> */}
                </div>
                {/* 
                <hr className="border-neutral-light my-2" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Business / Venue Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                        <Building className="h-4 w-4" />
                      </span>
                      <Input
                        type="text"
                        required
                        value={venueName}
                        onChange={(e) => setVenueName(e.target.value)}
                        placeholder="Pearl Banquet Hall"
                        className="pl-9 h-10 border-input rounded-xl bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">City</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <Input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Kochi"
                        className="pl-9 h-10 border-input rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div> */}

                <Button type="submit" className="w-full bg-teal-primary hover:bg-teal-hover text-white py-3 h-auto text-sm font-bold shadow-md shadow-teal-primary/20 rounded-xl mt-2">
                  Register
                </Button>
              </form>
            )}

            {/* STEP 3: VENUE ONBOARDING QUESTIONS */}
            {/* {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="h-14 w-14 rounded-2xl bg-amber-light text-amber-cta flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <Sparkles className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-neutral-dark">Tell Us About Your Venue</h3>
                  <p className="text-xs text-neutral-muted mt-1 leading-relaxed">
                    Set up your first listing to start receiving booking requests.
                  </p>
                </div>

                <div className="text-left space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">What type of space is it?</label>
                    <select
                      value={venueType}
                      onChange={(e) => setVenueType(e.target.value)}
                      className="w-full h-10 border border-input rounded-xl bg-white text-xs px-3 outline-none font-semibold text-neutral-dark"
                    >
                      <option value="">Select Space Type</option>
                      <option value="Hall">Banquet Hall</option>
                      <option value="Rooftop">Rooftop Lounge</option>
                      <option value="Lawn">Manicured Lawn</option>
                      <option value="Resort">Beachfront Resort</option>
                      <option value="Studio">Creative Studio</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Maximum Guest Capacity</label>
                    <Input
                      type="number"
                      value={venueCapacity}
                      onChange={(e) => setVenueCapacity(e.target.value)}
                      placeholder="e.g. 500"
                      className="h-10 border-input rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-light">
                  <button
                    onClick={() => handleCompleteRegistration(true)}
                    className="flex-1 border border-input hover:bg-neutral-light text-xs font-semibold py-3.5 rounded-xl text-neutral-dark"
                  >
                    Skip & Complete
                  </button>
                  <Button
                    onClick={() => handleCompleteRegistration(false)}
                    className="flex-1 bg-teal-primary text-white hover:bg-teal-hover py-3.5 h-auto text-xs font-bold rounded-xl"
                  >
                    Finish Onboarding
                  </Button>
                </div>
              </div>
            )} */}

            {/* Back to Login link */}
            {step < 2 && (
              <p className="text-center text-xs text-neutral-muted pt-2 border-t border-neutral-light">
                Already registered?{" "}
                <Link href="/partner/login" className="font-bold text-teal-primary hover:underline">
                  Login here
                </Link>
              </p>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
