"use client";

import {
  Heart,
  MapPin,
  Users,
  Snowflake,
  Car,
  Star,
  BadgeCheck,
} from "lucide-react";

type Venue = {
  id: number;
  name: string;
  image: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  verified: boolean;
  guests: number;
  amenities: string[];
  moreAmenities: number;
  availability: string;
  price: number;
};

type CardProps = {
  venue: Venue;
};

export default function Card({ venue }: CardProps) {
  return (
    <div className="w-full max-w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Image */}
      <div className="relative">

        <img
          src={venue.image}
          alt={venue.name}
          className="h-[220px] w-full object-cover"
        />

        {/* Availability Badge */}
        <div className="absolute left-3 top-3 rounded-lg bg-teal-700 px-3 py-1.5 text-[11px] font-semibold text-white shadow">
          {venue.availability}
        </div>

        {/* Wishlist */}
        <button className="absolute right-3 top-3 rounded-full bg-black/20 p-2 backdrop-blur-sm transition hover:bg-black/30">
          <Heart className="h-5 w-5 text-white" />
        </button>

      </div>

      {/* Content */}
      <div className="p-4">

        {/* Venue Name + Rating */}
        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {venue.name}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-1">

            <Star className="h-4 w-4 fill-teal-600 text-teal-600" />

            <span className="text-sm font-semibold text-slate-900">
              {venue.rating}
            </span>

            <span className="text-xs text-slate-500">
              ({venue.reviews})
            </span>

          </div>

        </div>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">

          <MapPin className="h-4 w-4" />

          <span>{venue.location}</span>

          <span>•</span>

          <span>{venue.distance}</span>

        </div>

        {/* Verified */}
        {venue.verified && (
          <div className="mt-3 flex items-center gap-1.5">

            <BadgeCheck className="h-4 w-4 text-teal-700" />

            <span className="text-xs font-semibold text-teal-700">
              Verified Venue
            </span>

          </div>
        )}

        {/* Amenities */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-slate-100 py-3">

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Users className="h-4 w-4" />
            <span>{venue.guests} Guests</span>
          </div>

          {venue.amenities[0] && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Snowflake className="h-4 w-4" />
              <span>{venue.amenities[0]}</span>
            </div>
          )}

          {venue.amenities[1] && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Car className="h-4 w-4" />
              <span>{venue.amenities[1]}</span>
            </div>
          )}

          <div className="text-xs text-slate-500">
            +{venue.moreAmenities} More
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 flex items-end justify-between gap-3">

          <div>

            <div className="flex items-end gap-1">

              <span className="text-2xl font-bold text-teal-700">
                ₹{venue.price.toLocaleString()}
              </span>

              <span className="pb-0.5 text-xs text-slate-500">
                / day onwards
              </span>

            </div>

          </div>

          <button className="rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50">
            View Details
          </button>

        </div>

      </div>

    </div>
  );
}

// "use client";

// import {
//   Heart,
//   MapPin,
//   Users,
//   Snowflake,
//   Car,
//   Star,
//   BadgeCheck,
// } from "lucide-react";

// export default function Card() {
//   return (
//     <div className="w-full max-w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

//       {/* Image */}
//       <div className="relative">

//         <img
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE5GQXocw4wkuQHzwmCItvQFiNZosHJuqmdg&s"
//           alt="Venue"
//           className="h-[220px] w-full object-cover"
//         />

//         {/* Availability Badge */}
//         <div className="absolute left-3 top-3 rounded-lg bg-teal-700 px-3 py-1.5 text-[11px] font-semibold text-white shadow">
//           Available This Weekend
//         </div>

//         {/* Wishlist */}
//         <button className="absolute right-3 top-3 rounded-full bg-black/20 p-2 backdrop-blur-sm transition hover:bg-black/30">
//           <Heart className="h-5 w-5 text-white" />
//         </button>

//       </div>

//       {/* Content */}
//       <div className="p-4">

//         {/* Venue Name + Rating */}
//         <div className="flex items-start justify-between gap-3">

//           <div className="min-w-0 flex-1">
//             <h3 className="truncate text-lg font-semibold text-slate-900">
//               Lagoona Beach Resort
//             </h3>
//           </div>

//           <div className="flex shrink-0 items-center gap-1">

//             <Star className="h-4 w-4 fill-teal-600 text-teal-600" />

//             <span className="text-sm font-semibold text-slate-900">
//               4.8
//             </span>

//             <span className="text-xs text-slate-500">
//               (88)
//             </span>

//           </div>

//         </div>

//         {/* Location */}
//         <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">

//           <MapPin className="h-4 w-4" />

//           <span>Cherai, Kochi</span>

//           <span>•</span>

//           <span>12 km</span>

//         </div>

//         {/* Verified */}
//         <div className="mt-3 flex items-center gap-1.5">

//           <BadgeCheck className="h-4 w-4 text-teal-700" />

//           <span className="text-xs font-semibold text-teal-700">
//             Verified Venue
//           </span>

//         </div>

//         {/* Amenities */}
//         <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-slate-100 py-3">

//           <div className="flex items-center gap-1.5 text-xs text-slate-600">
//             <Users className="h-4 w-4" />
//             <span>200 Guests</span>
//           </div>

//           <div className="flex items-center gap-1.5 text-xs text-slate-600">
//             <Snowflake className="h-4 w-4" />
//             <span>AC</span>
//           </div>

//           <div className="flex items-center gap-1.5 text-xs text-slate-600">
//             <Car className="h-4 w-4" />
//             <span>Parking</span>
//           </div>

//           <div className="text-xs text-slate-500">
//             +5 More
//           </div>

//         </div>

//         {/* Footer */}
//         <div className="mt-4 flex items-end justify-between gap-3">

//           <div>

//             <div className="flex items-end gap-1">

//               <span className="text-2xl font-bold text-teal-700">
//                 ₹18,000
//               </span>

//               <span className="pb-0.5 text-xs text-slate-500">
//                 / day onwards
//               </span>

//             </div>

//           </div>

//           <button className="rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50">
//             View Details
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }
