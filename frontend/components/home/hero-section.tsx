"use client";

import React from "react";
import { Compass, ShieldCheck, Zap, Award } from "lucide-react";
import { SearchBar } from "./search-bar";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  onSearchTag: (tag: string) => void;
}

export function HeroSection({ onSearchTag }: HeroSectionProps) {
  const popularTags = ["Dream Weddings", "Corporate Summits", "Poolside Galas", "Chic Cafes", "Social Meetups"];

  const handleTagClick = (tag: string) => {
    // Map tag string to category matching logic or just callback
    if (tag.includes("Weddings")) onSearchTag("Wedding");
    else if (tag.includes("Summits")) onSearchTag("Conference");
    else if (tag.includes("Galas")) onSearchTag("Resort");
    else if (tag.includes("Cafes")) onSearchTag("Cafe");
    else if (tag.includes("Meetups")) onSearchTag("Party");
  };

  return (
    <section className="relative bg-slate-50/30 py-16 md:py-24 border-b border-slate-100 overflow-visible">
      {/* Premium Red Dot Grid Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-5 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Main Title & Premium Copy */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight">
          Book Unique <span className="text-rose-600">Venues</span> for Unforgettable Events
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-500 font-medium max-w-2xl mt-4 leading-relaxed">
          Discover grand wedding halls, corporate seminar spaces, cozy birthday cafes, and luxury pool resorts. Filter by city, date, and guest count instantly.
        </p>

        {/* Redesigned Multi-Segment Search Box */}
        <SearchBar variant="hero" />

        {/* Popular Searches badges */}
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 uppercase tracking-wider">Trending:</span>
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant="interactive"
              className="text-xs px-3 py-1 rounded-full cursor-pointer select-none"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Hero Features / Statistics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-slate-100 w-full max-w-3xl text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Award className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-none">150+ Verified</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Handpicked spaces</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Zap className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-none">Instant Book</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Real-time lock-in</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-none">Zero Extra Fees</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Direct host pricing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Compass className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-none">4.9 Star Rating</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Happy organizers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
