"use client";

import MapComponent from "./Map";

export default function MapPanel() {
    return (
        <aside className="hidden xl:flex sticky top-[72px] h-[calc(100vh-72px)] w-[320px] shrink-0 border-l border-slate-200 bg-white">
            <div className="relative h-full w-full">

                {/* Google Map */}
                <MapComponent/>
                {/* Top Controls */}
                <div className="absolute left-4 top-4 z-10 flex rounded-xl bg-white p-1 shadow-lg">
                    <button className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white">
            Map View
                    </button>

                    <button className="px-4 py-2 text-sm font-medium text-slate-600">
            List View
                    </button>
                </div>

                {/* Venue Card */}
                <div className="absolute bottom-4 left-4 right-4 z-10 rounded-2xl bg-white p-3 shadow-xl">
                    <img
                        src="/assets/images/venue.jpg"
                        alt="Venue"
                        className="h-28 w-full rounded-xl object-cover"
                    />

                    <h3 className="mt-3 text-sm font-semibold">
            Lagoona Beach Resort
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
            Cherai, Kochi
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="font-semibold text-teal-700">
              ₹18,000/day
                        </span>

                        <button className="rounded-lg border border-coral-300 px-3 py-1 text-xs font-medium text-coral-500">
              View Details
                        </button>
                    </div>
                </div>

            </div>
        </aside>
    );
}
