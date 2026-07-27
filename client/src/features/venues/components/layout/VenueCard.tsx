import { MapPin, Users, IndianRupee, Eye, Pencil, Calendar, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Venue } from '../../types/venues.types';
import { useAppStore } from '@/store/app.store';

type Props = {
  venue: Venue;
  onEdit: (venue: Venue) => void;
};

const statusStyles: Record<string, string> = {
  pending: 'border-warning/30 bg-warning/10 text-warning',
  approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  rejected: 'border-error/30 bg-error/10 text-error',
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
  const price = venue.availability?.pricePerHour ?? venue.pricing?.amount ?? 0;

  return (
    <div className="group rounded-3xl border border-border/60 bg-card p-3.5 space-y-4 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Media Header */}
      <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-black/40">
        {venue.images && venue.images.length > 0 ? (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/40">
            <Building2 size={40} className="stroke-[1.2]" />
          </div>
        )}

        {/* Category Pill */}
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] font-extrabold text-white uppercase tracking-wider shadow-md">
          {categoryName}
        </span>

        {/* Verification Status Badge */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center rounded-full border backdrop-blur-md px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider shadow-md ${statusClass}`}
        >
          {venue.verificationStatus}
        </span>
      </div>

      {/* Content Section */}
      <div className="px-1 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-foreground tracking-tight truncate">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <MapPin size={14} className="shrink-0 text-primary" />
            <span className="truncate">
              {venue.address.city}, {venue.address.state}
            </span>
          </div>
        </div>

        {/* Capacity & Price Row */}
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-2 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-primary" />
            <span>{venue.capacity} Capacity</span>
          </div>

          <div className="flex items-center gap-1 text-foreground font-bold">
            <IndianRupee size={13} className="text-primary" />
            <span>{price > 0 ? `₹${price}/hr` : 'Not set'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => navigate(`/owner/venues/${venue._id}`)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/50 bg-background py-2.5 text-xs font-bold text-foreground hover:bg-surface transition-all active:scale-95 cursor-pointer shadow-2xs"
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
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 py-2.5 text-xs font-bold text-primary transition-all ${
              !isApproved
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary/20 active:scale-95 cursor-pointer'
            }`}
          >
            <Pencil size={14} />
            Edit
          </button>

          {venue.verificationStatus === 'approved' && (
            <button
              onClick={() => navigate(`/owner/venues/${venue._id}/availability`)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary/10 border border-secondary/20 py-2.5 text-xs font-bold text-secondary hover:bg-secondary/20 active:scale-95 cursor-pointer"
            >
              <Calendar size={14} />
              Hours
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
