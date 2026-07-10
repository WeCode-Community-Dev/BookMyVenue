import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ownerVenuesApi } from '../services/owner-venues.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import type { Venue, ApiResponse } from '../types/venues.types';
import VenueFormModal from '../components/ui/VenueFormModal';
import { toast } from 'sonner';
import { useAppStore } from '@/store/app.store';
import {
  ChevronLeft,
  Pencil,
  MapPin,
  Users,
  IndianRupee,
  Calendar,
  AlertTriangle,
  Trash2,
  ArchiveRestore,
  Loader2,
  Building2,
} from 'lucide-react';

const statusStyles: Record<string, string> = {
  pending: 'border-warning/20 bg-warning/10 text-warning',
  approved: 'border-success/20 bg-success/10 text-success',
  rejected: 'border-error/20 bg-error/10 text-error',
};

const OwnerVenueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const owner = useAppStore((state) => state.owner);
  const isApproved = owner?.verificationStatus === 'approved';

  const { data: fetchResponse, loading, execute: fetchVenue } = useAsyncFetch<ApiResponse<Venue>>();

  const venue = fetchResponse?.data;

  const loadVenue = () => {
    if (id) {
      fetchVenue(() => ownerVenuesApi.getById(id));
    }
  };

  useEffect(() => {
    loadVenue();
  }, [id]);

  const handleDelete = async () => {
    if (!venue) return;
    setIsDeleting(true);
    try {
      await ownerVenuesApi.softDelete(venue._id);
      toast.success('Venue archived successfully');
      navigate('/owner/venues');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to archive venue');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleRestore = async () => {
    if (!venue) return;
    setIsRestoring(true);
    try {
      await ownerVenuesApi.restore(venue._id);
      toast.success('Venue restored successfully');
      loadVenue();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to restore venue');
    } finally {
      setIsRestoring(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-error/10 border border-error/20 p-4 text-error mb-4">
          <Building2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Venue Not Found</h2>
        <p className="text-sm text-muted mt-2">
          The venue you are looking for does not exist or you don't have access.
        </p>
        <Link
          to="/owner/venues"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-all"
        >
          <ChevronLeft size={16} /> Back to Venues
        </Link>
      </div>
    );
  }

  const categoryName =
    venue.categoryId && typeof venue.categoryId === 'object'
      ? venue.categoryId.name
      : venue.categoryId || 'Uncategorized';
  const statusClass = statusStyles[venue.verificationStatus] || statusStyles.pending;

  const formattedCreated = venue.createdAt
    ? new Date(venue.createdAt).toLocaleString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const formattedUpdated = venue.updatedAt
    ? new Date(venue.updatedAt).toLocaleString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/owner/venues')}
            className="rounded-xl border border-border bg-background p-2.5 text-muted hover:text-foreground transition-all hover:bg-surface active:scale-95 cursor-pointer"
            title="Back to Venues"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {venue.name}
              </h1>
              {venue.isDeleted ? (
                <span className="inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize border-error/20 bg-error/10 text-error">
                  Archived
                </span>
              ) : (
                <span
                  className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass}`}
                >
                  {venue.verificationStatus}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">{categoryName}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {venue.isDeleted ? (
            <button
              onClick={handleRestore}
              disabled={isRestoring || !isApproved}
              title={
                !isApproved
                  ? 'You must complete your verification onboarding before restoring venues.'
                  : ''
              }
              className={`
                inline-flex items-center justify-center gap-2
                rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white
                transition-all
                ${!isApproved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent active:scale-95'}
              `}
            >
              {isRestoring ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ArchiveRestore size={16} />
              )}
              Restore Venue
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={!isApproved}
                title={
                  !isApproved
                    ? 'You must complete your verification onboarding before deleting venues.'
                    : ''
                }
                className={`
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-error/20 bg-error/5
                  px-4 py-2.5 text-sm font-semibold text-error
                  transition-all
                  ${!isApproved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-error/10 active:scale-95'}
                `}
              >
                <Trash2 size={16} />
                Delete
              </button>
              <button
                onClick={() => setModalOpen(true)}
                disabled={!isApproved}
                title={
                  !isApproved
                    ? 'You must complete your verification onboarding before editing venues.'
                    : ''
                }
                className={`
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-border bg-background
                  px-4 py-2.5 text-sm font-semibold text-foreground
                  transition-all
                  ${!isApproved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface active:scale-95'}
                `}
              >
                <Pencil size={16} />
                Edit Venue
              </button>
            </>
          )}
        </div>
      </div>

      {/* Rejection Reason */}
      {venue.verificationStatus === 'rejected' && venue.rejectionReason && (
        <div className="flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 p-4">
          <AlertTriangle size={20} className="text-error mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-error">Venue Rejected</p>
            <p className="text-xs text-foreground mt-1">{venue.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Description
            </h3>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {venue.description || 'No description provided.'}
            </p>
          </div>

          {/* Address & Location */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Address & Location
            </h3>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-background border border-border p-2 text-muted">
                <MapPin size={18} />
              </div>
              <div className="text-sm text-foreground">
                <p>{venue.address.street}</p>
                <p>
                  {venue.address.city}, {venue.address.district}
                </p>
                <p>
                  {venue.address.state} - {venue.address.pincode}
                </p>
              </div>
            </div>
            {venue.location?.coordinates && (
              <p className="text-[10px] text-muted">
                Coordinates: {venue.location.coordinates[1]}, {venue.location.coordinates[0]}
              </p>
            )}
          </div>

          {/* Capacity & Pricing */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Capacity & Pricing
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Users size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Max Capacity
                  </span>
                  <span className="text-sm font-bold text-foreground">{venue.capacity} guests</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <IndianRupee size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Pricing
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {venue.isAvailabilityConfigured && venue.availability
                      ? `₹${venue.availability.pricePerHour.toLocaleString()} / hour`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {venue.amenities.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((amenity, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-background border border-border px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              System Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Created At
                  </span>
                  <span className="text-xs font-semibold text-foreground">{formattedCreated}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Last Modified
                  </span>
                  <span className="text-xs font-semibold text-foreground">{formattedUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Images */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Venue Images
          </h3>

          {venue.images.length > 0 ? (
            <div className="space-y-3 flex-1">
              {/* Active Image */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface min-h-[260px] max-h-[360px]">
                <img
                  src={venue.images[activeImageIndex]}
                  alt={`${venue.name} - Image ${activeImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {venue.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {venue.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActiveImageIndex(i)}
                      className={`
                        shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer
                        ${
                          i === activeImageIndex
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border hover:border-muted'
                        }
                      `}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
              <Building2 className="h-10 w-10 text-muted stroke-[1.2]" />
              <span className="text-xs text-muted mt-2">No images uploaded</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && (
        <VenueFormModal venue={venue} onClose={() => setModalOpen(false)} onSuccess={loadVenue} />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 mb-2">
              <AlertTriangle className="h-6 w-6 text-error" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Delete Venue?</h3>
            <p className="text-sm text-muted">
              Are you sure you want to delete this venue? It will be moved to your Archived tab
              where you can restore it later if needed.
            </p>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-error px-4 py-2.5 text-sm font-semibold text-white hover:bg-error/90 transition-all disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerVenueDetails;
