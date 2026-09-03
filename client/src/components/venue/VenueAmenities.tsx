interface VenueAmenitiesProps {
  amenities: string[];
}

export function VenueAmenities({ amenities }: VenueAmenitiesProps) {
  if (amenities.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
        <span>Amenities</span>
        <span className="w-8 h-[2px] bg-[var(--bg-green)]"></span>
      </h2>
      <div className="flex flex-wrap gap-3">
        {amenities.slice(0, 8).map((item, index) => (
          <div
            key={index}
            className="px-5 py-3 rounded-2xl bg-[var(--bg-green)]/10 text-[var(--bg-green)] border border-[var(--bg-green)]/20 font-semibold text-sm shadow-sm hover:scale-[1.03] hover:bg-[var(--bg-green)]/10 transition duration-200"
          >
            {item}
          </div>
        ))}
        {amenities.length > 8 && (
          <button className="px-5 py-3 rounded-2xl bg-[var(--bg-green)] text-white font-semibold text-sm cursor-pointer shadow-md hover:opacity-90 transition hover:scale-[1.03] active:scale-95">
            +{amenities.length - 8} More
          </button>
        )}
      </div>
    </div>
  );
}
