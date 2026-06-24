"use client";

import { useState } from "react";
import { Search, Download, CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { fmt, BOOKINGS, BOOKING_STATUS_STYLE, BookingStatus } from "../data";

export function BookingsPage() {
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState<BookingStatus | "All">("All");

  const filteredBookings = BOOKINGS.filter((b) => {
    const ms = bookingFilter === "All" || b.status === bookingFilter;
    const mq =
      b.client.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.venue.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(bookingSearch.toLowerCase());
    return ms && mq;
  });

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search by client, venue, booking ID…"
            value={bookingSearch}
            onChange={e => setBookingSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Confirmed", "Pending", "Cancelled"] as const).map(s => (
            <button
              key={s}
              onClick={() => setBookingFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${bookingFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors shrink-0">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {["Booking ID", "Client", "Venue", "Owner", "Date", "Category", "Amount", "Status"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredBookings.map(b => (
              <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{b.id}</td>
                <td className="px-5 py-3.5 font-semibold text-foreground whitespace-nowrap">{b.client}</td>
                <td className="px-5 py-3.5 text-foreground/80 whitespace-nowrap">{b.venue}</td>
                <td className="px-5 py-3.5 text-foreground/70 whitespace-nowrap">{b.owner}</td>
                <td className="px-5 py-3.5 text-foreground/70 whitespace-nowrap">{b.date}</td>
                <td className="px-5 py-3.5 text-foreground/70">{b.category}</td>
                <td className="px-5 py-3.5 font-bold text-foreground whitespace-nowrap">{fmt(b.amount)}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${BOOKING_STATUS_STYLE[b.status]}`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBookings.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-25" />
            <p className="font-medium">No bookings match your filter.</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing {filteredBookings.length} of {BOOKINGS.length} bookings</span>
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
