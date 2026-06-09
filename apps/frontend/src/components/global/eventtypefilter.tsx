"use client";

import {
  Cake,
  Heart,
  BriefcaseBusiness,
  Mic,
  PartyPopper,
  MoreHorizontal,
  MapPin,
  Users,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

const eventTypes = [
  { id: 1, title: "Birthday", icon: Cake },
  { id: 2, title: "Wedding", icon: Heart },
  { id: 3, title: "Corporate", icon: BriefcaseBusiness },
  { id: 4, title: "Meetup", icon: Mic },
  { id: 5, title: "Celebration", icon: PartyPopper },
  { id: 6, title: "Other Events", icon: MoreHorizontal },
];

export default function EventTypeFilter() {
  return (
    <section className="mx-4 mt-4 rounded-lg border border-slate-200 bg-white p-4 lg:p-5">

      {/* Top */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h1 className="text-xl font-bold text-slate-900 lg:text-3xl">
            Every occasion deserves the perfect venue
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Discover and book amazing venues for every kind of event.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">

          <div className="flex -space-x-2">
            <img
              src="https://i.pravatar.cc/50?img=12"
              className="h-8 w-8 rounded-full border-2 border-white"
            />
            <img
              src="https://i.pravatar.cc/50?img=13"
              className="h-8 w-8 rounded-full border-2 border-white"
            />
            <img
              src="https://i.pravatar.cc/50?img=14"
              className="h-8 w-8 rounded-full border-2 border-white"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-900">
              Trusted by 50K+
            </p>

            <p className="text-[11px] text-slate-500">
              Event planners & hosts
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

          <p className="text-sm font-semibold text-slate-900">
            What are you planning?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">

          {eventTypes.map((event) => {
            const Icon = event.icon;

            return (
              <button
                key={event.id}
                className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 transition-all hover:border-teal-200 hover:bg-teal-50"
              >
                <Icon className="h-5 w-5 text-slate-700" />

                <span className="text-xs font-medium text-slate-900">
                  {event.title}
                </span>
              </button>
            );
          })}

        </div>

      </div>

      {/* Search Row */}
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">

        <button className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
          <MapPin className="h-4 w-4 text-slate-500" />
          Kochi, Kerala
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
          <Users className="h-4 w-4 text-slate-500" />
          50 Guests
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
          <CalendarDays className="h-4 w-4 text-slate-500" />
          This Weekend
        </button>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-coral-500 to-red-500 px-6 py-3 text-sm font-semibold text-white">
          Find Venues
          <ArrowRight className="h-4 w-4" />
        </button>

      </div>

    </section>
  );
}