"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Briefcase, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BecomeOwnerCardProps {
  role: "User" | "Venue Owner" | "Admin";
}

export default function BecomeOwnerCard({ role }: BecomeOwnerCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden select-none">
      {/* Subtle backdrop highlight */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-rose-600/10 blur-3xl pointer-events-none rounded-full" />
      
      {role === "User" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="size-5 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Become a Venue Owner</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-medium">
              List your wedding halls, birthday zones, resorts, turfs, or cafes on BookMyVenue and start accepting direct online bookings. Tap into our audience of event planners.
            </p>
          </div>
          <Button
            asChild
            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-6 rounded-2xl cursor-pointer shadow-md shrink-0 border-none select-none text-xs sm:text-sm"
          >
            <Link href="/profile?tab=become-owner">Become a Venue Owner</Link>
          </Button>
        </div>
      )}

      {role === "Venue Owner" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <Briefcase className="size-5 text-rose-500" />
              <span>Manage My Venues</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-medium">
              Add new spaces, configure slots and blackout dates in the calendar, adjust daily pricing packages, or reply directly to user booking inquiries.
            </p>
          </div>
          <Button
            asChild
            className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold h-11 px-6 rounded-2xl cursor-pointer shadow-md shrink-0 border-none select-none text-xs sm:text-sm"
          >
            <Link href="/profile?tab=my-venues">Manage My Venues</Link>
          </Button>
        </div>
      )}

      {role === "Admin" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10 text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <ShieldAlert className="size-5 text-rose-500" />
              <span>Admin Control Center</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-medium">
              Review pending venue verifications, inspect reports or flags, monitor platform-wide transactions, or adjust category tags list options.
            </p>
          </div>
          <Button
            asChild
            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 px-6 rounded-2xl cursor-pointer shadow-md shrink-0 border-none select-none text-xs sm:text-sm"
          >
            <Link href="/profile?tab=my-venues">Admin Dashboard</Link>
          </Button>
        </div>
      )}

    </div>
  );
}
