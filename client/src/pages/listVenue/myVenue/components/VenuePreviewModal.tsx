import { Link } from 'react-router';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useApiQuery } from '@/hooks/useApi';
import { API_ENDPOINTS } from '@/constants';
import type { MyVenue, VenueDetail } from '@/types/venue.types';
import {
  Clock,
  XCircle,
  ShieldOff,
  FileText,
  AlertTriangle,
  AlertCircle,
  MapPin,
  Users,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useState, useEffect } from 'react';

// Status banner config

interface StatusConfig {
  icon: React.ReactNode;
  accentClass: string; // border color
  bannerBg: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder?: string;
  title: string;
  message: string;
}

const getStatusConfig = (venue: MyVenue): StatusConfig => {
  const isDeadlinePassed =
    venue.currentEditDeadline && new Date() > new Date(venue.currentEditDeadline);

  switch (venue.status) {
    case 'PendingReview':
      return {
        icon: <Clock className="text-amber-600 dark:text-amber-400" size={18} />,
        accentClass: 'border-amber-200 dark:border-amber-900/50',
        bannerBg: 'bg-amber-50/50 dark:bg-amber-900/10',
        badgeBg: 'bg-amber-100 dark:bg-amber-900/30',
        badgeBorder: 'border-amber-200 dark:border-amber-800/50',
        badgeText: 'text-amber-700 dark:text-amber-400',
        title: 'Under Review',
        message:
          "Your venue is under review by our admin team. You'll be notified by email once a decision is made.",
      };
    case 'Rejected':
      return {
        icon: <XCircle className="text-red-600 dark:text-red-400" size={18} />,
        accentClass: 'border-red-200 dark:border-red-900/50',
        bannerBg: 'bg-red-50/50 dark:bg-red-900/10',
        badgeBg: 'bg-red-100 dark:bg-red-900/30',
        badgeBorder: 'border-red-200 dark:border-red-800/50',
        badgeText: 'text-red-700 dark:text-red-400',
        title: isDeadlinePassed ? 'Rejected — Deadline Passed' : 'Rejected',
        message: isDeadlinePassed
          ? 'The edit window has expired. This venue has been auto-suspended.'
          : 'Please address the feedback and resubmit before your deadline.',
      };
    case 'Suspended':
      return {
        icon: <ShieldOff className="text-red-600 dark:text-red-400" size={18} />,
        accentClass: 'border-red-200 dark:border-red-900/50',
        bannerBg: 'bg-red-50/50 dark:bg-red-900/10',
        badgeBg: 'bg-red-100 dark:bg-red-900/30',
        badgeBorder: 'border-red-200 dark:border-red-800/50',
        badgeText: 'text-red-700 dark:text-red-400',
        title: 'Suspended',
        message:
          'This venue is suspended and not publicly visible. Contact support if you believe this is an error.',
      };
    case 'Draft':
    default:
      return {
        icon: <FileText className="text-[var(--text-secondary)]" size={18} />,
        accentClass: 'border-[var(--bg-grey)]',
        bannerBg: 'bg-[var(--bg-primary)]',
        badgeBg: 'bg-[var(--bg-grey)]/40',
        badgeBorder: 'border-[var(--bg-grey)]',
        badgeText: 'text-[var(--text-secondary)]',
        title: 'Draft',
        message: 'Draft preview. Complete all required fields and submit for review.',
      };
  }
};

// Image strip
const CompactGallery = ({ images, venueName }: { images: string[]; venueName: string }) => {
  const [idx, setIdx] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[var(--bg-grey)] group">
      <img
        src={images[idx]}
        alt={`${venueName} photo ${idx + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      <span className="absolute bottom-2 right-3 text-xs text-white font-semibold bg-black/40 rounded-full px-2 py-0.5">
        {idx + 1} / {images.length}
      </span>

      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i === 0 ? images.length - 1 : i - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            aria-label="Previous image"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => setIdx((i) => (i === images.length - 1 ? 0 : i + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            aria-label="Next image"
          >
            <ChevronRight size={15} />
          </button>
        </>
      )}
    </div>
  );
};

// Venue detail chips
const DetailChip = ({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--bg-grey)] text-sm text-[var(--text-primary)] ${onClick ? 'cursor-pointer hover:border-[var(--bg-green)]/30 hover:shadow-sm transition-all' : ''} ${className || ''}`}
  >
    <span className="text-[var(--bg-green)] shrink-0">{icon}</span>
    <span className="font-medium truncate">{label}</span>
  </div>
);

