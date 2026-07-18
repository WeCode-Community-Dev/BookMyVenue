/* eslint-disable */

"use client";

import { useState } from "react";

import {
    Car,
    Snowflake,
    UtensilsCrossed,
    ChefHat,
    Theater,
    ShieldCheck,
    Wifi,
    Gift,
    Zap,
    ScrollText,
} from "lucide-react";

const amenities = [
    {
        label: "Parking",
        icon: Car,
    },
    {
        label: "AC",
        icon: Snowflake,
    },
    {
        label: "Catering Area",
        icon: UtensilsCrossed,
    },
    {
        label: "Kitchen Access",
        icon: ChefHat,
    },
    {
        label: "Stage",
        icon: Theater,
    },
    {
        label: "Generator Backup",
        icon: Zap,
    },
    {
        label: "Security",
        icon: ShieldCheck,
    },
    {
        label: "WiFi",
        icon: Wifi,
    },
];

export default function BookingExtras() {

    const [request, setRequest] = useState("");

    return (

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* What's Included */}

            <div className="border-b border-slate-200 p-5">

                <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-teal-50 p-2">

                        <Gift className="h-5 w-5 text-[#0F8C84]" />

                    </div>

                    <h2 className="text-lg font-bold text-slate-900">
                        What's Included
                    </h2>

                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">

                    {amenities.map(({ label, icon: Icon }) => (

                        <div
                            key={label}
                            className="flex items-center gap-2"
                        >

                            <div
                                className="
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#0F8C84]
                                "
                            >

                                <Icon
                                    className="h-3 w-3 text-[#0F8C84]"
                                />

                            </div>

                            <span
                                className="
                                    text-[14px]
                                    font-medium
                                    text-slate-700
                                "
                            >
                                {label}
                            </span>

                        </div>

                    ))}

                    <button
                        className="
                            rounded-full
                            bg-slate-100
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-slate-700
                        "
                    >
                        +3 More
                    </button>

                </div>

            </div>

            {/* Special Request */}

            <div className="p-5">

                <div className="mb-3 flex items-center gap-3">

                    <ScrollText className="h-5 w-5 text-slate-600" />

                    <h3 className="font-semibold text-slate-900">
                        Special Requests (Optional)
                    </h3>

                </div>

                <div className="relative">

                    <textarea
                        value={request}
                        onChange={(e) =>
                            setRequest(e.target.value)
                        }
                        maxLength={250}
                        rows={3}
                        placeholder="Any special arrangements or requests? Let the venue know..."
                        className="
                            w-full
                            resize-none
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            text-sm
                            outline-none
                            transition
                            focus:border-[#0F8C84]
                            focus:ring-2
                            focus:ring-[#0F8C84]/10
                        "
                    />

                    <span
                        className="
                            absolute
                            bottom-3
                            right-4
                            text-xs
                            text-slate-400
                        "
                    >
                        {request.length}/250
                    </span>

                </div>

            </div>

        </section>

    );

}