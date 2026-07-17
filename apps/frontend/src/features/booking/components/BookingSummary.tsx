/* eslint-disable */

import {
    BadgeCheck,
    CalendarDays,
    Lock,
    Shield,
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
        price: 18000,
    },
    {
        id: 2,
        day: "16",
        month: "JUL",
        title: "Morning Wedding Package",
        time: "09:00 AM - 01:00 PM",
        guests: "50-150 Guests",
        price: 18000,
    },
    {
        id: 3,
        day: "17",
        month: "JUL",
        title: "Evening Reception Package",
        time: "04:00 PM - 10:00 PM",
        guests: "150-400 Guests",
        price: 30000,
    },
];

export default function BookingSummary() {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">

                <h2 className="text-[32px] font-bold text-slate-900">
                    Booking Summary
                </h2>

                {/* Venue */}

                <div className="mt-6 flex gap-4">
                    <div className="relative h-16 w-20 overflow-hidden rounded-lg">
                        <Image
                            src="/images/grand-palace-convention-centre.jpg"
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-[15px] font-semibold leading-5 text-slate-900">
                            Grand Palace Convention Centre
                        </h3>

                        <div className="mt-2 flex items-center gap-1 text-sm font-medium text-teal-700">
                            <BadgeCheck className="h-4 w-4" />
                            Verified Venue
                        </div>
                    </div>
                </div>

                <hr className="my-5 border-slate-200" />

                {/* Booking */}

                <h3 className="text-lg font-bold text-slate-900">
                    Your Booking (3)
                </h3>

                <div className="mt-4 space-y-4">

                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="flex items-start gap-3"
                        >
                            <div
                                className="
                                flex h-16 w-14 flex-col items-center justify-center
                                rounded-lg bg-teal-50
                                "
                            >
                                <span className="text-2xl font-bold text-teal-700">
                                    {booking.day}
                                </span>

                                <span className="text-[11px] font-semibold tracking-wider text-teal-700">
                                    {booking.month}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-[15px] font-semibold text-slate-900">
                                    {booking.title}
                                </h4>

                                <p className="mt-1 text-[13px] text-slate-500">
                                    {booking.time}
                                </p>

                                <p className="text-[13px] text-slate-500">
                                    {booking.guests}
                                </p>
                            </div>

                            <span className="text-lg font-bold text-slate-900">
                                ₹{booking.price.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>

                <hr className="my-5 border-slate-200" />

                {/* Price */}

                <h3 className="text-lg font-bold text-slate-900">
                    Price Breakdown
                </h3>

                <div className="mt-4 space-y-3 text-[15px]">

                    <div className="flex justify-between">
                        <span className="text-slate-600">
                            Morning Wedding Package (15 Jul)
                        </span>

                        <span className="font-semibold">
                            ₹18,000
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-600">
                            Morning Wedding Package (16 Jul)
                        </span>

                        <span className="font-semibold">
                            ₹18,000
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-600">
                            Evening Reception Package (17 Jul)
                        </span>

                        <span className="font-semibold">
                            ₹30,000
                        </span>
                    </div>
                </div>

                <div className="my-5 border-t border-dashed border-slate-300" />

                <div className="space-y-3 text-[15px]">

                    <div className="flex justify-between">
                        <span className="text-slate-600">
                            Subtotal
                        </span>

                        <span className="font-semibold">
                            ₹66,000
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-600">
                            Platform Fee
                        </span>

                        <span className="font-semibold text-green-600">
                            FREE
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-600">
                            Taxes
                        </span>

                        <span className="font-semibold">
                            Included
                        </span>
                    </div>
                </div>

                <hr className="my-5 border-slate-200" />

                <div className="flex items-center justify-between">

                    <span className="text-2xl font-bold">
                        Grand Total
                    </span>

                    <span className="text-[34px] font-extrabold text-teal-700">
                        ₹66,000
                    </span>
                </div>

                {/* Policy */}

                <div
                    className="
                    mt-5 rounded-xl
                    border border-amber-200
                    bg-amber-50
                    p-4
                    "
                >
                    <div className="flex gap-3">
                        <Shield className="mt-1 h-5 w-5 text-amber-500" />

                        <div>
                            <p className="font-semibold text-slate-900">
                                Cancellation Policy
                            </p>

                            <p className="text-sm text-slate-500">
                                Free cancellation within 7 days of booking
                            </p>
                        </div>
                    </div>
                </div>

                {/* Button */}

                <button
                    className="
                    mt-5 flex h-14 w-full items-center justify-center
                    gap-2 rounded-xl
                    bg-gradient-to-r
                    from-red-500
                    to-red-400
                    text-lg
                    font-semibold
                    text-white
                    transition
                    hover:opacity-95
                    "
                >
                    <Lock className="h-5 w-5" />
                    Proceed to Secure Payment
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                    Powered securely by

                    <Image
                        src="/images/razorpay-logo.png"
                        alt=""
                        width={95}
                        height={24}
                    />
                </div>

            </div>
        </section>
    );
}