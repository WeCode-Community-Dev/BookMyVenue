import type { Space, VenueDetails } from "@/lib/data/venues";

type SpaceAboutSectionProps = {
  space: Space;
  venue: VenueDetails;
};

export function SpaceAboutSection({ space, venue }: SpaceAboutSectionProps) {
  const description =
    space.description?.trim() ||
    venue.description?.trim() ||
    "No description available for this space.";

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-on-surface">About this space</h2>
      <div className="flex flex-col gap-3 text-body-md text-on-surface-variant leading-relaxed">
        {description.split("\n").filter(Boolean).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
