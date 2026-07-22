"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Star, Share2, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import * as bookingService from "@/services/booking.service";
import * as paymentService from "@/services/payment.service";
import * as venueService from "@/services/venue.service";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

interface BookingCardProps {
  venueId: string;
  venueName: string;
  startingPrice: number;
  rating: number;
  reviewCount: number;
  bookingApprovalRequired?: boolean;
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function getTodayDateKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const maybeAxios = error as {
      response?: { data?: { message?: string | string[] } };
      message?: string;
    };
    const apiMessage = maybeAxios.response?.data?.message;
    if (Array.isArray(apiMessage)) {
      return apiMessage.join(", ");
    }
    if (typeof apiMessage === "string") {
      return apiMessage;
    }
    if (typeof maybeAxios.message === "string") {
      return maybeAxios.message;
    }
  }

  return "Something went wrong.";
}

export default function BookingCard({ venueId, venueName, startingPrice, rating, reviewCount, bookingApprovalRequired = false }: BookingCardProps) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [guests, setGuests] = useState("100");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const availability = await venueService.getVenueAvailability(venueId);
        if (!cancelled) {
          setUnavailableDates(availability.unavailableDates || []);
        }
      } catch (error) {
        console.error("Failed to load venue availability:", error);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [venueId]);

  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);
  const minDate = useMemo(getTodayDateKey, []);

  useEffect(() => {
    if (date) return;
    const start = new Date(`${minDate}T00:00:00`);
    for (let index = 0; index < 180; index += 1) {
      const next = new Date(start);
      next.setDate(start.getDate() + index);
      const key = next.toISOString().split("T")[0];
      if (!unavailableSet.has(key)) {
        setDate(key);
        return;
      }
    }
    setDate(minDate);
  }, [date, minDate, unavailableSet]);

  const formatPrice = (price: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const startPaymentFlow = async (bookingId: string) => {
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      throw new Error("NEXT_PUBLIC_RAZORPAY_KEY_ID is missing in the frontend environment.");
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      throw new Error("Razorpay checkout failed to load. Please try again.");
    }

    const order = await paymentService.createPaymentOrder({ bookingId });

    await new Promise<void>((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "BookMyVenue",
        description: `Payment for ${venueName}`,
        order_id: order.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        notes: {
          bookingId: order.bookingId,
          venueName,
        },
        handler: async (response: unknown) => {
          try {
            const paymentResponse = response as RazorpaySuccessResponse;
            const verification = await paymentService.verifyPayment({
              bookingId: order.bookingId,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });
            alert(verification.message);
            router.push("/profile?tab=bookings");
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment was cancelled before completion."));
          },
        },
        theme: {
          color: "#e11d48",
        },
      });

      razorpay.on("payment.failed", () => {
        reject(new Error("Payment failed. Please try again."));
      });

      razorpay.open();
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (unavailableSet.has(date)) {
      alert("This venue is unavailable on the selected date. Please choose another date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const start = new Date(`${date}T10:00:00`);
      const end = new Date(`${date}T18:00:00`);
      const result = await bookingService.createBooking({
        venueId,
        eventStart: start.toISOString(),
        eventEnd: end.toISOString(),
        eventName: `${venueName} Booking`,
        guestCount: Number(guests),
      });

      if (result.bookingStatus === "PENDING_OWNER_APPROVAL") {
        const expiryText = result.paymentExpiresAt ? ` Payment window closes at ${new Date(result.paymentExpiresAt).toLocaleString("en-IN")}.` : "";
        alert(`${result.message}${expiryText}`);
        router.push("/profile?tab=bookings");
        return;
      }

      await startPaymentFlow(result.bookingId);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (message.toLowerCase().includes("not allowed to make payment")) {
        alert("Payment API is connected in the frontend, but the backend is rejecting the authenticated user for payment. The booking was created, but payment could not continue.");
      } else {
        alert(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-xl rounded-3xl p-6 space-y-5 sticky top-24 select-none hover:shadow-2xl transition-all duration-300">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{formatPrice(startingPrice)}</span>
          <span className="text-xs font-semibold text-slate-500 block mt-0.5">starting from per event day</span>
        </div>
        <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-800">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span>{rating.toFixed(1)}</span>
          <span className="text-slate-400">({reviewCount})</span>
        </div>
      </div>

      {bookingApprovalRequired && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
          This venue requires owner approval before payment. Your booking will be reviewed first.
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-4">
        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-250/70">
          <div className="p-3.5 space-y-1 relative">
            <label htmlFor="booking-date" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Event Date</label>
            <div className="flex items-center justify-between gap-2">
              <input id="booking-date" type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-sm font-extrabold text-slate-800 outline-none w-full cursor-pointer" required />
              <Calendar className="size-4 text-slate-450 shrink-0" />
            </div>
          </div>
          <div className="p-3.5 space-y-1">
            <label htmlFor="booking-guests" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Guests</label>
            <select id="booking-guests" value={guests} onChange={(e) => setGuests(e.target.value)} className="bg-transparent text-sm font-extrabold text-slate-800 outline-none w-full cursor-pointer">
              <option value="50">Up to 50 guests</option>
              <option value="100">50 - 150 guests</option>
              <option value="250">150 - 300 guests</option>
              <option value="500">300 - 500 guests</option>
              <option value="1000">More than 500 guests</option>
            </select>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-11 rounded-2xl cursor-pointer shadow-md active:translate-y-px transition-all border-none text-sm tracking-wide disabled:opacity-50">
          {isSubmitting ? "Processing..." : bookingApprovalRequired ? "Request Booking" : "Book & Pay Now"}
        </Button>
      </form>

      <p className="text-center text-[11px] font-semibold text-slate-400 mt-2 select-none">
        Availability is loaded from the backend before booking is submitted.
      </p>

      <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 select-none">
        <button type="button" onClick={() => alert("Wishlist persistence is not backed by an API yet.")} className="flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white text-xs font-bold text-slate-600 hover:text-slate-800 transition cursor-pointer">
          <Heart className="size-3.5 text-slate-500 hover:fill-rose-500 hover:text-rose-500" />
          <span>Save Venue</span>
        </button>
        <button type="button" onClick={() => alert(`Share option triggered. Copy link: ${window.location.href}`)} className="flex items-center justify-center gap-2 h-9 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white text-xs font-bold text-slate-600 hover:text-slate-800 transition cursor-pointer">
          <Share2 className="size-3.5 text-slate-500" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
