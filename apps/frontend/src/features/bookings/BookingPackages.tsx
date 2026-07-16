/* eslint-disable */

import PackageCard from "./PackageCard";

const packages = [
    {
        date: "15 Jul 2026",
        title: "Morning Wedding Package",
        time: "09:00 AM - 01:00 PM",
        guests: "50 - 150 Guests",
        price: "₹18,000",
        available: "Available",
        selected: true,
    },
    {
        date: "16 Jul 2026",
        title: "Morning Wedding Package",
        time: "09:00 AM - 01:00 PM",
        guests: "50 - 150 Guests",
        price: "₹18,000",
        available: "Available",
    },
    {
        date: "17 Jul 2026",
        title: "Evening Reception Package",
        time: "04:00 PM - 10:00 PM",
        guests: "150 - 400 Guests",
        price: "₹30,000",
        available: "Only 2 Left",
        evening: true,
    },
];

export default function BookingPackages() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-bold">
                        2. Choose your booking package
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Select a package for each date
                    </p>

                </div>

                <button className="text-sm font-semibold text-[#0F8C84]">
                    How packages work?
                </button>

            </div>

            <div className="flex flex-wrap gap-5">

                {packages.map((pkg) => (
                    <PackageCard
                        key={pkg.date}
                        {...pkg}
                    />
                ))}

            </div>

        </section>
    );
}