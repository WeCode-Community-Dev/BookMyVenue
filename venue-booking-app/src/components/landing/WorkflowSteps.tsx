"use client";

import React from "react";
import { Search, Calendar, UserCheck, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Discover Spaces",
    desc: "Search by city, capacity, and space type with instant filters."
  },
  {
    step: "02",
    icon: Calendar,
    title: "Inspect Slots",
    desc: "Check live date availability, exceptions, and hourly rates."
  },
  {
    step: "03",
    icon: UserCheck,
    title: "Instant Sign-In",
    desc: "Authenticate with 1-click customer login or Google account."
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Confirmed Reserve",
    desc: "Receive booking confirmation & manage reservations in your dashboard."
  }
];

export default function WorkflowSteps() {
  return (
    <section className="py-20 bg-muted/20 dark:bg-muted/5 border-b border-border/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            Simple & Transparent
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-4">
            How BookMyVenue Works
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            From search to confirmation in less than two minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-2xl font-black text-muted-foreground/30 font-mono">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
