import React from "react";

interface VenueDescriptionProps {
  description: string;
}

export default function VenueDescription({ description }: VenueDescriptionProps) {
  return (
    <div className="py-8 border-b border-slate-200/80">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-4 select-none">
        About this Venue
      </h2>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}
