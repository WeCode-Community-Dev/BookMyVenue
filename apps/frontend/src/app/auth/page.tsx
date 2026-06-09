// src/app/auth/signup/page.tsx

import Image from "next/image";
import { CalendarDays, MapPin, PartyPopper, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.15fr_0.85fr]">
        {/* LEFT SECTION */}
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-teal-50 via-white to-white p-6 md:p-8 lg:p-10 xl:p-12">
          <div>
            {/* Logo */}
            <Image
              src="/assets/logos/logo.png"
              alt="BookMyVenue"
              width={280}
              height={80}
              priority
              className="mb-6 h-auto w-[180px] md:w-[220px]"
            />

            {/* Heading */}
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[42px] xl:text-5xl">
              Every celebration starts at the
              <span className="ml-2 text-teal-600">perfect venue</span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-md text-base text-slate-600 lg:text-[17px] xl:text-lg">
              Join thousands of people who discover, book and celebrate
              unforgettable moments.
            </p>

            {/* Features */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                  <MapPin className="h-7 w-7 text-teal-700" />
                </div>

                <h3 className="font-semibold text-slate-900">Discover</h3>

                <p className="mt-1 text-sm text-slate-500">Amazing Venues</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                  <CalendarDays className="h-7 w-7 text-teal-700" />
                </div>

                <h3 className="font-semibold text-slate-900">Book</h3>

                <p className="mt-1 text-sm text-slate-500">With Ease</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                  <PartyPopper className="h-7 w-7 text-teal-700" />
                </div>

                <h3 className="font-semibold text-slate-900">Celebrate</h3>

                <p className="mt-1 text-sm text-slate-500">Memories Forever</p>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="mt-10 hidden lg:flex lg:justify-center">
            <Image
              src="/assets/images/signup-illustration.png"
              alt="Venue Illustration"
              width={700}
              height={500}
              priority
              className="h-auto w-full max-w-[650px]"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center justify-center p-6 md:p-8 lg:p-10 xl:p-12">
          <div className="w-full max-w-md xl:max-w-lg">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 sm:h-20 sm:w-20">
                <div className="h-8 w-8 rounded-full border-2 border-teal-600 sm:h-10 sm:w-10" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Create Account
              </h2>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Start discovering amazing venues today.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:h-14"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:h-14"
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:h-14"
              />

              <input
                type="password"
                placeholder="Password"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:h-14"
              />

              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-teal-600 text-white font-semibold transition hover:bg-teal-700 sm:h-14"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-500">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google Button */}
            <button className="h-12 w-full rounded-xl border border-slate-200 bg-white font-medium transition hover:bg-slate-50 sm:h-14">
              Continue with Google
            </button>

            {/* Login Link */}
            {/* <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?
              <button className="ml-1 font-semibold text-teal-600 hover:text-teal-700">
                Sign In
              </button>
            </p> */}
            <div className="mt-6 text-center text-sm text-slate-500">
              <span>Already have an account?</span>

              <button
                type="button"
                className="ml-1 font-semibold text-teal-600 hover:text-teal-700"
              >
                Sign In
              </button>
            </div>

            {/* Trust Section */}
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center">
                <ShieldCheck className="mx-auto mb-2 h-6 w-6 text-teal-600" />
                <p className="text-xs text-slate-500">Secure</p>
              </div>

              <div className="text-center">
                <ShieldCheck className="mx-auto mb-2 h-6 w-6 text-teal-600" />
                <p className="text-xs text-slate-500">Fast</p>
              </div>

              <div className="text-center">
                <ShieldCheck className="mx-auto mb-2 h-6 w-6 text-teal-600" />
                <p className="text-xs text-slate-500">Trusted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
