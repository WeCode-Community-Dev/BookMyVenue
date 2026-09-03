import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { DASHBOARD_URL } from '@/constants';
import type { MyVenue } from '@/types/venue.types';
import { MdOutlineLocationOn } from 'react-icons/md';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { RejectionHistoryModal } from '@/components/explore/RejectionHistoryModal';
import VenuePreviewModal from './VenuePreviewModal';

interface VenueCardProps {
  venue: MyVenue;
}

const getStatusBadge = (status: MyVenue['status']) => {
  switch (status) {
    case 'Draft':
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-grey)]/40 text-[var(--text-secondary)] border border-[var(--bg-grey)]">
          Draft
        </span>
      );
    case 'PendingReview':
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          Under Review
        </span>
      );
    case 'Approved':
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
          Approved
        </span>
      );
    case 'Rejected':
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
          Rejected
        </span>
      );
    case 'Suspended':
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
          Suspended
        </span>
      );
    default:
      return null;
  }
};

const getPreviewButtonLabel = (status: MyVenue['status']): string => {
  switch (status) {
    case 'PendingReview':
      return 'View Submission';
    case 'Rejected':
      return 'View Submission';
    case 'Suspended':
      return 'View Details';
    case 'Draft':
      return 'Preview';
    default:
      return 'View Details';
  }
};

const VenueCard = ({ venue }: VenueCardProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const isDeadlinePassed =
    venue.currentEditDeadline && new Date() > new Date(venue.currentEditDeadline);
  const daysLeft = venue.currentEditDeadline
    ? differenceInDays(new Date(venue.currentEditDeadline), new Date())
    : null;

  const isApproved = venue.status === 'Approved';

  const latestReason =
    venue.rejectionReason ??
    venue.rejectionHistory?.[venue.rejectionHistory.length - 1]?.reason ??
    '';
  const truncatedReason =
    latestReason.length > 10 ? latestReason.slice(0, 10) + '…' : latestReason || 'N/A';

  return (
    <>
      <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--bg-grey)] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
        <div className="relative h-48 w-full bg-[var(--bg-grey)]">
          {venue.coverImage ? (
            <img src={venue.coverImage} alt={venue.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
              No Image
            </div>
          )}
          <div className="absolute top-3 right-3">{getStatusBadge(venue.status)}</div>
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
              {venue.venueType || 'Venue'}
            </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1 truncate flex items-center gap-1.5">
            {venue.name}
            {venue.isFeatured && (
              <span className="text-amber-500 shrink-0" title="Featured venue">
                &#9733;
              </span>
            )}
          </h3>

          <div className="flex items-center text-[var(--text-secondary)] text-sm mb-4">
            <MdOutlineLocationOn className="mr-1 text-lg" />
            <span className="truncate">
              {venue.city}, {venue.district ? `${venue.district}, ` : ''}
              {venue.state}
            </span>
          </div>

          {venue.status === 'Rejected' &&
            venue.rejectionHistory &&
            venue.rejectionHistory.length > 0 && (
              <button
                onClick={() => setHistoryOpen(true)}
                className="mb-2 w-full flex items-center justify-between gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-xs hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
              >
                <span className="text-red-700 dark:text-red-300 truncate min-w-0">
                  <span className="font-semibold">Rejected:</span> {truncatedReason}
                </span>
                <span className="text-red-500 font-semibold shrink-0 ml-1">
                  History ({venue.rejectionHistory.length})
                </span>
              </button>
            )}

          {venue.status === 'Rejected' && venue.currentEditDeadline && (
            <div
              className={`mb-2 flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5 border ${
                isDeadlinePassed
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900'
              }`}
            >
              {isDeadlinePassed ? (
                <AlertCircle size={12} className="shrink-0" />
              ) : (
                <AlertTriangle size={12} className="shrink-0" />
              )}
              <span className="font-medium">
                {isDeadlinePassed
                  ? 'Deadline passed'
                  : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
              </span>
              {!isDeadlinePassed && (
                <span className="opacity-60">
                  · {format(new Date(venue.currentEditDeadline), 'PP')}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto pt-4 flex gap-3">
            {/* View Details / Submission button — Approved links to public page, others open modal */}
            {isApproved ? (
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/venue/${venue._id}`}>View Details</Link>
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" onClick={() => setPreviewOpen(true)}>
                {getPreviewButtonLabel(venue.status)}
              </Button>
            )}

            {venue.status === 'Approved' && (
              <Button
                className="flex-1 bg-[var(--bg-green)] text-white hover:bg-[var(--bg-green)]/90"
                asChild
              >
                <a
                  href={`${DASHBOARD_URL}/dashboard/venue/${venue._id}/reports`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Dashboard
                </a>
              </Button>
            )}

            {venue.status === 'Rejected' &&
              !isDeadlinePassed &&
              venue.submissionCount &&
              venue.submissionCount < 10 && (
                <Button
                  className="flex-1 bg-[var(--bg-green)] text-white hover:bg-[var(--bg-green)]/90"
                  asChild
                >
                  <Link to={`/list-venue/edit-venue/${venue._id}`}>Edit & Resubmit</Link>
                </Button>
              )}

            {venue.status === 'Rejected' &&
              venue.submissionCount &&
              venue.submissionCount >= 10 && (
                <p className="flex-1 text-center text-sm text-red-500 py-2">
                  Max retries (10) exceeded
                </p>
              )}
          </div>
        </div>
      </div>

      {/* Preview modal — only mounted for non-Approved venues */}
      {!isApproved && (
        <VenuePreviewModal
          venueId={venue._id}
          myVenue={venue}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      )}

      <RejectionHistoryModal
        rejectionHistory={venue.rejectionHistory || []}
        rejectionCount={venue.rejectionHistory?.length ?? 0}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </>
  );
};

export default VenueCard;
