"use client";

import React from "react";

export default function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-foreground">Advanced Analytics</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Detailed diagnostics on space booking velocities and occupancy stats.
        </p>
      </div>

      {/* occupancy rates */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-center space-y-2">
          <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider block">Average Occupancy</span>
          <strong className="text-3xl font-black text-foreground">72.4%</strong>
          <span className="text-[10px] text-emerald-600 font-bold block">+5% vs last month</span>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-center space-y-2">
          <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider block">Avg Booking Duration</span>
          <strong className="text-3xl font-black text-foreground">5.8 hrs</strong>
          <span className="text-[10px] text-muted-foreground block">typical hourly rental</span>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-center space-y-2">
          <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider block">Space Type Revenue</span>
          <strong className="text-3xl font-black text-foreground">Meetings</strong>
          <span className="text-[10px] text-muted-foreground block">highest earning category</span>
        </div>
      </div>

      {/* Styled CSS Pie Chart placeholder */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-foreground border-b border-border/60 pb-3">
          Revenue Share by Category
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-around py-4 gap-6">
          {/* Styled CSS pie donut circle */}
          <div className="relative h-32 w-32 rounded-full border-8 border-primary flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-indigo-400 rotate-45" />
            <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-rose-400 rotate-180" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-foreground">USD</span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold">Breakdown</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded bg-primary" />
              <span className="text-muted-foreground">Conference & Meetings: <strong className="text-foreground">55%</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded bg-indigo-400" />
              <span className="text-muted-foreground">Creative Studios: <strong className="text-foreground">25%</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded bg-rose-400" />
              <span className="text-muted-foreground">Rooftop Lounges: <strong className="text-foreground">20%</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
