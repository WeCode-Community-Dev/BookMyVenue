"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, Percent } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Analytics</h1>
          <p className="mt-1.5 text-body-md text-text-muted">Analyze your performance and conversion rates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-label-sm text-text-muted">Net Earnings</span>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">$38,200</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-label-sm text-text-muted">Total Visitors</span>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">8,429</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <span className="text-label-sm text-text-muted">Conversion Rate</span>
            <h3 className="text-2xl font-bold text-on-surface mt-0.5">3.2%</h3>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-4">
        <h2 className="text-2xl font-bold text-on-surface">Monthly Views Breakdown</h2>
        <div className="h-64 flex items-end gap-3.5 pt-6 border-b border-border-subtle">
          {[40, 55, 45, 70, 85, 95, 65, 80, 75, 90, 85, 100].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <div
                className="w-full bg-primary-fixed hover:bg-primary-container rounded-t-lg transition-all duration-300"
                style={{ height: `${height}%` }}
              />
              <span className="text-[10px] font-bold text-text-muted select-none">
                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
