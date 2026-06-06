"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const offers = [
  {
    id: 1,
    badge: "LIMITED TIME",
    title: "Wedding Season Special",
    description: "Save up to 25% on premium banquet halls, resorts and destination wedding venues.",
    discount: "25%",
    venues: "120+ Venues",
    bg: "from-teal-700 via-teal-600 to-cyan-500",
  },
  {
    id: 2,
    badge: "POPULAR",
    title: "Birthday Celebration Deals",
    description: "Flat ₹5,000 OFF on selected birthday venues and party packages.",
    discount: "₹5K",
    venues: "85+ Venues",
    bg: "from-rose-600 via-pink-500 to-orange-400",
  },
  {
    id: 3,
    badge: "CORPORATE",
    title: "Corporate Event Packages",
    description: "Special pricing for team outings, conferences and annual meetings.",
    discount: "15%",
    venues: "60+ Venues",
    bg: "from-slate-800 via-slate-700 to-slate-600",
  },
  {
    id: 4,
    badge: "WEEKEND",
    title: "Weekend Specials",
    description: "Exclusive discounts on premium venues every Friday to Sunday.",
    discount: "10%",
    venues: "90+ Venues",
    bg: "from-violet-700 via-purple-600 to-fuchsia-500",
  },
];

export default function OffersSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const offer = offers[active];

  return (
    <section className="mx-4 mt-4 rounded-lg border border-slate-200 bg-white p-3">

      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 lg:text-base">
            Exclusive Offers
          </h2>

          <p className="mt-1 text-xs text-slate-500 lg:text-sm">
            Handpicked deals for your next celebration
          </p>
        </div>

        <button className="hidden items-center gap-2 text-sm font-medium text-teal-700 transition hover:gap-3 md:flex">
          View All
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
              {offer.badge}
            </span>
          </div>

          {/* Title + Discount */}
          <div className="flex items-center justify-between gap-4">

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold text-white lg:text-2xl">
                {offer.title}
              </h3>

              <p className="mt-1 text-xs text-white/90 lg:text-sm">
                {offer.description}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-3xl font-bold leading-none text-white lg:text-5xl">
                {offer.discount}
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/80">
                OFF
              </p>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="flex flex-wrap items-center gap-2">

            <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-white">
              {offer.venues}
            </span>

            <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium text-white">
              Ends Soon
            </span>

            <button className="ml-auto flex items-center gap-1 text-xs font-semibold text-white transition hover:gap-2">
              Explore
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

          </div>

        </div>
      </div>

      {/* Indicators */}
      <div className="mt-3 flex justify-center gap-1.5">

        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`rounded-full transition-all duration-300 ${
              active === index
                ? "h-1.5 w-6 bg-teal-700"
                : "h-1.5 w-1.5 bg-slate-300"
            }`}
          />
        ))}

      </div>

    </section>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import { ArrowRight } from "lucide-react";

// const offers = [
//   {
//     id: 1,
//     badge: "LIMITED TIME",
//     title: "Wedding Season Special",
//     description:
//       "Save up to 25% on premium banquet halls, resorts and destination wedding venues.",
//     discount: "25%",
//     venues: "120+ Venues",
//     bg: "from-teal-700 via-teal-600 to-cyan-500",
//   },
//   {
//     id: 2,
//     badge: "POPULAR",
//     title: "Birthday Celebration Deals",
//     description:
//       "Flat ₹5,000 OFF on selected birthday venues and party packages.",
//     discount: "₹5K",
//     venues: "85+ Venues",
//     bg: "from-rose-600 via-pink-500 to-orange-400",
//   },
//   {
//     id: 3,
//     badge: "CORPORATE",
//     title: "Corporate Event Packages",
//     description:
//       "Special pricing for team outings, conferences and annual meetings.",
//     discount: "15%",
//     venues: "60+ Venues",
//     bg: "from-slate-800 via-slate-700 to-slate-600",
//   },
//   {
//     id: 4,
//     badge: "WEEKEND",
//     title: "Weekend Specials",
//     description:
//       "Exclusive discounts on premium venues every Friday to Sunday.",
//     discount: "10%",
//     venues: "90+ Venues",
//     bg: "from-violet-700 via-purple-600 to-fuchsia-500",
//   },
// ];

// export default function OffersSection() {
//   const [active, setActive] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActive((prev) => (prev + 1) % offers.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const offer = offers[active];

//   return (
//     <section className="mx-4 mt-4 rounded-lg border border-slate-200 bg-white p-4">

//       {/* Header */}
//       <div className="mb-4 flex items-center justify-between">
//         <div>
//           <h2 className="text-sm font-semibold text-slate-900 lg:text-base">
//             Exclusive Offers
//           </h2>

//           <p className="mt-1 text-xs text-slate-500 lg:text-sm">
//             Handpicked deals for your next celebration
//           </p>
//         </div>

//         <button className="hidden items-center gap-2 text-sm font-medium text-teal-700 transition hover:gap-3 md:flex">
//           View All
//           <ArrowRight className="h-4 w-4" />
//         </button>
//       </div>

//       {/* Offer Slider */}
//       <div
//         key={offer.id}
//         className={`overflow-hidden rounded-xl bg-gradient-to-r ${offer.bg} px-5 py-4 lg:px-7 lg:py-5 transition-all duration-500`}
//       >
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

//           {/* Left */}
//           <div className="max-w-2xl">

//             <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm lg:text-xs">
//               {offer.badge}
//             </span>

//             <h3 className="mt-3 text-xl font-bold text-white lg:text-3xl">
//               {offer.title}
//             </h3>

//             <p className="mt-2 max-w-xl text-sm text-white/90">
//               {offer.description}
//             </p>

//             <div className="mt-3 flex flex-wrap items-center gap-2">

//               <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">
//                 {offer.venues}
//               </span>

//               <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">
//                 Ends Soon
//               </span>

//             </div>

//             <button className="mt-3 flex items-center gap-2 text-sm font-semibold text-white transition hover:gap-3">
//               Explore Venues
//               <ArrowRight className="h-4 w-4" />
//             </button>

//           </div>

//           {/* Right */}
//           <div className="flex items-end gap-2 md:block md:text-right">

//             <p className="text-4xl font-bold text-white lg:text-6xl">
//               {offer.discount}
//             </p>

//             <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/80 lg:text-sm">
//               OFF
//             </p>

//           </div>

//         </div>
//       </div>

//       {/* Indicators */}
//       <div className="mt-4 flex justify-center gap-2">

//         {offers.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setActive(index)}
//             className={`h-2 rounded-full transition-all duration-300 ${
//               active === index
//                 ? "w-8 bg-teal-700"
//                 : "w-2 bg-slate-300"
//             }`}
//           />
//         ))}

//       </div>

//     </section>
//   );
// }
