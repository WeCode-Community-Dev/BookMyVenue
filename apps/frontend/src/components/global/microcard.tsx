"use client";

import { Heart, MapPin } from "lucide-react";
import Image from "next/image";

interface SavedVenueCardProps {
  image: string;
  name: string;
  location: string;
  price: number;
  isFavourite?: boolean;
}

export default function SavedVenueCard({
  image,
  name,
  location,
  price,
  isFavourite = true,
}: SavedVenueCardProps) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white transition hover:shadow-md">

      {/* Image */}
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={400}
          height={250}
          className="h-40 w-full object-cover"
        />

        {isFavourite && (
          <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
            <Heart
              className="h-4 w-4 fill-red-500 text-red-500"
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
          {name}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {location}
        </div>

        <p className="mt-4 text-lg font-bold text-slate-900">
          ₹{price.toLocaleString()}
          <span className="ml-1 text-sm font-normal text-slate-500">
            / day
          </span>
        </p>
      </div>
    </div>
  );
}