//  Pricing View

const PricingView = ({ venue, onBack }: { venue: VenueDetail; onBack: () => void }) => {
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--bg-grey)]">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-grey)] transition-colors border border-[var(--bg-grey)]"
          aria-label="Back to main view"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-base font-bold text-[var(--text-primary)]">Pricing & Working Hours</h3>
      </div>

      <div className="space-y-5">
        {/* Working Hours */}
        {venue.workingHours && venue.workingDays && venue.workingDays.length > 0 && (
          <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--bg-grey)]">
            <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
              Working Hours
            </h4>
            <div className="flex items-center justify-between text-sm">
              <span
                className="font-medium text-[var(--text-primary)] line-clamp-1 mr-2"
                title={venue.workingDays.join(', ')}
              >
                {venue.workingDays.join(', ')}
              </span>
              <span className="px-2.5 py-1 shrink-0 rounded-lg bg-[var(--bg-green)]/10 text-[var(--bg-green)] font-semibold text-xs border border-[var(--bg-green)]/20">
                {venue.workingHours.open} - {venue.workingHours.close}
              </span>
            </div>
          </div>
        )}

        {/* Pricing Details */}
        <div>
          <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-3">
            {venue.bookingType === 'fixedBooking' ? 'Fixed Packages' : 'Flexible Pricing'}
          </h4>

          {venue.bookingType === 'fixedBooking' &&
          venue.fixedPackages &&
          venue.fixedPackages.length > 0 ? (
            <div className="space-y-2.5">
              {venue.fixedPackages.map((pkg, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-[var(--bg-grey)] bg-[var(--bg-primary)] flex justify-between items-center group hover:border-[var(--bg-green)]/30 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                      {pkg.slotName}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {pkg.startTime} - {pkg.endTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--bg-green)]">₹{pkg.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : venue.bookingType === 'flexibleBooking' && venue.pricing ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-[var(--bg-grey)] bg-[var(--bg-primary)] flex justify-between items-center">
                <span className="text-sm font-medium text-[var(--text-primary)]">Base Price</span>
                <span className="font-bold text-[var(--bg-green)]">
                  ₹{venue.pricing.basePrice}{' '}
                  {venue.pricing.pricingType === 'timeBasedPricing' ? '/ hr' : '/ day'}
                </span>
              </div>

              {venue.pricing.pricingType === 'timeBasedPricing' &&
                venue.pricing.pricingRules &&
                venue.pricing.pricingRules.length > 0 && (
                  <div className="overflow-hidden border border-[var(--bg-grey)] rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[var(--bg-grey)]/40 text-[var(--text-secondary)]">
                        <tr>
                          <th className="py-2 px-3 font-semibold">Time Window</th>
                          <th className="py-2 px-3 font-semibold text-right">Price / hr</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--bg-grey)] bg-[var(--bg-primary)]">
                        {venue.pricing.pricingRules.map((rule, i) => (
                          <tr key={i}>
                            <td className="py-2.5 px-3 font-medium text-[var(--text-primary)]">
                              {rule.fromTime} - {rule.toTime}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-[var(--bg-green)]">
                              ₹{rule.price}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)] italic bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--bg-grey)]">
              No pricing details configured.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton

const ModalSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <Skeleton className="w-full h-44 rounded-2xl" />
    <div className="grid grid-cols-2 gap-2">
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-10 rounded-xl" />
    </div>
    <Skeleton className="h-20 w-full rounded-xl" />
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-7 w-20 rounded-full" />
      ))}
    </div>
  </div>
);

// Rejection History Sub-View

