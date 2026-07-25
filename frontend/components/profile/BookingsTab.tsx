"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, MapPin, X, Info } from "lucide-react";
import { useAuth, Booking } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function BookingsTab() {
  const { bookings, cancelBooking } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const upcomingBookings = bookings.filter((b) => b.status === "Confirmed");
  const completedBookings = bookings.filter((b) => b.status === "Completed");
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled");

  const openCancelModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedBooking) {
      cancelBooking(selectedBooking.id);
      setIsCancelConfirmOpen(false);
      setSelectedBooking(null);
    }
  };

  const renderBookingCard = (booking: Booking, isCancelled = false) => {
    const formattedPrice = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(booking.price);

    return (
      <div
        key={booking.id}
        className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 transition-all duration-200 ${
          isCancelled
            ? "border-slate-150/60 bg-slate-50/30 opacity-70"
            : "border-slate-200/70 shadow-xs hover:border-slate-300"
        }`}
      >
        {/* Thumbnail Photo */}
        <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
          <Image
            src={booking.venueImage}
            alt={booking.venueName}
            fill
            className="object-cover"
          />
        </div>

        {/* Text Details */}
        <div className="flex-grow flex flex-col justify-between space-y-3 sm:space-y-0 text-left">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                ID: {booking.id}
              </span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider select-none leading-none ${
                  booking.status === "Confirmed"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                    : booking.status === "Completed"
                    ? "bg-blue-50 text-blue-700 border border-blue-100/50"
                    : "bg-red-50 text-red-700 border border-red-100/50"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <Link
              href={`/venue/${booking.venueId}`}
              className="text-base sm:text-lg font-black text-slate-900 hover:text-rose-600 transition leading-tight block"
            >
              {booking.venueName}
            </Link>

            <div className="flex items-center gap-1.5 text-xs text-slate-450 font-bold leading-none">
              <MapPin className="size-3.5 text-slate-400" />
              <span>{booking.city}, India</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 font-bold pt-2 border-t border-slate-100/50">
            <div className="flex items-center gap-1">
              <Calendar className="size-3.5 text-slate-400" />
              <span>
                {booking.date} ({booking.timeSlot.split(" ")[0]} onwards)
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="size-3.5 text-slate-400" />
              <span>{booking.guests} guests</span>
            </div>
          </div>
        </div>

        {/* Price & Cancellation Actions */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-between sm:border-l border-slate-100 sm:pl-5 sm:min-w-[130px] shrink-0 text-right mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none mb-1">
              Amount Paid
            </span>
            <span className="text-lg font-black text-slate-900 leading-none">{formattedPrice}</span>
          </div>

          {booking.status === "Confirmed" && (
            <Button
              type="button"
              onClick={() => openCancelModal(booking)}
              className="bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200/50 hover:border-red-200 text-xs font-extrabold h-8 rounded-lg px-3.5 cursor-pointer transition active:scale-98"
            >
              Cancel Booking
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Upcoming Bookings Section */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-left">
          Upcoming Events
        </h2>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((b) => renderBookingCard(b))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-150/50 rounded-2xl p-6 text-center text-slate-450 font-semibold text-sm">
            No upcoming bookings found. Book your next space from the home page!
          </div>
        )}
      </div>

      {/* Completed Bookings Section */}
      {completedBookings.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200/40">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight text-left">
            Past Events
          </h2>
          <div className="space-y-4">
            {completedBookings.map((b) => renderBookingCard(b))}
          </div>
        </div>
      )}

      {/* Cancelled Bookings Section */}
      {cancelledBookings.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200/40">
          <h2 className="text-xl sm:text-2xl font-black text-slate-400 tracking-tight text-left">
            Cancelled Bookings
          </h2>
          <div className="space-y-4">
            {cancelledBookings.map((b) => renderBookingCard(b, true))}
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal overlay */}
      {isCancelConfirmOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200/85 rounded-3xl w-full max-w-md shadow-2xl p-6 text-center space-y-6 animate-in scale-in-95 duration-200">
            <div className="mx-auto size-12 rounded-full bg-red-50 flex items-center justify-center">
              <Info className="size-6 text-red-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Cancel Booking?</h3>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                Are you sure you want to cancel your booking for <span className="font-extrabold text-slate-800">&quot;{selectedBooking.venueName}&quot;</span> on {selectedBooking.date}? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCancelConfirmOpen(false)}
                className="w-full border-slate-200 hover:bg-slate-100 hover:text-slate-800 text-slate-500 font-bold h-10 px-5 rounded-xl cursor-pointer"
              >
                No, Keep Booking
              </Button>
              <Button
                type="button"
                onClick={handleConfirmCancel}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold h-10 px-5 rounded-xl cursor-pointer border-none"
              >
                Yes, Cancel Event
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
