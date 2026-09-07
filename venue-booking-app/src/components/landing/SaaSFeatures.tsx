"use client";

import React from "react";
import { Zap, ShieldCheck, Clock, CalendarCheck, BarChart3, Layers } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Real-Time Slot Locking",
    description: "Select custom start and end times with zero latency. Prevent double-booking conflicts across all listings automatically."
  },
  {
    icon: ShieldCheck,
    title: "Admin & Host Approval Workflow",
    description: "Every listed space is vetted and approved by platform administrators to ensure accurate capacity, photos, and amenities."
  },
  {
    icon: Clock,
    title: "Automated Exception Rules",
    description: "Dynamic holiday closures, maintenance blocks, and custom hourly price surcharges update instantly across the entire platform."
  },
  {
    icon: CalendarCheck,
    title: "Flexible Hourly & Daily Billing",
    description: "Rent for 2-hour micro-sessions or secure full-day access with transparent rate breakdowns and no hidden platform surcharges."
  },
  {
    icon: BarChart3,
    title: "Unified Host Dashboard",
    description: "Venue owners get complete analytics over earnings, upcoming guest requests, custom availability rules, and booking status controls."
  },
  {
    icon: Layers,
    title: "Role-Based Access Control",
    description: "Seamless distinction between Customers, Venue Owners, and System Admins with instant role-switching capabilities."
  }
];

export default function SaaSFeatures() {
  return (
    <section className="py-20 bg-background border-b border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            Platform Infrastructure
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-4">
            Engineered for Modern Event Operations
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            From single meeting room reservations to enterprise-wide venue management, BookMyVenue provides an end-to-end booking stack.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-primary border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
