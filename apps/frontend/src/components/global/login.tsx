"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import {
  ShieldCheck,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LoginModal({
  open,
  onOpenChange,
}: LoginModalProps) {
  const [step, setStep] = useState<"login" | "otp" | "success">("login");
  const [value, setValue] = useState("");

  const handleContinue = () => {
    if (!value) return;
    setStep("otp");
  };

  const handleVerify = () => {
    setStep("success");

    setTimeout(() => {
      onOpenChange(false);
      setStep("login");
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-0 p-0 overflow-hidden">

        {/* LOGIN STEP */}
        {step === "login" && (
          <div className="p-8">

            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
                <ShieldCheck className="h-10 w-10 text-teal-600" />
              </div>
            </div>

            <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-center text-slate-500">
              Login or sign in to continue
            </p>

            {/* Google */}
            <button className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white font-medium transition hover:bg-slate-50">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-500">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="mb-3 text-center text-sm text-slate-600">
              Enter your mobile number or email
            </p>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Mobile number or email address"
                className="h-14 w-full rounded-xl border border-slate-200 pl-12 pr-4 outline-none focus:border-teal-600"
              />
            </div>

            <button
              onClick={handleContinue}
              className="mt-4 h-14 w-full rounded-xl bg-teal-600 font-semibold text-white transition hover:bg-teal-700"
            >
              Continue
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              We'll send a one-time password (OTP)
            </p>

          </div>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div className="p-8">

            <button
              onClick={() => setStep("login")}
              className="mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
                <Mail className="h-10 w-10 text-teal-600" />
              </div>
            </div>

            <h2 className="mt-5 text-center text-3xl font-bold text-slate-900">
              Enter OTP
            </h2>

            <p className="mt-2 text-center text-slate-500">
              We sent a 6-digit OTP
            </p>

            <div className="mt-8 flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <input
                  key={item}
                  maxLength={1}
                  className="h-12 w-12 rounded-xl border border-slate-200 text-center text-lg font-semibold outline-none focus:border-teal-600"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              className="mt-8 h-14 w-full rounded-xl bg-teal-600 font-semibold text-white transition hover:bg-teal-700"
            >
              Verify & Login
            </button>

            <p className="mt-4 text-center text-sm text-teal-600">
              Resend OTP
            </p>

          </div>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <div className="p-10 text-center">

            <div className="flex justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-50">
                <CheckCircle2 className="h-12 w-12 text-teal-600" />
              </div>
            </div>

            <h2 className="mt-6 text-3xl font-bold text-slate-900">
              Login Successful!
            </h2>

            <p className="mt-2 text-slate-500">
              Welcome back 👋
            </p>

            <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-full animate-pulse bg-teal-600" />
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Redirecting...
            </p>

          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}