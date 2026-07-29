import { MapPin, Users } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';

interface SelectedVenueSummaryProps {
  venue: Venue;
}

export default function SelectedVenueSummary({ venue }: SelectedVenueSummaryProps) {
  const categoryName =
    venue.categoryId && typeof venue.categoryId === 'object' ? venue.categoryId.name : 'Venue';

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 transition-all hover:shadow-md">
      <div className="flex gap-3 sm:gap-4 items-center w-full sm:w-auto min-w-0">
        {venue.images && venue.images[0] ? (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-border shrink-0"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 text-primary flex items-center justify-center rounded-xl border border-border font-bold text-lg sm:text-xl shrink-0">
            {venue.name.charAt(0)}
          </div>
        )}
        <div className="space-y-0.5 min-w-0">
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            {categoryName}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-foreground truncate">
            {venue.name}
          </h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="shrink-0" /> {venue.address.city}, {venue.address.state}
            </span>
            <span className="flex items-center gap-1">
              <Users size={11} className="shrink-0" /> Capacity: {venue.capacity} guests
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
