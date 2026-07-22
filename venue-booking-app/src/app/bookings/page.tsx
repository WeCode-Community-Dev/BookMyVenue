"use client";

import React, { useState } from "react";
import { useApp, Booking } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar, Clock, Receipt, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format, isAfter, isBefore, parseISO } from "date-fns";

const statusStyles: Record<Booking["status"], string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900",
  cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900",
};

export default function Bookings() {
  const { bookings, cancelBooking, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all");
  
  // Invoice Details Modal state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const handleCancel = async (bookingId: string, venueId: string, venueName: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/venue/${venueId}/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel reservation on API");
      }

      cancelBooking(bookingId);
      toast.success(`Reservation at ${venueName} has been cancelled.`);
    } catch (error) {
      console.warn("Backend booking cancel endpoint failed, cancelling locally.", error);
      cancelBooking(bookingId);
      toast.success(`Reservation at ${venueName} has been cancelled (saved locally).`);
    }
  };

  const openInvoice = (booking: Booking) => {
    setSelectedBooking(booking);
    setInvoiceOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-12 bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Filter logic
  const now = new Date();
  const filteredBookings = bookings.filter((b) => {
    // If cancelled, keep it in "all" or "past" depending on date
    const bookingDate = parseISO(b.date);
    if (activeTab === "upcoming") {
      return (b.status === "confirmed" || b.status === "pending") && isAfter(bookingDate, now);
    }
    if (activeTab === "past") {
      return b.status === "cancelled" || isBefore(bookingDate, now);
    }
    return true; // "all"
  });

  return (
    <div className="flex-grow bg-background py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Reservations
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor booking approvals, manage upcoming reservations, and view billing details.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border mb-6">
          {(["all", "upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold border-b-2 capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab} Bookings
            </button>
          ))}
        </div>

        {/* Bookings List Layout */}
        {filteredBookings.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-2xl shadow-sm">
            <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="font-extrabold text-xl text-foreground">No reservations found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              {activeTab === "upcoming"
                ? "You don't have any active upcoming reservations at the moment."
                : activeTab === "past"
                ? "You don't have any past reservations listed."
                : "You haven't requested any venue reservations yet."}
            </p>
            {activeTab !== "past" && (
              <Link
                href="/venues"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 py-2.5 text-sm transition-all"
              >
                Browse Spaces
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const bookingDateFormatted = format(parseISO(booking.date), "PP");
              return (
                <div
                  key={booking.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row hover:shadow-md transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-[220px] h-[150px] shrink-0 bg-muted">
                    <img
                      src={booking.venueImage}
                      alt={booking.venueName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details block */}
                  <div className="flex-grow p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-xxs font-bold text-muted-foreground uppercase tracking-wide">
                          ID: {booking.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xxs font-bold border uppercase tracking-wider ${
                            statusStyles[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      
                      <h3 className="font-extrabold text-lg text-foreground line-clamp-1">
                        {booking.venueName}
                      </h3>

                      {/* Date details indicators */}
                      <div className="grid grid-cols-2 gap-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-primary mr-1.5 shrink-0" />
                          <span>{bookingDateFormatted}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-primary mr-1.5 shrink-0" />
                          <span>
                            {booking.startTime} - {booking.endTime} ({booking.totalHours} hrs)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/60 mt-4 gap-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Amount: </span>
                        <strong className="text-foreground font-extrabold">${booking.totalCost}</strong>
                      </div>

                      <div className="flex items-center space-x-2.5">
                        <Button
                          onClick={() => openInvoice(booking)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl flex items-center"
                        >
                          <Receipt className="h-4 w-4 mr-1.5" />
                          Receipt
                        </Button>
                        
                        {(booking.status === "pending" || booking.status === "confirmed") && (
                          <Button
                            onClick={() => handleCancel(booking.id, booking.venueId, booking.venueName)}
                            variant="destructive"
                            size="sm"
                            className="rounded-xl"
                          >
                            Cancel Reservation
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invoice Details Dialog Modal */}
      {selectedBooking && (
        <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
          <DialogContent className="max-w-md rounded-2xl bg-card border border-border p-6">
            <DialogHeader className="pb-4 border-b border-border">
              <DialogTitle className="text-lg font-extrabold text-foreground flex items-center justify-between">
                <span>Receipt Invoice</span>
                <span className="text-xs text-muted-foreground">ID: {selectedBooking.id}</span>
              </DialogTitle>
              <DialogDescription className="text-xxs text-muted-foreground">
                Payment processed via VenueFlow reservation agent.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-xs">
              {/* Status Header */}
              <div className="flex justify-between items-center bg-secondary p-3 rounded-xl">
                <span className="font-semibold text-muted-foreground">Reservation Status:</span>
                <span className={`px-2 py-0.5 rounded-lg font-bold border text-xxs uppercase ${statusStyles[selectedBooking.status]}`}>
                  {selectedBooking.status}
                </span>
              </div>

              {/* Guest details info */}
              <div className="space-y-1">
                <h5 className="font-bold text-foreground mb-1 uppercase tracking-wider text-xxs text-muted-foreground">Billing Details</h5>
                <div className="flex justify-between text-muted-foreground">
                  <span>Client Name:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.guestName}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Client Email:</span>
                  <span className="font-semibold text-foreground">{selectedBooking.guestEmail}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Issued Date:</span>
                  <span className="font-semibold text-foreground">{format(parseISO(selectedBooking.createdAt), "PPpp")}</span>
                </div>
              </div>

              {/* Space details details */}
              <div className="space-y-1 pt-2 border-t border-border">
                <h5 className="font-bold text-foreground mb-1 uppercase tracking-wider text-xxs text-muted-foreground">Space Reservation</h5>
                <div className="flex justify-between text-muted-foreground font-semibold">
                  <span>Venue:</span>
                  <span className="text-foreground">{selectedBooking.venueName}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Reserved Date:</span>
                  <span className="text-foreground">{format(parseISO(selectedBooking.date), "PP")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Booked Hours:</span>
                  <span className="text-foreground">
                    {selectedBooking.startTime} - {selectedBooking.endTime} ({selectedBooking.totalHours} hours)
                  </span>
                </div>
              </div>

              {/* Financial charges recap */}
              <div className="space-y-1.5 pt-3 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Base Booking Rate:</span>
                  <span>${selectedBooking.totalCost - Math.round(selectedBooking.totalCost * 0.13)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Fees & Cleaning (incl. tax):</span>
                  <span>${Math.round(selectedBooking.totalCost * 0.13)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground border-t border-border/80 pt-2 mt-2">
                  <span>Total Charges</span>
                  <span>${selectedBooking.totalCost}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setInvoiceOpen(false)} className="rounded-xl font-semibold bg-primary text-primary-foreground px-5">
                Close Receipt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
