import { useState } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RejectionHistoryDialog } from "@/components/venues/RejectionHistoryDialog";
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Info,
  Banknote,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface RejectionEntry {
  reason: string;
  rejectedAt: string;
  rejectedBy?: string;
  submissionNumber: number;
  editDeadline: string;
  extendedAt?: string;
  extendedBy?: string;
  originalDeadline?: string;
}

interface VenueData {
  status?: string;
  suspensionReason?: string;
  rejectionReason?: string;
  rejectionHistory?: RejectionEntry[];
  submissionCount?: number;
  active?: boolean;
  name?: string;
  venueType?: string;
  bookingType?: string;
  coverImage?: string;
  galleryImages?: string[];
  capacity?: number;
  maxCapacity?: number;
  city?: string;
  district?: string;
  address?: string;
  pincode?: string;
  pricing?: {
    pricingType?: string;
    basePrice?: number;
    pricePerHour?: number;
    pricePerDay?: number;
    pricingRules?: { fromTime: string; toTime: string; price: number }[];
  };
  fixedPackages?: {
    name?: string;
    slotName?: string;
    startTime: string;
    endTime: string;
    price: number;
  }[];
  amenities?: string[];
  description?: string;
  contact?: { name: string; phone: string; email: string };
  workingDays?: string[];
  createdAt?: string;
  updatedAt?: string;
  lastSubmittedAt?: string;
  currentEditDeadline?: string;
  avgRating?: number;
  reviewCount?: number;
  [key: string]: unknown;
}

