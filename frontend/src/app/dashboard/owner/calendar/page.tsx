"use client";

import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border-subtle pb-5">
        <div>
          <h1 className="text-4xl font-bold text-on-surface">Calendar</h1>
          <p className="mt-1.5 text-body-md text-text-muted">Schedule and manage upcoming events.</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-[#582200] px-5 py-2.5 text-label-md font-bold text-white shadow-md hover:bg-[#3c2d26] transition-all">
          <Plus className="h-4.5 w-4.5" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-on-surface">May 2026</h2>
          <div className="flex items-center gap-1">
            <button className="rounded-full p-2 border border-border-subtle hover:bg-stone-50 transition-colors">
              <ChevronLeft className="h-5 w-5 text-on-surface" />
            </button>
            <button className="rounded-full p-2 border border-border-subtle hover:bg-stone-50 transition-colors">
              <ChevronRight className="h-5 w-5 text-on-surface" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span key={day} className="text-label-sm font-bold text-text-muted uppercase tracking-wider py-2">
              {day}
            </span>
          ))}

          {Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1;
            const hasEvent = dayNum === 24 || dayNum === 2 || dayNum === 15;
            return (
              <div
                key={dayNum}
                className={`relative min-h-[90px] rounded-xl border border-border-subtle/50 p-2 text-left transition-all ${
                  hasEvent ? "bg-primary-fixed/20 border-primary-container/20" : "bg-stone-50/30 hover:bg-stone-50"
                }`}
              >
                <span className={`text-label-md font-semibold ${hasEvent ? "text-primary-container" : "text-on-surface"}`}>
                  {dayNum}
                </span>
                {hasEvent && (
                  <div className="mt-2 rounded bg-primary-container/90 px-1.5 py-0.5 text-[10px] font-bold text-white truncate shadow-sm">
                    {dayNum === 24 ? "Wedding" : dayNum === 2 ? "Retreat" : "Birthday"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
