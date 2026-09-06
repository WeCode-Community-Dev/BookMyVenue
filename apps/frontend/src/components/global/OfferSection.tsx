"use client";

import { useEffect, useState } from "react";

import { AppText } from "@/lib/language/LanguageHelper";
import { ArrowRight } from "lucide-react";

const offers = [
    {
        id: 1,
        badgeKey: "LIMITED_TIME",
        titleKey: "OFFER_WEDDING_TITLE",
        descriptionKey: "OFFER_WEDDING_DESC",
        discount: "25%",
        venuesCount: 120,
        bg: "from-teal-700 via-teal-600 to-cyan-500",
    },
    {
        id: 2,
        badgeKey: "POPULAR",
        titleKey: "OFFER_BIRTHDAY_TITLE",
        descriptionKey: "OFFER_BIRTHDAY_DESC",
        discount: "₹5K",
        venuesCount: 85,
        bg: "from-rose-600 via-pink-500 to-orange-400",
    },
    {
        id: 3,
        badgeKey: "CORPORATE",
        titleKey: "OFFER_CORPORATE_TITLE",
        descriptionKey: "OFFER_CORPORATE_DESC",
        discount: "15%",
        venuesCount: 60,
        bg: "from-slate-800 via-slate-700 to-slate-600",
    },
    {
        id: 4,
        badgeKey: "WEEKEND",
        titleKey: "OFFER_WEEKEND_TITLE",
        descriptionKey: "OFFER_WEEKEND_DESC",
        discount: "10%",
        venuesCount: 90,
        bg: "from-violet-700 via-purple-600 to-fuchsia-500",
    },
];

export default function OffersSection() {
    const [
        active, setActive
    ] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => {
                return (prev + 1) % offers.length; 
            });
        }, 5000);

        return () => {
            return clearInterval(interval); 
        };
    }, [
    ]);

    const offer = offers[ active ];

    return (
        <section className="mx-4 mt-4 rounded-lg border border-border bg-card p-3">

            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-foreground lg:text-base">
                        <AppText textName="EXCLUSIVE_OFFERS" textModule="LABEL" />
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                        <AppText textName="EXCLUSIVE_OFFERS_SUBTITLE" textModule="LABEL" />
                    </p>
                </div>

                <button className="hidden items-center gap-2 text-sm font-medium text-secondary-text-color transition hover:gap-3 md:flex">
                    <AppText textName="VIEW_ALL" textModule="BUTTON" />
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>

            {/* Offer Slider */}
            <div
                key={offer.id}
                className={`overflow-hidden rounded-xl bg-gradient-to-r ${offer.bg} px-5 py-3 lg:px-6 lg:py-4 transition-all duration-500`}
            >
                <div className="flex flex-col gap-3">

                    {/* Badge */}
                    <div>
                        <span className="inline-flex rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
                            <AppText textName={offer.badgeKey} textModule="LABEL" />
                        </span>
                    </div>

                    {/* Title + Discount */}
                    <div className="flex items-center justify-between gap-4">

                        <div className="min-w-0 flex-1">
                            <h3 className="truncate text-lg font-bold text-white lg:text-2xl">
                                <AppText textName={offer.titleKey} textModule="LABEL" />
                            </h3>

                            <p className="mt-1 text-xs text-white/90 lg:text-sm">
                                <AppText textName={offer.descriptionKey} textModule="LABEL" />
                            </p>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-3xl font-bold leading-none text-white lg:text-5xl">
                                {offer.discount}
                            </p>

                            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/80">
                                <AppText textName="OFF" textModule="LABEL" />
                            </p>
                        </div>

                    </div>

                    {/* Bottom Row */}
                    <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-white">
                            <AppText textName="VENUES_COUNT" textModule="LABEL" append={{ count: offer.venuesCount }} />
                        </span>

                        <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-white">
                            <AppText textName="ENDS_SOON" textModule="LABEL" />
                        </span>

                        <button className="ml-auto flex items-center gap-1 text-xs font-semibold text-white transition hover:gap-2">
                            <AppText textName="EXPLORE" textModule="BUTTON" />
                            <ArrowRight className="h-3.5 w-3.5" />
                        </button>

                    </div>

                </div>
            </div>

            {/* Indicators */}
            <div className="mt-3 flex justify-center gap-1.5">

                {offers.map((_, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => {
                                return setActive(index); 
                            }}
                            className={`rounded-full transition-all duration-300 ${
                                active === index
                                    ? "h-1.5 w-6 bg-teal-700"
                                    : "h-1.5 w-1.5 bg-border"
                            }`}
                        />
                    ); 
                })}

            </div>

        </section>
    );
}
