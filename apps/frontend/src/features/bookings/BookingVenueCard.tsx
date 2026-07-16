/* eslint-disable */

import {
    BadgeCheck,
    Building2,
    Car,
    ChefHat,
    MapPin,
    ShieldCheck,
    Snowflake,
    Star,
    UsersRound,
    Wifi,
} from "lucide-react";

import Image from "next/image";

const amenities = [
    { label: "Parking", icon: Car },
    { label: "AC", icon: Snowflake },
    { label: "WiFi", icon: Wifi },
    { label: "Catering", icon: ChefHat },
    { label: "Stage", icon: Building2 },
    { label: "Security", icon: ShieldCheck },
];

export default function BookingVenueCard() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="flex items-start gap-6">

                {/* Image */}

                <div className="w-[430px] shrink-0 overflow-hidden rounded-xl">

                    <Image
                        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1400&auto=format&fit=crop"
                        alt="Grand Palace Convention Centre"
                        width={430}
                        height={210}
                        priority
                        className="h-[210px] w-[430px] rounded-xl object-cover"
                    />

                </div>

                {/* Right Content */}

                <div className="flex flex-1 flex-col">

                    {/* Venue Name */}

                    <h2 className="text-[20px] font-bold text-slate-900">
                        Grand Palace Convention Centre
                    </h2>

                    {/* Rating */}

                    <div className="mt-4 flex items-center gap-6">

                        <div className="flex items-center gap-2">

                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                            <span className="text-[15px] font-semibold">
                                4.8
                            </span>

                            <span className="text-[15px] text-slate-600">
                                (128 Reviews)
                            </span>

                        </div>

                        <div className="h-4 w-px bg-slate-300" />

                        <div className="flex items-center gap-2">

                            <BadgeCheck className="h-4 w-4 text-teal-600" />

                            <span className="text-[15px] font-medium text-teal-700">
                                Verified Venue
                            </span>

                        </div>

                    </div>

                    {/* Venue Details */}

                    <div className="mt-5 flex items-center gap-6">

                        <div className="flex items-center gap-2">

                            <MapPin className="h-4 w-4 text-slate-500" />

                            <span className="text-[15px]">
                                Kochi, Kerala
                            </span>

                        </div>

                        <div className="h-4 w-px bg-slate-300" />

                        <div className="flex items-center gap-2">

                            <Building2 className="h-4 w-4 text-slate-500" />

                            <span className="text-[15px]">
                                Banquet Hall
                            </span>

                        </div>

                        <div className="h-4 w-px bg-slate-300" />

                        <div className="flex items-center gap-2">

                            <UsersRound className="h-4 w-4 text-slate-500" />

                            <span className="text-[15px] font-medium">
                                50 - 1000 Guests
                            </span>

                        </div>

                    </div>

                    {/* Amenities */}

                    <div className="mt-6 rounded-xl border border-slate-200 px-4 py-3">

                        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">

                            {amenities.map(({ label, icon: Icon }) => (

                                <div
                                    key={label}
                                    className="flex items-center gap-2"
                                >
                                    <Icon className="h-4 w-4 text-slate-500" />

                                    <span className="text-[14px] font-medium text-slate-700">
                                        {label}
                                    </span>

                                </div>

                            ))}

                            <span className="text-[14px] font-semibold text-slate-700">
                                +5 More
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}