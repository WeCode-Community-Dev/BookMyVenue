import { Building2 } from 'lucide-react';

interface VenueEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function VenueEmptyState({
  hasActiveFilters,
  onClearFilters,
}: VenueEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-background border border-border p-5 text-muted mb-4">
        <Building2 size={36} className="stroke-[1.2]" />
      </div>
      <h3 className="text-lg font-bold text-foreground">No venues found</h3>
      <p className="text-sm text-muted mt-1 max-w-sm">
        Try adjusting your search or filters to discover more venues.
      </p>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-all cursor-pointer"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
