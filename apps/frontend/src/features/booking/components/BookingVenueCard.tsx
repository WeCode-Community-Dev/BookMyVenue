/* eslint-disable */

import {
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
        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
                <div className="relative h-[210px] overflow-hidden rounded-lg">
                    <Image
                        src="/images/grand-palace-convention-centre.jpg"
                        alt="Grand Palace Convention Centre"
                        fill
                        sizes="(min-width: 1024px) 420px, 100vw"
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="flex min-w-0 flex-col justify-center py-2 pr-2">
                    <h2 className="text-2xl font-bold leading-tight text-slate-950">
            Grand Palace Convention Centre
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                            <Star className="size-4 fill-amber-400 text-amber-400" />
              4.8 (128 Reviews)
                        </span>

                        <span className="hidden h-5 w-px bg-slate-200 sm:block" />

                        <span className="inline-flex items-center gap-1.5 font-semibold text-teal-700">
                            <ShieldCheck className="size-4" />
              Verified Venue
                        </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-800">
                        <span className="inline-flex items-center gap-2">
                            <MapPin className="size-4 text-slate-600" />
              Kochi, Kerala
                        </span>

                        <span className="hidden h-5 w-px bg-slate-200 sm:block" />

                        <span className="inline-flex items-center gap-2">
                            <Building2 className="size-4 text-slate-600" />
              Banquet Hall
                        </span>

                        <span className="hidden h-5 w-px bg-slate-200 sm:block" />

                        <span className="inline-flex items-center gap-2">
                            <UsersRound className="size-4 text-slate-600" />
              50 - 1000 Guests
                        </span>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3">
                        {amenities.map(({ label, icon: Icon }) => {
                            return (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-800"
                                >
                                    <Icon className="size-4 text-slate-600" />
                                    {label}
                                </span>
                            ); 
                        })}

                        <span className="inline-flex items-center rounded-md px-2 py-1 text-sm font-semibold text-slate-900">
              +5 More
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