export function VenueDetailPanel({
  data: rawData,
}: {
  data: Record<string, unknown>;
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const data = rawData as unknown as VenueData;
  if (!data) return null;

  const allImages = [data.coverImage, ...(data.galleryImages || [])].filter(
    Boolean,
  ) as string[];

  const handleOpenGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1,
    );
  };

  const pricingRules = data.pricing?.pricingRules;
  const fixedPackages = data.fixedPackages;

  const hasStatusAlerts =
    (data.status === "Rejected" && data.rejectionReason) ||
    (data.status === "Suspended" && data.suspensionReason);

  return (
    <div className="space-y-6 text-sm relative pb-10">
      {/* 1. Hero Cover Image */}
      {data.coverImage && (
        <button
          onClick={() => handleOpenGallery(0)}
          className="w-full h-56 md:h-72 rounded-xl overflow-hidden relative shadow-sm border border-border group cursor-pointer text-left block"
        >
          <img
            src={data.coverImage}
            alt={data.name || "Cover Image"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:bg-black/10 transition-colors duration-300" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              className="text-xs px-2.5 py-0.5"
              variant={
                data.status === "Approved"
                  ? "default"
                  : data.status === "Rejected"
                    ? "destructive"
                    : "secondary"
              }
            >
              {data.status}
            </Badge>
            {data.active === false && (
              <Badge
                variant="outline"
                className="bg-background text-muted-foreground"
              >
                Deactivated
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-white shadow-sm">
                {data.name}
              </h2>
              <p className="text-white/90 text-sm flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {data.city}, {data.district}
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white flex flex-col items-end">
              <span className="text-xs text-white/80 uppercase tracking-wider font-semibold mb-0.5">
                Capacity
              </span>
              <span className="font-medium text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4" />{" "}
                {data.maxCapacity || data.capacity || "N/A"}
              </span>
            </div>
          </div>
        </button>
      )}

      {/* 2. Gallery Strip */}
      {data.galleryImages && data.galleryImages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Gallery Photos{" "}
              <Badge variant="secondary" className="px-1.5 py-0 rounded-full">
                {data.galleryImages.length}
              </Badge>
            </span>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {data.galleryImages.map((url: string, i: number) => (
              <button
                key={i}
                onClick={() => handleOpenGallery(i + 1)}
                className="flex-none snap-start group relative rounded-lg overflow-hidden border border-border h-24 w-36 hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
              >
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Status Alerts */}
      {hasStatusAlerts && (
        <div className="space-y-3">
          {data.status === "Rejected" && data.rejectionReason && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3 items-start">
              <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive mb-1">
                  Rejection Reason
                </h4>
                <p className="text-destructive/90 text-sm leading-relaxed">
                  {data.rejectionReason}
                </p>
              </div>
            </div>
          )}
          {data.status === "Suspended" && data.suspensionReason && (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-700 mb-1">
                  Suspension Reason
                </h4>
                <p className="text-amber-700/90 text-sm leading-relaxed">
                  {data.suspensionReason}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Rejection History Bar */}
      {data.rejectionHistory && data.rejectionHistory.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 text-destructive font-semibold text-xs">
              {data.rejectionHistory.length}
            </span>
            <span className="text-sm font-medium">Previous Rejections</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHistoryOpen(true)}
          >
            View History
          </Button>
        </div>
      )}

      {data.rejectionHistory && data.rejectionHistory.length > 0 && (
        <RejectionHistoryDialog
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          rejectionHistory={data.rejectionHistory}
          rejectionCount={data.rejectionHistory.length}
        />
      )}

      {/* 5. Two-column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Core Details */}
        <Card className="p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Info className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Core Details</h3>
          </div>
          <dl className="space-y-2.5">
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="font-medium capitalize">
                {data.venueType || "—"}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">Booking Mode</dt>
              <dd className="font-medium">
                {data.bookingType === "fixedBooking"
                  ? "Fixed Slots"
                  : "Flexible Time"}
              </dd>
            </div>
            {data.workingDays && data.workingDays.length > 0 && (
              <div className="flex justify-between items-start pt-1 border-t border-border/50">
                <dt className="text-muted-foreground mt-0.5">Operating Days</dt>
                <dd className="flex gap-1 flex-wrap justify-end pl-4">
                  {data.workingDays.map((day) => (
                    <Badge
                      key={day}
                      variant="secondary"
                      className="text-[10px] uppercase"
                    >
                      {day.slice(0, 3)}
                    </Badge>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </Card>

        {/* Location */}
        <Card className="p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Location</h3>
          </div>
          <dl className="space-y-2.5">
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">City</dt>
              <dd className="font-medium">{data.city || "—"}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">District</dt>
              <dd className="font-medium">{data.district || "—"}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">PIN Code</dt>
              <dd className="font-medium">{data.pincode || "—"}</dd>
            </div>
            <div className="flex justify-between items-start pt-1 border-t border-border/50">
              <dt className="text-muted-foreground mt-0.5 w-20 shrink-0">
                Address
              </dt>
              <dd className="text-right leading-tight">
                {data.address || "—"}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* 6. Pricing & Packages */}
      <Card className="p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Banknote className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Pricing Structure</h3>
        </div>

        {data.bookingType === "fixedBooking" &&
        fixedPackages &&
        fixedPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {fixedPackages.map((pkg, i) => (
              <div
                key={i}
                className="bg-secondary/30 rounded-lg p-3 border border-border flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm">
                    {pkg.slotName || pkg.name || `Slot ${i + 1}`}
                  </span>
                  <Badge
                    variant="default"
                    className="bg-green-600/10 text-green-700 hover:bg-green-600/20 border-0"
                  >
                    ₹{pkg.price}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background rounded-md px-2 py-1.5 border border-border/50">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {pkg.startTime} - {pkg.endTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {data.pricing && (
              <div className="flex gap-4">
                <div className="bg-secondary/30 px-4 py-2 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Pricing Type
                  </p>
                  <p className="font-medium capitalize">
                    {data.pricing.pricingType || "—"}
                  </p>
                </div>
                <div className="bg-secondary/30 px-4 py-2 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Base Price
                  </p>
                  <p className="font-semibold text-primary">
                    ₹{data.pricing.basePrice || "0"}
                  </p>
                </div>
              </div>
            )}

            {pricingRules && pricingRules.length > 0 && (
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-medium border-b border-border">
                        Time Range
                      </th>
                      <th className="px-4 py-2.5 font-medium border-b border-border text-right">
                        Price Modifier
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pricingRules.map((rule, i) => (
                      <tr key={i} className="hover:bg-secondary/10">
                        <td className="px-4 py-2 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {rule.fromTime} - {rule.toTime}
                        </td>
                        <td className="px-4 py-2 font-medium text-right text-amber-700">
                          ₹{rule.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 7. Amenities & Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Amenities</h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.amenities && data.amenities.length > 0 ? (
              data.amenities.map((am: string, i: number) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 px-2.5 py-1"
                >
                  {am}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground italic text-sm">
                No amenities listed
              </span>
            )}
          </div>
        </Card>

        <Card className="p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <User className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Primary Contact</h3>
          </div>
          {data.contact ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="font-medium">{data.contact.name}</span>
              </div>
              <div className="flex items-center gap-3 pl-1 text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                <a
                  href={`mailto:${data.contact.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {data.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3 pl-1 text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                <a
                  href={`tel:${data.contact.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {data.contact.phone}
                </a>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground italic">
              No contact details
            </span>
          )}
        </Card>
      </div>

      {/* 8. Description */}
      {data.description && (
        <Card className="p-5 shadow-sm space-y-3 bg-secondary/20">
          <h3 className="font-semibold text-foreground">Description</h3>
          <div className="relative">
            <p
              className={`text-muted-foreground leading-relaxed whitespace-pre-wrap ${!isDescExpanded ? "line-clamp-4" : ""}`}
            >
              {data.description}
            </p>
            {data.description.length > 250 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-primary hover:underline text-xs font-medium mt-2 focus:outline-none"
              >
                {isDescExpanded ? "Show less" : "Read full description"}
              </button>
            )}
          </div>
        </Card>
      )}

      {/* 9. Metadata Footer */}
      <div className="border-t border-border mt-8 pt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground px-2">
        {data.createdAt && (
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>
              Created: {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}
        {data.updatedAt && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Updated: {new Date(data.updatedAt).toLocaleDateString()}
            </span>
          </div>
        )}
        {data.submissionCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Submissions: {data.submissionCount}/10</span>
          </div>
        )}
        {data.avgRating !== undefined && (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-amber-500">★</span>
            <span className="font-medium text-foreground">
              {data.avgRating.toFixed(1)}
            </span>
            <span>({data.reviewCount || 0} reviews)</span>
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      {galleryOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              setGalleryOpen(false);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div
              className="flex flex-col items-center justify-center w-full h-full px-4 py-4 sm:py-6 relative"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setGalleryOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close gallery"
              >
                <X size={24} />
              </button>

              <div className="flex-1 flex items-center justify-center max-w-4xl max-h-[calc(100vh-160px)] w-full">
                {allImages.length > 0 && (
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`Gallery view ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                )}
              </div>

              <div className="mt-4 text-center text-white text-sm font-semibold">
                {currentImageIndex + 1} / {allImages.length}
              </div>

              <div className="flex items-center gap-4 mt-6 sm:mt-8">
                <button
                  onClick={handlePrevImage}
                  className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2 overflow-x-auto max-w-[calc(100vw-200px)] sm:max-w-none px-2 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                        idx === currentImageIndex
                          ? "border-white/80 scale-110"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextImage}
                  className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
