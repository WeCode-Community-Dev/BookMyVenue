"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

export default function BookingsTab() {
  const { updateBookingStatus } = useApp();

  // Filter Bookings Tab state
  const [bookingFilter, setBookingFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  // Handle pending bookings actions
  const handleBookingAction = (bookingId: string, action: "confirmed" | "cancelled", guestName: string) => {
    updateBookingStatus(bookingId, action);
    if (action === "confirmed") {
      toast.success(`Reservation request from ${guestName} has been approved.`);
    } else {
      toast.error(`Reservation request from ${guestName} has been declined.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground">Reservations Ledger</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Filter, search, and approve venue scheduling payouts.
          </p>
        </div>

        {/* Filter pill tabs */}
        <div className="flex items-center space-x-1.5 bg-secondary p-1 rounded-xl border border-border text-xs font-semibold">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((fil) => (
            <button
              key={fil}
              onClick={() => setBookingFilter(fil)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${bookingFilter === fil ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {fil}
            </button>
          ))}
        </div>
      </div>

      {/* Table Ledger */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border/60 text-xs">
            <thead className="bg-muted/30 dark:bg-muted/10">
              <tr>
                <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Client Details</th>
                <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right font-bold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}
