interface VenueDescriptionProps {
  description: string;
}

export default function VenueDescription({ description }: VenueDescriptionProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
        About this Venue
      </h2>
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{description}</p>
    </div>
  );
}
