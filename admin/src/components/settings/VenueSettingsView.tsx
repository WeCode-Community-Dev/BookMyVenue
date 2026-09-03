import { useState } from "react";
import { createPortal } from "react-dom";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Banknote,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { Venue } from "@/types";

interface ExtendedVenue extends Venue {
  coverImage?: string;
  galleryImages?: string[];
  bookingType?: string;
  district?: string;
  address?: string;
  pincode?: string;
  capacity?: number;
  amenities?: string[];
  workingDays?: string[];
  spaceAttributes?: string[];
  seatingConfigurations?: string[];
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
  cancellationPolicy?: {
    refundable?: boolean;
    rules?: string[];
  };
  blockedDates?: string[];
  blockedTimes?: { fromTime: string; toTime: string }[];
  googleMapsUrl?: string;
}

interface VenueSettingsViewProps {
  venue: Venue;
}

export function VenueSettingsView({ venue }: VenueSettingsViewProps) {
  const data = venue as unknown as ExtendedVenue;
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const hasInactiveBanner = data.inactivity?.inactiveAt;
  const hasClosingBanner =
    data.inactivity?.approvedAt && !data.inactivity?.inactiveAt;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden border border-border">
        {data.coverImage ? (
          <button
            onClick={() => handleOpenGallery(0)}
            className="w-full h-56 md:h-64 relative group cursor-pointer text-left block"
          >
            <img
              src={data.coverImage}
              alt={data.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-bold text-white">{data.name}</h1>
            </div>
          </button>
        ) : (
          <div className="w-full h-40 bg-secondary flex items-center justify-center">
            <h1 className="text-2xl font-bold text-muted-foreground">
              {data.name}
            </h1>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            variant={
              data.status === "Approved"
                ? "default"
                : data.status === "Rejected" || data.status === "Suspended"
                  ? "destructive"
                  : "secondary"
            }
          >
            {data.status}
          </Badge>
        </div>

        {/* Inactivity Banners */}
        {hasInactiveBanner && (
          <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 flex items-center gap-2 text-destructive text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            This venue is inactive
          </div>
        )}
        {hasClosingBanner && (
          <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20 flex items-center gap-2 text-amber-700 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            This venue is scheduled for closing
          </div>
        )}
      </div>

      {/* Media Section */}
      {data.galleryImages && data.galleryImages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Info className="w-4 h-4" />
            Gallery Photos
            <Badge variant="secondary" className="px-1.5 py-0 rounded-full">
              {data.galleryImages.length}
            </Badge>
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
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Core Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Info className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Core Details</h3>
          </div>
          <dl className="space-y-2.5">
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">Venue Type</dt>
              <dd className="font-medium capitalize">
                {data.venueType || "—"}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">Max Capacity</dt>
              <dd className="font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                {data.maxCapacity || data.capacity || "—"}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-muted-foreground">Booking Type</dt>
              <dd className="font-medium capitalize">
                {data.bookingType === "fixedBooking"
                  ? "Fixed Slots"
                  : data.bookingType === "flexible"
                    ? "Flexible Time"
                    : data.bookingType || "—"}
              </dd>
            </div>
            {data.workingDays && data.workingDays.length > 0 && (
              <div className="flex justify-between items-start pt-1 border-t border-border/50">
                <dt className="text-muted-foreground mt-0.5">Working Days</dt>
                <dd className="flex gap-1 flex-wrap justify-end pl-4">
                  {data.workingDays.map((day: string) => (
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
            {data.spaceAttributes && data.spaceAttributes.length > 0 && (
              <div className="flex justify-between items-start pt-1 border-t border-border/50">
                <dt className="text-muted-foreground mt-0.5">
                  Space Attributes
                </dt>
                <dd className="flex gap-1 flex-wrap justify-end pl-4">
                  {data.spaceAttributes.map((attr: string) => (
                    <Badge key={attr} variant="outline" className="text-[10px]">
                      {attr}
                    </Badge>
                  ))}
                </dd>
              </div>
            )}
            {data.seatingConfigurations &&
              data.seatingConfigurations.length > 0 && (
                <div className="flex justify-between items-start pt-1 border-t border-border/50">
                  <dt className="text-muted-foreground mt-0.5">Seating</dt>
                  <dd className="flex gap-1 flex-wrap justify-end pl-4">
                    {data.seatingConfigurations.map((cfg: string) => (
                      <Badge
                        key={cfg}
                        variant="outline"
                        className="text-[10px]"
                      >
                        {cfg}
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
          </dl>
        </Card>

        {/* Location Card */}
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
              <dt className="text-muted-foreground">Pincode</dt>
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
            {data.googleMapsUrl && (
              <div className="pt-3 border-t border-border/50">
                <a
                  href={data.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on Google Maps
                    <MapPin className="w-3.5 h-3.5 ml-auto text-primary" />
                  </Button>
                </a>
              </div>
            )}
          </dl>
        </Card>
      </div>

      {/* Contact Card */}
      <Card className="p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <User className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Contact Information</h3>
        </div>
        {data.contact ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="font-medium">{data.contact.name || "—"}</span>
            </div>
            <div className="flex items-center gap-3 pl-1 text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <a
                href={`tel:${data.contact.phone}`}
                className="hover:text-primary transition-colors"
              >
                {data.contact.phone || "—"}
              </a>
            </div>
            <div className="flex items-center gap-3 pl-1 text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <a
                href={`mailto:${data.contact.email}`}
                className="hover:text-primary transition-colors"
              >
                {data.contact.email || "—"}
              </a>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground italic">
            No contact details
          </span>
        )}
      </Card>

      {/* Booking Configuration Card */}
      <Card className="p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Banknote className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Booking Configuration</h3>
        </div>

        {data.bookingType === "fixedBooking" &&
        data.fixedPackages &&
        data.fixedPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
            {data.fixedPackages.map((pkg, i) => (
              <div
                key={i}
                className="bg-secondary/30 rounded-lg p-3 border border-border flex flex-col"
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
          <div className="space-y-1 py-2">
            {data.pricing && (
              <div className="flex gap-4 flex-wrap">
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
                    ₹{data.pricing.basePrice ?? "0"}
                  </p>
                </div>
                {data.pricing.pricePerHour != null && (
                  <div className="bg-secondary/30 px-4 py-2 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Per Hour
                    </p>
                    <p className="font-semibold text-primary">
                      ₹{data.pricing.pricePerHour}
                    </p>
                  </div>
                )}
                {data.pricing.pricePerDay != null && (
                  <div className="bg-secondary/30 px-4 py-2 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      Per Day
                    </p>
                    <p className="font-semibold text-primary">
                      ₹{data.pricing.pricePerDay}
                    </p>
                  </div>
                )}
              </div>
            )}

            {data.pricing?.pricingRules &&
              data.pricing.pricingRules.length > 0 && (
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase">
                      <tr>
                        <th className="px-4 py-2.5 font-medium border-b border-border">
                          Time Range
                        </th>
                        <th className="px-4 py-2.5 font-medium border-b border-border text-right">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data.pricing.pricingRules.map((rule, i) => (
                        <tr key={i} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            {rule.fromTime} - {rule.toTime}
                          </td>
                          <td className="px-4 py-2 font-medium text-right">
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

        {/* Cancellation Policy */}
        {data.cancellationPolicy && (
          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-semibold mb-2">Cancellation Policy</h4>
            <Badge
              variant={
                data.cancellationPolicy.refundable ? "default" : "destructive"
              }
            >
              {data.cancellationPolicy.refundable
                ? "Refundable"
                : "Non-Refundable"}
            </Badge>
            {data.cancellationPolicy.rules &&
              data.cancellationPolicy.rules.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {data.cancellationPolicy.rules.map((rule, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        )}

        {/* Amenities */}
        <div className="pt-3 border-t border-border py-2">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            Amenities
          </h4>
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Blocked Times/Dates */}
        {(data.blockedDates && data.blockedDates.length > 0) ||
        (data.blockedTimes && data.blockedTimes.length > 0) ? (
          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-semibold mb-2">Blocked Slots</h4>
            {data.blockedDates && data.blockedDates.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-1">
                  Blocked Dates:
                </p>
                <div className="flex flex-wrap gap-1">
                  {data.blockedDates.map((d, i) => {
                    const date = d.includes("T")
                      ? parseISO(d)
                      : new Date(d + "T00:00:00");
                    return (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {format(date, "MMM d, yyyy")}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            {data.blockedTimes && data.blockedTimes.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Blocked Times:
                </p>
                <div className="flex flex-wrap gap-1">
                  {data.blockedTimes.map((t, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      {t.fromTime}–{t.toTime}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Card>

      {/* Lightbox */}
      {galleryOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setGalleryOpen(false)}
          >
            <div
              className="flex flex-col items-center justify-center w-full h-full px-4 py-4 sm:py-6 relative"
              onClick={(e) => e.stopPropagation()}
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