const RejectionHistoryView = ({ myVenue, onBack }: { myVenue: MyVenue; onBack: () => void }) => {
  const history = myVenue.rejectionHistory || [];
  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--bg-grey)]">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg bg-[var(--bg-primary)] hover:bg-[var(--bg-grey)] transition-colors border border-[var(--bg-grey)]"
          aria-label="Back to main view"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          Rejection History ({history.length}/10)
        </h3>
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] italic">
            No rejection history available.
          </p>
        ) : (
          history
            .slice()
            .reverse()
            .map((entry, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--bg-grey)]"
              >
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2">
                  <span className="font-semibold">Attempt #{entry.submissionNumber}</span>
                  <span>Deadline: {format(new Date(entry.editDeadline), 'PPp')}</span>
                </div>
                {entry.extendedAt && (
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    Extended on {format(new Date(entry.extendedAt), 'PPp')}
                  </p>
                )}
                <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">
                  {entry.reason}
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

// Action button per status

const StatusAction = ({ venue }: { venue: MyVenue }) => {
  const isDeadlinePassed =
    venue.currentEditDeadline && new Date() > new Date(venue.currentEditDeadline);

  if (venue.status === 'Rejected' && !isDeadlinePassed && (venue.submissionCount ?? 0) < 10) {
    return (
      <Button
        size="sm"
        className="bg-[var(--bg-green)] text-white hover:bg-[var(--bg-green)]/90"
        asChild
      >
        <Link to={`/list-venue/edit-venue/${venue._id}`}>Edit & Resubmit</Link>
      </Button>
    );
  }
  if (venue.status === 'Draft') {
    return (
      <Button
        size="sm"
        className="bg-[var(--bg-green)] text-white hover:bg-[var(--bg-green)]/90"
        asChild
      >
        <Link to={`/list-venue/edit-venue/${venue._id}`}>Continue Editing</Link>
      </Button>
    );
  }
  if (venue.status === 'PendingReview') {
    return (
      <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400">
        ⏳ Awaiting review
      </span>
    );
  }
  return null;
};

// Main

interface VenuePreviewModalProps {
  venueId: string;
  myVenue: MyVenue;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VenuePreviewModal = ({ venueId, myVenue, open, onOpenChange }: VenuePreviewModalProps) => {
  const { data: venue, isLoading } = useApiQuery<VenueDetail>(
    ['venue-preview', venueId],
    { url: API_ENDPOINTS.VENUE_BY_ID(venueId), method: 'GET' },
    { enabled: open }
  );

  const [view, setView] = useState<'main' | 'pricing' | 'history'>('main');

  useEffect(() => {
    if (!open) {
      setTimeout(() => setView('main'), 300);
    }
  }, [open]);

  const statusConfig = getStatusConfig(myVenue);
  const isDeadlinePassed =
    myVenue.currentEditDeadline && new Date() > new Date(myVenue.currentEditDeadline);
  const daysLeft = myVenue.currentEditDeadline
    ? differenceInDays(new Date(myVenue.currentEditDeadline), new Date())
    : null;

  const images = venue?.coverImage
    ? [venue.coverImage, ...(venue.galleryImages ?? [])]
    : myVenue.coverImage
      ? [myVenue.coverImage]
      : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-lg w-[95vw]
          max-h-[88dvh]
          flex flex-col
          p-0 gap-0
          rounded-2xl overflow-hidden
          bg-[var(--bg-tertiary)]
          border border-[var(--bg-grey)]
          shadow-2xl
        "
        showCloseButton={false}
      >
        {/* Fixed Header (Status Banner) */}
        <div
          className={`shrink-0 px-5 pt-4 pb-3 border-b ${statusConfig.accentClass} ${statusConfig.bannerBg}`}
        >
          <DialogTitle className="sr-only">
            {myVenue.name} — {statusConfig.title}
          </DialogTitle>

          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${statusConfig.badgeBg} ${statusConfig.badgeBorder || 'border-transparent'}`}
            >
              {statusConfig.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusConfig.badgeBg} ${statusConfig.badgeBorder || 'border-transparent'} ${statusConfig.badgeText}`}
                >
                  {statusConfig.title}
                </span>
                <h2 className="text-base font-bold text-[var(--text-primary)] truncate">
                  {myVenue.name}
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                {statusConfig.message}
              </p>
            </div>
          </div>

          {/* Rejection deadline */}
          {myVenue.status === 'Rejected' && myVenue.currentEditDeadline && (
            <div
              className={`mt-3 flex items-center gap-2 text-xs rounded-lg px-3 py-2 border ${
                isDeadlinePassed
                  ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400'
                  : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400'
              }`}
            >
              {isDeadlinePassed ? (
                <AlertCircle size={13} className="shrink-0" />
              ) : (
                <AlertTriangle size={13} className="shrink-0" />
              )}
              <span className="font-medium">
                {isDeadlinePassed
                  ? 'Deadline passed'
                  : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
              </span>
              <span className="text-[var(--text-secondary)]">·</span>
              <span>{format(new Date(myVenue.currentEditDeadline), 'dd MMM yyyy')}</span>
            </div>
          )}

          {/* Suspension reason */}
          {myVenue.status === 'Suspended' && myVenue.suspensionReason && (
            <div className="mt-3 flex items-start gap-2 text-xs rounded-lg px-3 py-2 border bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400">
              <ShieldOff size={13} className="mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold">Reason: </span>
                {myVenue.suspensionReason}
              </span>
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4 relative">
          {isLoading ? (
            <ModalSkeleton />
          ) : view === 'pricing' && venue ? (
            <PricingView venue={venue} onBack={() => setView('main')} />
          ) : view === 'history' ? (
            <RejectionHistoryView myVenue={myVenue} onBack={() => setView('main')} />
          ) : venue ? (
            <div className="animate-in slide-in-from-left-4 duration-300 space-y-4">
              {/* Compact image strip */}
              {images.length > 0 && <CompactGallery images={images} venueName={venue.name} />}

              {/* Quick detail chips */}
              <div className="grid grid-cols-2 gap-2">
                <DetailChip icon={<Tag size={14} />} label={venue.venueType} />
                {venue.city && (
                  <DetailChip
                    icon={<MapPin size={14} />}
                    label={`${venue.city}, ${venue.district}`}
                  />
                )}
                {venue.maxCapacity && (
                  <DetailChip
                    icon={<Users size={14} />}
                    label={`Up to ${venue.maxCapacity} guests`}
                  />
                )}
                {venue.bookingType && (
                  <DetailChip
                    icon={<Layers size={14} />}
                    label={
                      venue.bookingType === 'fixedBooking' ? 'Fixed Packages' : 'Flexible Slots'
                    }
                    onClick={() => setView('pricing')}
                  />
                )}
              </div>

              {/* Description */}
              {venue.description && (
                <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--bg-grey)]">
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                    About
                  </p>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed line-clamp-4">
                    {venue.description}
                  </p>
                </div>
              )}

              {/* Address */}
              {venue.address && (
                <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-[var(--bg-green)]" />
                  <span>
                    {venue.address}, {venue.pincode}
                  </span>
                </div>
              )}

              {/* Amenities */}
              {venue.amenities && venue.amenities.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                    Amenities
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {venue.amenities.slice(0, 10).map((a, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs rounded-full bg-[var(--bg-green)]/10 text-[var(--bg-green)] border border-[var(--bg-green)]/20 font-medium"
                      >
                        {a}
                      </span>
                    ))}
                    {venue.amenities.length > 10 && (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-[var(--bg-grey)]/60 text-[var(--text-secondary)] font-medium">
                        +{venue.amenities.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Space attributes */}
              {venue.spaceAttributes && venue.spaceAttributes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                    Space Type
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {venue.spaceAttributes.map((a, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs rounded-full bg-[var(--bg-grey)]/60 text-[var(--text-primary)] border border-[var(--bg-grey)] font-medium"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {myVenue.rejectionHistory && myVenue.rejectionHistory.length > 0 && (
                <div
                  onClick={() => setView('history')}
                  className="flex items-center justify-between cursor-pointer pt-3 border-t border-[var(--bg-grey)] group"
                >
                  <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--bg-green)] transition-colors">
                    Rejection Histories ({myVenue.rejectionHistory.length}/10)
                  </p>
                  <ChevronRight
                    size={16}
                    className="text-[var(--text-secondary)] group-hover:text-[var(--bg-green)] transition-colors"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-[var(--text-secondary)]">
              <p className="text-sm">Could not load venue details.</p>
              <p className="text-xs mt-1">
                {myVenue.venueType} · {myVenue.city}
              </p>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-[var(--bg-grey)] bg-[var(--bg-tertiary)] flex items-center justify-between gap-3">
          <p className="text-[10px] text-[var(--text-secondary)] leading-tight">
            Private owner preview · not publicly visible
          </p>
          <div className="flex items-center gap-2">
            <StatusAction venue={myVenue} />
            <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenuePreviewModal;
