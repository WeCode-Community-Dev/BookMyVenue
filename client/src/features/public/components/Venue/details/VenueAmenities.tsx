interface VenueAmenitiesProps {
  amenities: string[];
}

export default function VenueAmenities({ amenities }: VenueAmenitiesProps) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="py-6 border-b border-border/50 space-y-4">
      <h2 className="text-xl font-extrabold text-foreground tracking-tight">Amenities</h2>
      <div className="flex flex-wrap gap-2.5">
        {amenities.map((amenity, idx) => (
          <span
            key={idx}
            className="inline-flex items-center rounded-xl bg-surface border border-border/40 px-4 py-2.5 text-sm font-semibold text-foreground shadow-2xs transition-all hover:bg-surface/80"
          >
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
}
