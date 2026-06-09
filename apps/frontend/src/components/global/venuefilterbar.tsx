"use client";

import {
  SlidersHorizontal,
  IndianRupee,
  Users,
  Building2,
  CalendarDays,
  MapPin,
  Star,
  LayoutGrid,
  List,
  ChevronDown,
} from "lucide-react";

export default function VenueFiltersBar() {
  const filters = [
    {
      label: "Price",
      icon: IndianRupee,
    },
    {
      label: "Capacity",
      icon: Users,
    },
    {
      label: "Amenities",
      icon: Building2,
    },
    {
      label: "Availability",
      icon: CalendarDays,
    },
    {
      label: "Distance",
      icon: MapPin,
    },
    {
      label: "Rating 4.0+",
      icon: Star,
    },
  ];

  return (
    <section className="mx-4 mt-4 rounded-lg border border-slate-200 bg-white p-3 lg:p-4">

      <div className="flex flex-col gap-3">

        {/* Mobile */}
        <div className="flex items-center justify-between md:hidden">

          <button className="flex h-10 items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-4 text-sm font-medium text-teal-700">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <div className="flex overflow-hidden rounded-lg border border-slate-200">

            <button className="flex h-10 w-10 items-center justify-center bg-teal-700 text-white">
              <LayoutGrid className="h-4 w-4" />
            </button>

            <button className="flex h-10 w-10 items-center justify-center">
              <List className="h-4 w-4 text-slate-600" />
            </button>

          </div>

        </div>

        {/* Tablet + Desktop */}
        <div className="hidden md:flex md:flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

          {/* Filters Grid */}
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap">

            <button className="flex h-10 items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 text-sm font-medium text-teal-700">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            {filters.map((filter) => {
              const Icon = filter.icon;

              return (
                <button
                  key={filter.label}
                  className="flex h-10 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{filter.label}</span>
                  </div>

                  <ChevronDown className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-between lg:justify-end gap-4">

            <div className="flex items-center gap-2 text-sm">

              <span className="text-slate-500">
                Sort by:
              </span>

              <button className="flex items-center gap-1 font-medium text-slate-900">
                Recommended
                <ChevronDown className="h-4 w-4" />
              </button>

            </div>

            <div className="flex overflow-hidden rounded-lg border border-slate-200">

              <button className="flex h-10 w-10 items-center justify-center bg-teal-700 text-white">
                <LayoutGrid className="h-4 w-4" />
              </button>

              <button className="flex h-10 w-10 items-center justify-center bg-white text-slate-600 transition hover:bg-slate-50">
                <List className="h-4 w-4" />
              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

// "use client";

// import {
//   SlidersHorizontal,
//   IndianRupee,
//   Users,
//   Building2,
//   CalendarDays,
//   MapPin,
//   Star,
//   LayoutGrid,
//   List,
//   ChevronDown,
// } from "lucide-react";

// export default function VenueFiltersBar() {
//   const filters = [
//     {
//       label: "Price",
//       icon: IndianRupee,
//     },
//     {
//       label: "Capacity",
//       icon: Users,
//     },
//     {
//       label: "Amenities",
//       icon: Building2,
//     },
//     {
//       label: "Availability",
//       icon: CalendarDays,
//     },
//     {
//       label: "Distance",
//       icon: MapPin,
//     },
//     {
//       label: "Rating 4.0+",
//       icon: Star,
//     },
//   ];

//   return (
//     <section className="mx-4 mt-4 rounded-lg border border-slate-200 bg-white p-3">

//       <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

//         {/* Left Filters */}
//         <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">

//           {/* Main Filter Button */}
//           <button className="flex shrink-0 items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700">
//             <SlidersHorizontal className="h-4 w-4" />
//             Filters
//           </button>

//           {filters.map((filter) => {
//             const Icon = filter.icon;

//             return (
//               <button
//                 key={filter.label}
//                 className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
//               >
//                 <Icon className="h-4 w-4" />

//                 <span>{filter.label}</span>

//                 <ChevronDown className="h-3.5 w-3.5" />
//               </button>
//             );
//           })}
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center justify-between gap-3 xl:justify-end">

//           <div className="flex items-center gap-2 text-sm">

//             <span className="text-slate-500">
//               Sort by:
//             </span>

//             <button className="flex items-center gap-1 font-medium text-slate-900">
//               Recommended
//               <ChevronDown className="h-4 w-4" />
//             </button>

//           </div>

//           <div className="flex overflow-hidden rounded-lg border border-slate-200">

//             <button className="flex h-9 w-9 items-center justify-center bg-teal-700 text-white">
//               <LayoutGrid className="h-4 w-4" />
//             </button>

//             <button className="flex h-9 w-9 items-center justify-center bg-white text-slate-600 transition hover:bg-slate-50">
//               <List className="h-4 w-4" />
//             </button>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// }