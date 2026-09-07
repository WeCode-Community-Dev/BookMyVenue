"use client";

import {
    Building2,
    ChevronRight,
    Coffee,
    Landmark,
    Palmtree,
    Trees,
} from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";

const categories = [
    {
        id: 1,
        titleKey: "RESORTS",
        subtitleKey: "SUBTITLE_RESORTS",
        icon: Palmtree,
        color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400",
    },
    {
        id: 2,
        titleKey: "BANQUET_HALLS",
        subtitleKey: "SUBTITLE_BANQUETS",
        icon: Landmark,
        color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    },
    {
        id: 3,
        titleKey: "AUDITORIUMS",
        subtitleKey: "SUBTITLE_AUDITORIUMS",
        icon: Building2,
        color: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400",
    },
    {
        id: 4,
        titleKey: "CAFES_RESTAURANTS",
        subtitleKey: "SUBTITLE_CAFES",
        icon: Coffee,
        color: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
    },
    {
        id: 5,
        titleKey: "OPEN_LAWNS",
        subtitleKey: "SUBTITLE_LAWNS",
        icon: Trees,
        color: "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    },
];

export default function VenueTypeSection() {
    return (
        <section className="mx-4 mt-4 rounded-lg border border-border bg-card p-3">

            {/* Header */}
            <div className="mb-3 flex items-center justify-between gap-4">

                <div>
                    <h2 className="text-sm font-semibold text-foreground lg:text-base">
                        <AppText textName="EXPLORE_BY_VENUE_TYPE" textModule="LABEL" />
                    </h2>

                    <p className="mt-1 text-xs text-muted-foreground">
                        <AppText textName="DISCOVER_VENUES_SUBTITLE" textModule="LABEL" />
                    </p>
                </div>

                <button className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-transparent transition hover:bg-muted md:flex">
                    <ChevronRight className="h-4 w-4 text-foreground" />
                </button>

            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                {categories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <button
                            key={category.id}
                            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all duration-200 hover:border-secondary-text-color/20 hover:bg-secondary-text-color/10 hover:shadow-md"
                        >
                            {/* Icon */}
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${category.color}`}
                            >
                                <Icon className="h-4 w-4" />
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1">

                                <h3 className="truncate text-xs font-semibold text-foreground lg:text-sm">
                                    <AppText textName={category.titleKey} textModule="LABEL" />
                                </h3>

                                <p className="mt-0.5 truncate text-[10px] text-muted-foreground lg:text-xs">
                                    <AppText textName={category.subtitleKey} textModule="LABEL" />
                                </p>

                            </div>

                        </button>
                    );
                })}

            </div>

        </section>
    );
}
