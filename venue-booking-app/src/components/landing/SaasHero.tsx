"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Users, Calendar, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SaasHero() {
  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchCapacity, setSearchCapacity] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set("location", searchLocation);
    if (searchType) params.set("type", searchType);
    if (searchCapacity) params.set("capacity", searchCapacity);
    router.push(`/venues?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden py-16 lg:py-24 border-b border-border/80 bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-slate-950/40 dark:via-background dark:to-background">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.88_0.02_250/0.45)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.88_0.02_250/0.45)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_60%,transparent_100%)] dark:bg-[linear-gradient(to_right,oklch(0.25_0.02_250/0.3)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.25_0.02_250/0.3)_1px,transparent_1px)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Status Pill Badge */}
        <div className="mx-auto mb-6 inline-flex items-center space-x-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>The Enterprise Venue Operating System</span>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.15]">
          Book Verified Venues & Spaces with{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Real-Time Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
          Discover high-performance boardrooms, photo studios, wedding halls, and rooftops. Filter availability by real-time slots and reserve instantly.
        </p>

        {/* Interactive Search Bar Widget */}
        <form
          onSubmit={handleSearchSubmit}
          className="mx-auto mt-10 max-w-4xl rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-3 shadow-xl ring-1 ring-black/5 dark:ring-white/10 flex flex-col md:flex-row items-stretch md:items-center gap-3"
        >
          {/* Location */}
          <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-border/60">
            <MapPin className="h-4.5 w-4.5 mr-2 text-primary shrink-0" />
            <div className="text-left w-full">
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Location
              </label>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">Any City</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="New York">New York, NY</option>
                <option value="Chicago">Chicago, IL</option>
                <option value="Los Angeles">Los Angeles, CA</option>
                <option value="Miami">Miami, FL</option>
                <option value="Austin">Austin, TX</option>
              </select>
            </div>
          </div>

          {/* Space Type */}
          <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-border/60">
            <Calendar className="h-4.5 w-4.5 mr-2 text-primary shrink-0" />
            <div className="text-left w-full">
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Venue Category
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="conference">Conference & Boardroom</option>
                <option value="wedding">Wedding & Grand Ballroom</option>
                <option value="coworking">Co-working Loft</option>
                <option value="studio">Creative Photo Studio</option>
                <option value="rooftop">Rooftop Lounge</option>
                <option value="garden">Garden Oasis</option>
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div className="flex-1 flex items-center px-4 py-2">
            <Users className="h-4.5 w-4.5 mr-2 text-primary shrink-0" />
            <div className="text-left w-full">
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Capacity
              </label>
              <select
                value={searchCapacity}
                onChange={(e) => setSearchCapacity(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">Any Capacity</option>
                <option value="15">Up to 15 guests</option>
                <option value="50">Up to 50 guests</option>
                <option value="100">Up to 100 guests</option>
                <option value="250">250+ guests</option>
              </select>
            </div>
          </div>

          {/* Search Action Button */}
          <Button
            type="submit"
            className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 py-6 text-sm shadow-md transition-all flex items-center justify-center cursor-pointer shrink-0"
          >
            <Search className="h-4.5 w-4.5 mr-2" />
            Find Spaces
          </Button>
        </form>

        {/* Stat Highlights Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-border/60 pt-8">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-foreground">500+</div>
            <div className="text-xs text-muted-foreground font-medium">Verified Venues</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-foreground">15,000+</div>
            <div className="text-xs text-muted-foreground font-medium">Hours Reserved</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-foreground">99.9%</div>
            <div className="text-xs text-muted-foreground font-medium">Slot Accuracy</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-foreground">4.9 / 5.0</div>
            <div className="text-xs text-muted-foreground font-medium">Guest Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
