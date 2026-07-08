import { Link } from 'react-router-dom';

import { paths } from '@/config/paths';
import { cn } from '@/utils/cn';

export function VenueCard({ venue, className }) {
  const location = [venue.district, venue.city].filter(Boolean).join(', ');

  return (
    <Link
      to={paths.venues.detail.getHref(venue.id)}
      className={cn('group block overflow-hidden rounded-card border border-brand-border bg-white shadow-sm transition hover:shadow-card', className)}
    >
      <div className="aspect-[4/3] bg-brand-surface">
        <div className="flex h-full items-center justify-center text-sm text-brand-muted">Venue photo</div>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="truncate text-base font-semibold text-brand-text group-hover:underline">{venue.name}</h3>
        <p className="truncate text-sm text-brand-muted">{location}</p>
        <p className="pt-1 text-sm text-brand-text">
          <span className="font-semibold">₹{venue.pricePerHour}</span>
          <span className="text-brand-muted"> / hour</span>
        </p>
      </div>
    </Link>
  );
}
