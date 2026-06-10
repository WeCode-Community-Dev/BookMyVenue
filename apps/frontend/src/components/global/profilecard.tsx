"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Camera,
} from "lucide-react";

export default function ProfileHeroCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 opacity-80" />

        <img
          src="/assets/images/profile-bg.png"
          alt=""
          className="absolute bottom-0 right-0 hidden h-44 w-auto opacity-60 lg:block"
        />
      </div>

      <div className="relative p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative mx-auto sm:mx-0">
              <Image
                src="https://i.pravatar.cc/300?img=12"
                alt="Profile"
                width={120}
                height={120}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-white sm:h-28 sm:w-28"
              />

              <button className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-bold text-slate-900">
                  Vishnu V
                </h2>

                <span className="inline-flex items-center justify-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 sm:justify-start">
                  <Mail className="h-4 w-4 text-teal-600" />
                  vishnu.raj@example.com
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 sm:justify-start">
                  <Phone className="h-4 w-4 text-teal-600" />
                  +91 98765 43210
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 sm:justify-start">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  Kochi, Kerala, India
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 sm:justify-start">
                  <CalendarDays className="h-4 w-4 text-teal-600" />
                  Member since May 2024
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center lg:justify-end">
            <button className="rounded-[8px] border border-teal-600 bg-white px-6 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}