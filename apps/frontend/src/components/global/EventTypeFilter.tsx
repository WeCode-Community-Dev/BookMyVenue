"use client";

import {
    ArrowRight,
    BriefcaseBusiness,
    Cake,
    CalendarDays,
    Heart,
    MapPin,
    Mic,
    MoreHorizontal,
    PartyPopper,
    Users,
} from "lucide-react";

import { AppText } from "@/lib/language/LanguageHelper";

const eventTypes = [
    { id: 1, textName: "CAT_BIRTHDAY", textModule: "BASIC_INFO", icon: Cake },
    { id: 2, textName: "CAT_WEDDING", textModule: "BASIC_INFO", icon: Heart },
    { id: 3, textName: "CAT_CORPORATE", textModule: "BASIC_INFO", icon: BriefcaseBusiness },
    { id: 4, textName: "CAT_MEETUP", textModule: "BASIC_INFO", icon: Mic },
    { id: 5, textName: "CAT_CELEBRATION", textModule: "BASIC_INFO", icon: PartyPopper },
    { id: 6, textName: "OTHER_EVENTS", textModule: "LABEL", icon: MoreHorizontal },
];

export default function EventTypeFilter() {
    return (
        <section className="mx-4 mt-4 rounded-lg border border-border bg-card p-4 lg:p-5">

            {/* Top */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div>
                    <h1 className="text-xl font-bold text-foreground lg:text-3xl">
                        <AppText textName="HERO_TITLE" textModule="LABEL" />
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        <AppText textName="HERO_SUBTITLE" textModule="LABEL" />
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2">

                    <div className="flex -space-x-2">
                        <img
                            src="https://i.pravatar.cc/50?img=12"
                            alt="Avatar 1"
                            className="h-8 w-8 rounded-full border-2 border-card"
                        />
                        <img
                            src="https://i.pravatar.cc/50?img=13"
                            alt="Avatar 2"
                            className="h-8 w-8 rounded-full border-2 border-card"
                        />
                        <img
                            src="https://i.pravatar.cc/50?img=14"
                            alt="Avatar 3"
                            className="h-8 w-8 rounded-full border-2 border-card"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-foreground">
                            <AppText textName="TRUSTED_BY_50K" textModule="LABEL" />
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                            <AppText textName="EVENT_PLANNERS_HOSTS" textModule="LABEL" />
                        </p>
                    </div>

                </div>

            </div>

            {/* Event Selection */}
            <div className="mt-6">

                <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-[11px] font-semibold text-white">
                        1
                    </span>

                    <p className="text-sm font-semibold text-foreground">
                        <AppText textName="WHAT_ARE_YOU_PLANNING" textModule="LABEL" />
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">

                    {eventTypes.map((event) => {
                        const Icon = event.icon;

                        return (
                            <button
                                key={event.id}
                                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-secondary-text-color/20 hover:bg-secondary-text-color/10"
                            >
                                <Icon className="h-5 w-5 text-foreground" />

                                <span className="text-xs font-medium text-foreground">
                                    <AppText textName={event.textName} textModule={event.textModule} />
                                </span>
                            </button>
                        );
                    })}

                </div>

            </div>

            {/* Search Row */}
            <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">

                <button className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground hover:bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <AppText textName="DEFAULT_LOCATION" textModule="LABEL" />
                </button>

                <button className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground hover:bg-muted">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <AppText textName="GUEST_COUNT" textModule="LABEL" append={{ count: 50 }} />
                </button>

                <button className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground hover:bg-muted">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <AppText textName="THIS_WEEKEND" textModule="LABEL" />
                </button>

                <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-coral-500 to-red-500 px-6 py-3 text-sm font-semibold text-white">
                    <AppText textName="FIND_VENUES" textModule="BUTTON" />
                    <ArrowRight className="h-4 w-4" />
                </button>

            </div>

        </section>
    );
}
