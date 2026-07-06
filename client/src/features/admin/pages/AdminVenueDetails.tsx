import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminVenuesApi } from '../services/admin-venues.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import type { Venue, ApiResponse } from '@/features/venues/types/venues.types';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Users,
  IndianRupee,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  Crown,
  Star,
  Clock,
  Compass,
  FileText,
  CalendarRange,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const statusStyles: Record<string, string> = {
  pending: 'border-warning/20 bg-warning/10 text-warning',
  approved: 'border-success/20 bg-success/10 text-success',
  rejected: 'border-error/20 bg-error/10 text-error',
};

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AdminVenueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  const { data: fetchResponse, loading, execute: fetchVenue } = useAsyncFetch<ApiResponse<Venue>>();

  const venue = fetchResponse?.data;

  const loadVenue = () => {
    if (id) {
      fetchVenue(() => adminVenuesApi.getById(id));
    }
  };

  useEffect(() => {
    loadVenue();
  }, [id]);

  // Leaflet map initialization
  useEffect(() => {
    if (loading || !venue || !mapRef.current || mapInstance.current) return;

    const coordinates = venue.location?.coordinates;
    if (!coordinates || coordinates.length < 2) return;

    // Leaflet coordinates: [lat, lng] -> [coordinates[1], coordinates[0]]
    const latLng: L.LatLngExpression = [coordinates[1], coordinates[0]];

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView(latLng, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom pins styling matching primary palette
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div class="w-8 h-8 rounded-full bg-red-500 border-4 border-white flex items-center justify-center shadow-lg"><span class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    L.marker(latLng, { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<b style="font-family: inherit; font-size: 13px;">${venue.name}</b><br/><span style="font-size:11px; color:#71717a">${venue.address.city}</span>`
      )
      .openPopup();

    mapInstance.current = map;

    // Force redraw layout
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading, venue]);

  const handleApprove = async () => {
    if (!venue) return;
    setIsApproving(true);
    try {
      await adminVenuesApi.approve(venue._id);
      toast.success('Venue approved successfully');
      loadVenue();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve venue');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!venue || rejectionReason.trim().length < 10) {
      toast.error('Please provide a rejection reason (minimum 10 characters)');
      return;
    }
    setIsRejecting(true);
    try {
      await adminVenuesApi.reject(venue._id, rejectionReason.trim());
      toast.success('Venue rejected successfully');
      setShowRejectModal(false);
      setRejectionReason('');
      loadVenue();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject venue');
    } finally {
      setIsRejecting(false);
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
        <p className="text-sm text-muted mt-2">The venue you are looking for does not exist.</p>
        <Link
          to="/admin/venues"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-all"
        >
          <ChevronLeft size={16} /> Back to Venues
        </Link>
      </div>
    );
  }

    const categoryName =
    typeof venue.categoryId === 'string'
      ? venue.categoryId
      : venue.categoryId?.name || 'Uncategorized';
  const statusClass = statusStyles[venue.verificationStatus] || statusStyles.pending;
  // Owner info from populated field
  const ownerInfo = venue.ownerId as any;
  console.log(venue)

  const ownerName = ownerInfo && typeof ownerInfo === 'object' ? ownerInfo.fullName : 'Unknown';
  const ownerEmail = ownerInfo && typeof ownerInfo === 'object' ? ownerInfo.email : 'N/A';
  const ownerAvatar = ownerInfo && typeof ownerInfo === 'object' ? ownerInfo.avatar : null;

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

  const isDayAvailable = (dayIdx: number) => {
    return venue.availability?.availableDays.includes(dayIdx);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/venues')}
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
              <span
                className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass}`}
              >
                {venue.verificationStatus}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">{categoryName}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {venue.verificationStatus === 'pending' && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-error/20 bg-error/5
                  px-5 py-2.5 text-sm font-semibold text-error
                  hover:bg-error/10 transition-all active:scale-95 cursor-pointer
                "
              >
                <XCircle size={16} />
                Reject Listing
              </button>
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-white
                  hover:bg-success/90 transition-all active:scale-95 disabled:opacity-50 cursor-pointer
                "
              >
                {isApproving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Approve Listing
              </button>
            </>
          )}
          {venue.verificationStatus === 'approved' && (
            <button
              onClick={() => setShowRejectModal(true)}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl border border-error/20 bg-error/5
                px-5 py-2.5 text-sm font-semibold text-error
                hover:bg-error/10 transition-all active:scale-95 cursor-pointer
              "
            >
              <XCircle size={16} />
              Revoke & Reject
            </button>
          )}
          {venue.verificationStatus === 'rejected' && (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-white
                hover:bg-success/90 transition-all active:scale-95 disabled:opacity-50 cursor-pointer
              "
            >
              {isApproving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Approve Listing
            </button>
          )}
        </div>
      </div>

      {/* Rejection Reason Banner */}
      {venue.verificationStatus === 'rejected' && venue.rejectionReason && (
        <div className="flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 p-4">
          <AlertTriangle size={20} className="text-error mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-error">Venue Rejected</p>
            <p className="text-xs text-foreground mt-1">{venue.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Main Content Layout Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Image Gallery, Description, Amenities, Map */}
        <div className="lg:col-span-8 space-y-6">
          {/* Image Gallery */}
          {venue.images.length > 0 && (
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="relative h-[420px] bg-background">
                <img
                  src={venue.images[activeImageIndex]}
                  alt={`${venue.name} - Image ${activeImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white tracking-wider">
                  {activeImageIndex + 1} / {venue.images.length}
                </div>
              </div>
              {venue.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto border-t border-border">
                  {venue.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeImageIndex
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-border hover:border-muted'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <FileText size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Description
              </h2>
            </div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {venue.description}
            </p>
          </div>

          {/* Availability Details (New) */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <CalendarRange size={18} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Operating Availability & Rules
              </h2>
            </div>

            {venue.isAvailabilityConfigured && venue.availability ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Operating Hours
                    </span>
                    <span className="text-base font-extrabold text-foreground mt-1 flex items-center gap-1.5">
                      <Clock size={16} className="text-primary" />
                      {venue.availability.openingTime} - {venue.availability.closingTime}
                    </span>
                  </div>

                  <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Hourly Cost rate
                    </span>
                    <span className="text-base font-extrabold text-primary mt-1">
                      ₹{venue.availability.pricePerHour.toLocaleString()} / Hour
                    </span>
                  </div>

                  <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Booking Duration Rules
                    </span>
                    <span className="text-xs font-semibold text-foreground mt-1 space-y-0.5 block">
                      <span>• Min: {venue.availability.minBookingDuration} Hour(s)</span>
                      {venue.availability.maxBookingDuration && (
                        <span className="block">
                          • Max: {venue.availability.maxBookingDuration} Hours
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                      Buffer/Rest Interval
                    </span>
                    <span className="text-base font-extrabold text-foreground mt-1">
                      {venue.availability.bufferTime
                        ? `${venue.availability.bufferTime} Min`
                        : 'No buffer time'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Weekly Operating Days
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {weekdays.map((day, idx) => {
                      const active = isDayAvailable(idx);
                      return (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            active
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:bg-emerald-500/5'
                              : 'bg-zinc-100 dark:bg-zinc-800/40 border-border text-muted/50 line-through'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                <div className="text-xs text-yellow-800 dark:text-yellow-600 font-medium">
                  Operating rules and price rates have not been configured by the owner yet.
                  Defaults will apply.
                </div>
              </div>
            )}
          </div>

          {/* Interactive Geographic Map Location */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-primary" />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Geographical Coordinates
                </h2>
              </div>
              {venue.location?.coordinates && (
                <span className="text-[10px] font-mono text-muted bg-background border border-border px-2.5 py-1 rounded-lg">
                  Lat: {venue.location.coordinates[1].toFixed(5)}, Lng:{' '}
                  {venue.location.coordinates[0].toFixed(5)}
                </span>
              )}
            </div>

            {/* Map Anchor */}
            <div
              ref={mapRef}
              className="h-[320px] w-full rounded-xl overflow-hidden border border-border shadow-inner z-0"
            />
          </div>

          {/* Amenities */}
          {venue.amenities.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-border pb-3">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2pt-1">
                {venue.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-surface transition-all"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Widgets, Specifications, Owner info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Visibility / Status Flags (New Widget) */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-2.5">
              Visibility & Feature Flags
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-background border border-border p-3 rounded-xl">
                <span className="text-xs text-muted font-medium">Account Status</span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                    venue.isActive
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
                      : 'bg-zinc-500/10 border border-zinc-500/20 text-zinc-500'
                  }`}
                >
                  {venue.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-background border border-border p-3 rounded-xl">
                <span className="text-xs text-muted font-medium">Featured Space</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                    venue.isFeatured
                      ? 'bg-blue-500/10 border border-blue-500/20 text-blue-600'
                      : 'bg-zinc-500/10 border border-zinc-500/20 text-zinc-500'
                  }`}
                >
                  <Star size={10} className={venue.isFeatured ? 'fill-current' : ''} />
                  {venue.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-background border border-border p-3 rounded-xl">
                <span className="text-xs text-muted font-medium">Elite Selection</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                    venue.isElite
                      ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600'
                      : 'bg-zinc-500/10 border border-zinc-500/20 text-zinc-500'
                  }`}
                >
                  <Crown size={10} className={venue.isElite ? 'fill-current' : ''} />
                  {venue.isElite ? 'Elite' : 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Specifications Widget */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3.5">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-2.5">
              Specifications
            </h2>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs text-muted font-medium">
                  <Users size={14} /> Capacity
                </div>
                <span className="text-sm font-bold text-foreground">
                  {venue.capacity} guests max
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs text-muted font-medium">
                  <IndianRupee size={14} /> Base Pricing
                </div>
                <span className="text-sm font-bold text-foreground">
                  {venue.isAvailabilityConfigured && venue.availability
                    ? `₹${venue.availability.pricePerHour.toLocaleString()} / Hour`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs text-muted font-medium">
                  <Building2 size={14} /> Category
                </div>
                <span className="text-sm font-bold text-foreground">{categoryName}</span>
              </div>
            </div>
          </div>

          {/* Owner Info Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3.5 border-b border-border pb-2.5">
              Owner Profile
            </h2>
            <div className="flex items-center gap-3">
              {ownerAvatar ? (
                <img
                  src={ownerAvatar}
                  alt={ownerName}
                  className="h-11 w-11 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary border border-border font-extrabold">
                  {ownerName.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">{ownerName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Mail size={11} className="text-muted shrink-0" />
                  <p className="text-[10px] text-muted truncate">{ownerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Address Breakdown (New Widget) */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-2.5">
              Complete Location Address
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span className="text-muted">Street:</span>
                <span className="font-semibold text-foreground max-w-[200px] text-right">
                  {venue.address.street}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span className="text-muted">City:</span>
                <span className="font-semibold text-foreground">{venue.address.city}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span className="text-muted">District:</span>
                <span className="font-semibold text-foreground">{venue.address.district}</span>
              </div>
              <div className="flex justify-between border-b border-border/40 pb-1.5">
                <span className="text-muted">State:</span>
                <span className="font-semibold text-foreground">{venue.address.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Pincode:</span>
                <span className="font-semibold font-mono text-foreground">
                  {venue.address.pincode}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-2.5">
              Venue Timeline
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted">
                  <Calendar size={13} />
                  <span>Created:</span>
                </div>
                <span className="font-medium text-foreground">{formattedCreated}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted">
                  <Calendar size={13} />
                  <span>Updated:</span>
                </div>
                <span className="font-medium text-foreground">{formattedUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border p-6 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 mb-2">
              <XCircle className="h-6 w-6 text-error" />
            </div>
            <h3 className="text-lg font-bold text-foreground text-center">Reject Venue</h3>
            <p className="text-sm text-muted text-center">
              Please provide a reason for rejection so the owner can address the issues.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (minimum 10 characters)..."
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />

            <div className="flex items-center justify-between text-xs text-muted">
              <span>{rejectionReason.length}/500 characters</span>
              {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                <span className="text-error">Minimum 10 characters required</span>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={isRejecting}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || rejectionReason.trim().length < 10}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-error px-4 py-2.5 text-sm font-semibold text-white hover:bg-error/90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isRejecting ? <Loader2 size={16} className="animate-spin" /> : 'Reject Venue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVenueDetails;
