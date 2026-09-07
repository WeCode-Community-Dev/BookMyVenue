"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";

export default function HostCtaSection() {
  const router = useRouter();

  return (
    <section className="py-16 bg-background border-b border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-blue-500/20">
          
          {/* Decorative background circle */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          
          <div className="relative z-10 grid gap-8 md:grid-cols-3 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-bold text-blue-300">
                <Building2 className="h-3.5 w-3.5" />
                <span>Host Partner Network</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Have a Space to Monetize?
              </h2>
              <p className="text-blue-200 text-sm max-w-xl leading-relaxed">
                List your boardroom, banquet hall, or photo studio on BookMyVenue. Control hourly pricing, set custom holiday availability exceptions, and receive instant booking requests from verified guests.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-blue-100 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zero upfront listing fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Real-time availability manager</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant guest request notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Verified admin approval support</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 sm:flex-row md:flex-col sm:space-y-0 md:space-y-3 sm:space-x-3 md:space-x-0 justify-center">
              <Button
                onClick={() => router.push("/login?message=Sign+in+or+register+to+access+Host+Portal")}
                className="rounded-xl bg-white text-slate-900 hover:bg-blue-50 font-extrabold py-6 px-6 shadow-lg text-sm transition-transform hover:scale-102 cursor-pointer flex items-center justify-center"
              >
                List Your Space
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={() => router.push("/venues")}
                variant="outline"
                className="rounded-xl border-white/30 text-white hover:bg-white/10 font-bold py-6 px-6 text-sm cursor-pointer flex items-center justify-center"
              >
                Explore Partner Spaces
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
