interface VenueAmenitiesProps {
  amenities: string[];
}

export default function VenueAmenities({ amenities }: VenueAmenitiesProps) {
  if (amenities.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Amenities</h2>
      <div className="flex flex-wrap gap-2">
        {amenities.map((amenity, idx) => (
          <span
            key={idx}
            className="inline-flex items-center rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground"
          >
            {amenity}
          </span>
        ))}
      </div>
    </div>
  );
}
