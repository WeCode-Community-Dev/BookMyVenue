/* eslint-disable */

import {
    BadgeCheck,
    CalendarDays,
} from "lucide-react";

import Image from "next/image";

const bookings = [
    {
        id: 1,
        day: "15",
        month: "JUL",
        title: "Morning Wedding Package",
        time: "09:00 AM - 01:00 PM",
        guests: "50-150 Guests",
        price: "₹18,000",
    },
    {
        id: 2,
        day: "16",
        month: "JUL",
        title: "Morning Wedding Package",
        time: "09:00 AM - 01:00 PM",
        guests: "50-150 Guests",
        price: "₹18,000",
    },
    {
        id: 3,
        day: "17",
        month: "JUL",
        title: "Evening Reception Package",
        time: "04:00 PM - 10:00 PM",
        guests: "150-400 Guests",
        price: "₹30,000",
    },
];

export default function BookingSummary() {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="p-5">

                {/* Heading */}

                <h2 className="text-[18px] font-bold text-slate-900">
                    Booking Summary
                </h2>

                {/* Venue */}

                <div className="mt-5 flex gap-3">

                    <div className="overflow-hidden rounded-lg border border-slate-200">

                        <Image
                            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1400&auto=format&fit=crop"
                            alt="Venue"
                            width={84}
                            height={62}
                            className="h-[62px] w-[84px] object-cover"
                        />

                    </div>

                    <div className="flex flex-1 flex-col justify-center">

                        <h3 className="text-[15px] font-semibold leading-5 text-slate-900">
                            Grand Palace Convention Centre
                        </h3>

                        <div className="mt-2 flex items-center gap-2">

                            <BadgeCheck className="h-4 w-4 text-teal-600" />

                            <span className="text-[14px] font-medium text-teal-700">
                                Verified Venue
                            </span>

                        </div>

                    </div>

                </div>

                {/* Divider */}

                <div className="my-5 border-t border-slate-200" />

                {/* Booking Heading */}

                <h3 className="text-[17px] font-semibold text-slate-900">
                    Your Booking (3)
                </h3>

                {/* Booking Items */}

                <div className="mt-4 space-y-4">

                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="flex items-start gap-3"
                        >

                            {/* Date */}

                            <div
                                className="
                                    flex
                                    h-[56px]
                                    w-[48px]
                                    shrink-0
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-[#EAF8F6]
                                "
                            >

                                <span className="text-[22px] font-bold leading-none text-[#0F8C84]">
                                    {booking.day}
                                </span>

                                <span className="mt-1 text-[10px] font-bold tracking-wide text-[#0F8C84]">
                                    {booking.month}
                                </span>

                            </div>

                            {/* Package */}

                            <div className="min-w-0 flex-1">

                                <h4 className="truncate text-[14px] font-semibold text-slate-900">
                                    {booking.title}
                                </h4>

                                <div className="mt-1 flex items-center gap-1 text-[12px] text-slate-500">

                                    <CalendarDays className="h-3 w-3" />

                                    <span>
                                        {booking.time}
                                    </span>

                                </div>

                                <p className="mt-1 text-[12px] text-slate-500">
                                    {booking.guests}
                                </p>

                            </div>

                            {/* Price */}

                            <div className="pl-2">

                                <span className="text-[18px] font-bold text-slate-900">
                                    {booking.price}
                                </span>

                            </div>

                        </div>
                    ))}

                </div>
                                {/* Divider */}

                <div className="my-5 border-t border-slate-200" />

                {/* Price Breakdown */}

                <h3 className="text-[17px] font-semibold text-slate-900">
                    Price Breakdown
                </h3>

                <div className="mt-4 space-y-3">

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-slate-600">
                            Morning Wedding Package (15 Jul)
                        </span>

                        <span className="text-[14px] font-semibold text-slate-900">
                            ₹18,000
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-slate-600">
                            Morning Wedding Package (16 Jul)
                        </span>

                        <span className="text-[14px] font-semibold text-slate-900">
                            ₹18,000
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-slate-600">
                            Evening Reception Package (17 Jul)
                        </span>

                        <span className="text-[14px] font-semibold text-slate-900">
                            ₹30,000
                        </span>
                    </div>

                </div>

                {/* Dashed Divider */}

                <div className="my-5 border-t border-dashed border-slate-300" />

                {/* Totals */}

                <div className="space-y-3">

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-slate-600">
                            Subtotal
                        </span>

                        <span className="text-[14px] font-semibold text-slate-900">
                            ₹66,000
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-slate-600">
                            Platform Fee
                        </span>

                        <span className="text-[14px] font-semibold text-emerald-600">
                            FREE
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[14px] text-slate-600">
                            Taxes
                        </span>

                        <span className="text-[14px] font-semibold text-slate-900">
                            Included
                        </span>
                    </div>

                </div>

                {/* Divider */}

                <div className="my-5 border-t border-slate-200" />

                {/* Grand Total */}

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-[15px] font-semibold text-slate-900">
                            Grand Total
                        </p>

                        <p className="mt-1 text-[13px] text-slate-500">
                            Including all taxes
                        </p>

                    </div>

                    <span className="text-[28px] font-bold text-[#0F8C84]">
                        ₹66,000
                    </span>

                </div>

                {/* Cancellation Policy */}

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

                    <p className="text-[14px] font-semibold text-amber-900">
                        Cancellation Policy
                    </p>

                    <p className="mt-2 text-[13px] leading-6 text-amber-800">
                        Free cancellation within 7 days of booking.
                    </p>

                </div>

                {/* Payment Button */}

                <button
                    type="button"
                    className="
                        mt-5
                        flex
                        h-12
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        bg-gradient-to-r
                        from-red-500
                        to-rose-500
                        text-[15px]
                        font-semibold
                        text-white
                        shadow-md
                        transition-all
                        duration-200
                        hover:scale-[1.01]
                        hover:shadow-lg
                    "
                >
                    Proceed to Secure Payment
                </button>

                {/* Footer */}

                <p className="mt-4 text-center text-[12px] text-slate-500">
                    Powered securely by
                    <span className="ml-1 font-semibold text-[#2563EB]">
                        Razorpay
                    </span>
                </p>

            </div>
        </section>
    );
}