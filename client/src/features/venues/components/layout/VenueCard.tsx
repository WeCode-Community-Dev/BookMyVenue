import { MapPin, Users, IndianRupee, Eye, Pencil, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Venue } from '../../types/venues.types';
import { useAppStore } from '@/store/app.store';

type Props = {
  venue: Venue;
  onEdit: (venue: Venue) => void;
};

const statusStyles: Record<string, string> = {
  pending: 'border-warning/20 bg-warning/10 text-warning',
  approved: 'border-success/20 bg-success/10 text-success',
  rejected: 'border-error/20 bg-error/10 text-error',
};

const VenueCard = ({ venue, onEdit }: Props) => {
  const navigate = useNavigate();
  const owner = useAppStore((state) => state.owner);
  const isApproved = owner?.verificationStatus === 'approved';

  const categoryName =
    venue.categoryId && typeof venue.categoryId === 'object'
      ? venue.categoryId.name
      : 'Uncategorized';

  const statusClass = statusStyles[venue.verificationStatus] || statusStyles.pending;

  return (
    <div className="group rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative h-44 overflow-hidden bg-background">
        {venue.images.length > 0 ? (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <MapPin size={32} className="stroke-[1.2]" />
          </div>
        )}

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
        >
          {venue.verificationStatus}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title + Category */}
        <div>
          <h3 className="text-base font-bold text-foreground truncate">{venue.name}</h3>
          <p className="text-xs text-muted mt-0.5">{categoryName}</p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">
            {venue.address.city}, {venue.address.state}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-xs text-foreground">
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-muted" />
            <span className="font-semibold">{venue.capacity}</span>
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee size={13} className="text-muted" />
            <span className="font-semibold">
              {venue.isAvailabilityConfigured && venue.availability
                ? `₹${venue.availability.pricePerHour}/hr`
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <button
            onClick={() => navigate(`/owner/venues/${venue._id}`)}
            className="
              flex-1 inline-flex items-center justify-center gap-1.5
              rounded-lg border border-border bg-background
              py-2 text-xs font-semibold text-foreground
              hover:bg-surface transition-all active:scale-95 cursor-pointer
            "
          >
            <Eye size={14} />
            View
          </button>
          <button
            onClick={() => onEdit(venue)}
            disabled={!isApproved}
            title={
              !isApproved
                ? 'You must complete your verification onboarding before editing venues.'
                : ''
            }
            className={`
              flex-1 inline-flex items-center justify-center gap-1.5
              rounded-lg bg-primary/10 border border-primary/20
              py-2 text-xs font-semibold text-primary
              transition-all
              ${!isApproved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/20 active:scale-95 cursor-pointer'}
            `}
          >
            <Pencil size={14} />
            Edit
          </button>

          {venue.verificationStatus === 'approved' && (
            <button
              onClick={() => navigate(`/owner/venues/${venue._id}/availability`)}
              className="
                flex-1 inline-flex items-center justify-center gap-1.5
                rounded-lg bg-secondary/10 border border-secondary/20
                py-2 text-xs font-semibold text-secondary
                hover:bg-secondary/20 active:scale-95 cursor-pointer
              "
            >
              <Calendar size={14} />
              Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
