"use client";

import {
  Palmtree,
  Building2,
  Landmark,
  Coffee,
  Trees,
  ChevronRight,
} from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Resorts",
    subtitle: "Relax & Enjoy",
    icon: Palmtree,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    id: 2,
    title: "Banquet Halls",
    subtitle: "Weddings & Parties",
    icon: Landmark,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 3,
    title: "Auditoriums",
    subtitle: "Events & Seminars",
    icon: Building2,
    color: "bg-violet-50 text-violet-700",
  },
  {
    id: 4,
    title: "Cafes & Restaurants",
    subtitle: "Small Gatherings",
    icon: Coffee,
    color: "bg-orange-50 text-orange-700",
  },
  {
    id: 5,
    title: "Open Lawns",
    subtitle: "Outdoor Events",
    icon: Trees,
    color: "bg-green-50 text-green-700",
  },
];

export default function VenueTypeSection() {
  return (
    <section className="mx-4 mt-4 rounded-lg border border-slate-200 bg-white p-3">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-4">

        <div>
          <h2 className="text-sm font-semibold text-slate-900 lg:text-base">
            Explore by Venue Type
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Discover venues tailored for every occasion
          </p>
        </div>

        <button className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50 md:flex">
          <ChevronRight className="h-4 w-4 text-slate-600" />
        </button>

      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.id}
              className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-all duration-200 hover:border-teal-200 hover:shadow-md"
            >
              {/* Icon */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${category.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">

                <h3 className="truncate text-xs font-semibold text-slate-900 lg:text-sm">
                  {category.title}
                </h3>

                <p className="mt-0.5 truncate text-[10px] text-slate-500 lg:text-xs">
                  {category.subtitle}
                </p>

              </div>

            </button>
          );
        })}

      </div>

    </section>
    // <section className="mx-4 mt-4 rounded-lg border border-slate-200 bg-white p-4 lg:p-5">

    //   {/* Header */}
    //   <div className="mb-5 flex items-center justify-between gap-4">

    //     <div>
    //       <h2 className="text-sm font-semibold text-slate-900 lg:text-base">
    //         Explore by Venue Type
    //       </h2>

    //       <p className="mt-1 text-xs text-slate-500 lg:text-sm">
    //         Discover venues tailored for every occasion
    //       </p>
    //     </div>

    //     <button className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 transition hover:bg-slate-50 md:flex">
    //       <ChevronRight className="h-5 w-5 text-slate-600" />
    //     </button>

    //   </div>

    //   {/* Categories */}
    //   <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

    //     {categories.map((category) => {
    //       const Icon = category.icon;

    //       return (
    //         <button
    //           key={category.id}
    //           className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md"
    //         >
    //           {/* Icon */}
    //           <div
    //             className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color}`}
    //           >
    //             <Icon className="h-6 w-6" />
    //           </div>

    //           {/* Content */}
    //           <div className="min-w-0 flex-1">

    //             <h3 className="truncate text-sm font-semibold text-slate-900">
    //               {category.title}
    //             </h3>

    //             <p className="mt-1 text-xs text-slate-500">
    //               {category.subtitle}
    //             </p>

    //           </div>
    //         </button>
    //       );
    //     })}

    //   </div>

    // </section>
  );
}



// <div className="mt-4">
//   <VenueCategorySection />
// </div>
// Why this is better than the image

// The image uses:

// [ Icon ] Resorts
// [ Icon ] Banquet Halls
// [ Icon ] Auditoriums

// which is good.

// This version adds:

// Better hover
// Normal
// ┌──────────────┐
// │ Resorts      │
// └──────────────┘

// Hover
// ┌──────────────┐
// │ Resorts      │
// │ shadow       │
// └──────────────┘
// Mobile Friendly

// Desktop:

// Resorts | Banquet | Auditorium | Cafe | Lawns

// Tablet:

// ← Horizontal Scroll →

// No layout breaking.

// Cleaner Hierarchy
// Explore by Venue Type
// Discover venues tailored for every occasion

// ┌ Resort ┐
// ┌ Hall   ┐
// ┌ Cafe   ┐

// For BookMyVenue, I'd place the sections exactly like:

// 🔥 Active Deals This Week

// 🏛 Explore by Venue Type

// 🎯 Event Planning Hero Section

// 🔍 Filters

// 🏨 Venue Listings

// which matches the visual hierarchy of the design you shared while being fully responsive and production-ready.