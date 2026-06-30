"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-rose-50/20 via-slate-50 to-rose-50/10 relative overflow-hidden">
      {/* Background dot grid pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_50%,transparent_100%)] opacity-3 pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Logo row linking home */}
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg tracking-tight select-none mb-8 hover:opacity-90 transition-opacity">
          <Image
            src="/logo.jpg"
            alt="BookMyVenue Logo"
            width={36}
            height={36}
            className="rounded-lg object-contain border border-slate-100 shadow-xs"
          />
          <span className="text-slate-900 font-extrabold text-xl">
            BookMy<span className="text-rose-600">Venue</span>
          </span>
        </Link>

        {children}
      </div>
    </div>
  );
}
