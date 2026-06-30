import React from "react";
import {
  Car,
  Wind,
  Wifi,
  Utensils,
  Tv,
  Mic,
  Zap,
  Accessibility,
  Footprints, // for restrooms, or Bath, or we can use generic icons
  Shield,
  HelpCircle
} from "lucide-react";
import VenueSection from "./VenueSection";

interface VenueAmenitiesProps {
  amenities: string[];
}

export default function VenueAmenities({ amenities }: VenueAmenitiesProps) {
  // Map amenity name to matching Lucide icon
  const getAmenityIcon = (name: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes("parking")) return <Car className="size-5" />;
    if (lowercase.includes("air conditioning") || lowercase.includes("ac")) return <Wind className="size-5" />;
    if (lowercase.includes("wifi") || lowercase.includes("internet")) return <Wifi className="size-5" />;
    if (lowercase.includes("catering") || lowercase.includes("food")) return <Utensils className="size-5" />;
    if (lowercase.includes("projector") || lowercase.includes("screen") || lowercase.includes("tv")) return <Tv className="size-5" />;
    if (lowercase.includes("stage") || lowercase.includes("mic") || lowercase.includes("audio")) return <Mic className="size-5" />;
    if (lowercase.includes("generator") || lowercase.includes("backup") || lowercase.includes("power")) return <Zap className="size-5" />;
    if (lowercase.includes("wheelchair") || lowercase.includes("accessible")) return <Accessibility className="size-5" />;
    if (lowercase.includes("restroom") || lowercase.includes("washroom") || lowercase.includes("toilet")) return <Footprints className="size-5" />;
    if (lowercase.includes("security") || lowercase.includes("guard") || lowercase.includes("cctv")) return <Shield className="size-5" />;
    return <HelpCircle className="size-5" />;
  };

  return (
    <VenueSection title="What this venue offers" id="amenities">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
        {amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-3.5 text-slate-700 py-1 select-none">
            <div className="text-slate-450 shrink-0">
              {getAmenityIcon(amenity)}
            </div>
            <span className="text-sm font-semibold text-slate-800">
              {amenity}
            </span>
          </div>
        ))}
      </div>
    </VenueSection>
  );
}
