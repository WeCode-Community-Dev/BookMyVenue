import { Building2 } from 'lucide-react';
import type { Venue } from '../../types/venues.types';
import VenueCard from './VenueCard';

type Props = {
  venues: Venue[];
  onEdit: (venue: Venue) => void;
};

const VenueTable = ({ venues, onEdit }: Props) => {
  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-background border border-border p-4 text-muted mb-4">
          <Building2 size={32} className="stroke-[1.2]" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No venues found</h3>
        <p className="text-sm text-muted mt-1 max-w-sm">
          You haven't added any venues yet, or no venues match your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <VenueCard key={venue._id} venue={venue} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default VenueTable;
