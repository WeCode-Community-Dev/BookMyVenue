"use client";

import {
  CalendarDays,
  Heart,
  Clock3,
  Headphones,
  ChevronLeft,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[190px] flex-col border-r border-slate-200 bg-white md:flex lg:w-[220px]">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        {/* Navigation */}
        <nav className="space-y-2">
          <button className="flex w-full items-start gap-3 rounded-lg bg-slate-100 p-3 text-left transition">
            <CalendarDays className="mt-0.5 h-5 w-5 text-teal-700" />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                My Bookings
              </p>

              <p className="mt-1 text-xs text-slate-500">Upcoming & Past</p>
            </div>
          </button>

          <button className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-slate-100">
            <Heart className="mt-0.5 h-5 w-5 text-slate-700" />

            <div>
              <p className="text-sm font-semibold text-slate-900">Wishlist</p>

              <p className="mt-1 text-xs text-slate-500">Saved Venues</p>
            </div>
          </button>

          <button className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-slate-100">
            <Clock3 className="mt-0.5 h-5 w-5 text-slate-700" />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Recently Viewed
              </p>

              <p className="mt-1 text-xs text-slate-500">Venues you checked</p>
            </div>
          </button>

          <button className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-slate-100">
            <Headphones className="mt-0.5 h-5 w-5 text-slate-700" />

            <div>
              <p className="text-sm font-semibold text-slate-900">Support</p>

              <p className="mt-1 text-xs text-slate-500">Help & Assistance</p>
            </div>
          </button>
        </nav>

        {/* CTA Card */}
        <div className="mt-5 h-[320px] overflow-hidden rounded-lg border border-slate-200 bg-white">

           <div className="px-3">
            <img
              src="/assets/images/building.png"
              alt="List Venue"
              className="mx-auto h-[140px] w-auto object-contain lg:h-[170px]"
            />
          </div>
          <div className="px-4 p">
            <h3 className="text-sm font-semibold leading-tight text-slate-900">
              List your venue
              <br />
              with us
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Reach thousands of customers every day.
            </p>
          </div>

         

          <div className="px-4 pt-4 pb-4">
            <button className="w-full rounded-md bg-teal-700 py-2 text-xs font-medium text-white transition hover:bg-teal-800">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="shrink-0 border-t border-slate-200 p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <ChevronLeft className="h-4 w-4" />
          Collapse
        </button>
      </div>
    </aside>
  );
}

// "use client";

// import {
//   CalendarDays,
//   Heart,
//   Clock3,
//   Headphones,
//   ChevronLeft,
// } from "lucide-react";

// export default function Sidebar() {
//   return (
//     <aside className="hidden md:flex h-[calc(100vh-72px)] w-[180px] lg:w-[220px] flex-col justify-between border-r border-slate-200 bg-white">
//       {/* Top Section */}
//       <div className="px-4 py-6">
//         {/* Navigation */}
//         <nav className="space-y-3">
//           {/* Active Item */}
//           <button className="flex w-full items-start gap-3 rounded-xl bg-slate-100 p-3 text-left transition">
//             <CalendarDays className="mt-0.5 h-5 w-5 text-teal-700" />

//             <div>
//               <p className="text-sm font-semibold text-slate-900">
//                 My Bookings
//               </p>

//               <p className="mt-1 text-xs text-slate-500">Upcoming & Past</p>
//             </div>
//           </button>

//           <button className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-slate-100">
//             <Heart className="mt-0.5 h-5 w-5 text-slate-700" />

//             <div>
//               <p className="text-sm font-semibold text-slate-900">Wishlist</p>

//               <p className="mt-1 text-xs text-slate-500">Saved Venues</p>
//             </div>
//           </button>

//           <button className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-slate-100">
//             <Clock3 className="mt-0.5 h-5 w-5 text-slate-700" />

//             <div>
//               <p className="text-sm font-semibold text-slate-900">
//                 Recently Viewed
//               </p>

//               <p className="mt-1 text-xs text-slate-500">Venues you checked</p>
//             </div>
//           </button>

//           <button className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-slate-100">
//             <Headphones className="mt-0.5 h-5 w-5 text-slate-700" />

//             <div>
//               <p className="text-sm font-semibold text-slate-900">Support</p>

//               <p className="mt-1 text-xs text-slate-500">Help & Assistance</p>
//             </div>
//           </button>
//         </nav>

//         {/* CTA Card */}
//         <div className="mt-6 overflow-hidden rounded-[8px] border border-slate-200 bg-white">
//           <div className="px-4 pt-4">
//             <h3 className="text-[14px] font-semibold leading-tight text-slate-900">
//               List your venue
//               <br />
//               with us
//             </h3>

//             <p className="mt-2 text-xs leading-relaxed text-slate-500">
//               Reach thousands of customers every day.
//             </p>
//           </div>

//           <div className="px-3 py-1">
//             <img
//               src="/assets/images/building.png"
//               alt="List Venue"
//               className="mx-auto h-[210px]  object-contain"
//             />
//           </div>

//           <div className="px-9 pb-4 ">
//             <button className="w-[115] rounded-[6px] bg-teal-700 py-1.5 text-[10px]  text-white transition hover:bg-teal-800">
//               Get Started
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Bottom */}
//       <div className="border-t border-slate-200 p-4">
//         <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
//           <ChevronLeft className="h-4 w-4" />
//           Collapse
//         </button>
//       </div>
//     </aside>
//   );
// }
