"use client";

import {
    Building2,
    CalendarDays,
    ChevronDown,
    IndianRupee,
    LayoutGrid,
    List,
    MapPin,
    SlidersHorizontal,
    Star,
    Users,
} from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";

export default function VenueFiltersBar() {
    const filters = [
        {
            textName: "PRICE",
            icon: IndianRupee,
        },
        {
            textName: "CAPACITY",
            icon: Users,
        },
        {
            textName: "AMENITIES",
            icon: Building2,
        },
        {
            textName: "AVAILABILITY",
            icon: CalendarDays,
        },
        {
            textName: "DISTANCE",
            icon: MapPin,
        },
        {
            textName: "RATING_4_PLUS",
            icon: Star,
        },
    ];

    return (
        <section className="mx-4 mt-4 rounded-lg border border-border bg-card p-3 lg:p-4">

            <div className="flex flex-col gap-3">

                {/* Mobile */}
                <div className="flex items-center justify-between md:hidden">

                    <button className="flex h-10 items-center gap-2 rounded-lg border border-secondary-text-color/20 bg-secondary-text-color/10 px-4 text-sm font-medium text-secondary-text-color">
                        <SlidersHorizontal className="h-4 w-4" />
                        <AppText textName="FILTER" textModule="FILTERS" />
                    </button>

                    <div className="flex overflow-hidden rounded-lg border border-border">

                        <button className="flex h-10 w-10 items-center justify-center bg-teal-700 text-white">
                            <LayoutGrid className="h-4 w-4" />
                        </button>

                        <button className="flex h-10 w-10 items-center justify-center bg-transparent text-foreground hover:bg-muted">
                            <List className="h-4 w-4 text-muted-foreground" />
                        </button>

                    </div>

                </div>

                {/* Tablet + Desktop */}
                <div className="hidden md:flex md:flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

                    {/* Filters Grid */}
                    <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap">

                        <button className="flex h-10 items-center gap-2 rounded-lg border border-secondary-text-color/20 bg-secondary-text-color/10 px-3 text-sm font-medium text-secondary-text-color">
                            <SlidersHorizontal className="h-4 w-4" />
                            <AppText textName="FILTER" textModule="FILTERS" />
                        </button>

                        {filters.map((filter) => {
                            const Icon = filter.icon;

                            return (
                                <button
                                    key={filter.textName}
                                    className="flex h-10 items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 text-sm text-foreground transition hover:border-border hover:bg-muted"
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span>
                                            <AppText textName={filter.textName} textModule="FILTERS" />
                                        </span>
                                    </div>

                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center justify-between lg:justify-end gap-4">

                        <div className="flex items-center gap-2 text-sm">

                            <span className="text-muted-foreground">
                                <AppText textName="SORT_BY" textModule="FILTERS" />
                            </span>

                            <button className="flex items-center gap-1 font-medium text-foreground">
                                <AppText textName="RECOMMENDED" textModule="FILTERS" />
                                <ChevronDown className="h-4 w-4" />
                            </button>

                        </div>

                        <div className="flex overflow-hidden rounded-lg border border-border">

                            <button className="flex h-10 w-10 items-center justify-center bg-teal-700 text-white">
                                <LayoutGrid className="h-4 w-4" />
                            </button>

                            <button className="flex h-10 w-10 items-center justify-center bg-transparent text-foreground transition hover:bg-muted">
                                <List className="h-4 w-4" />
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}
