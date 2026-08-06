import { FileText, Info, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReviewField } from "@/components/venues/create/review-field";
import { FormSectionCard } from "@/components/venues/create-space/form-section-card";
import { formatFullAddress } from "@/lib/data/public-venue-detail";
import type { VenueDetails } from "@/lib/data/venues";

type VenueOverviewTabProps = {
  venue: VenueDetails;
};

export function VenueOverviewTab({ venue }: VenueOverviewTabProps) {
  const description = venue.description?.trim();
  const fullAddress = formatFullAddress(venue);

  const lat = parseFloat(venue.latitude);
  const lng = parseFloat(venue.longitude);
  const hasCoordinates =
    Boolean(venue.latitude?.trim()) &&
    Boolean(venue.longitude?.trim()) &&
    !Number.isNaN(lat) &&
    !Number.isNaN(lng);

  const mapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`
    : fullAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
      : null;

  const quickInfoFields = [
    { label: "Venue Name", value: venue.name },
    { label: "Address", value: venue.address },
    { label: "City", value: venue.city },
    { label: "State", value: venue.state },
    { label: "Country", value: venue.country },
    { label: "Postal Code", value: venue.postalCode },
    { label: "Timezone", value: venue.timezone },
  ].filter(({ value }) => value?.trim());

  return (
    <div className="flex flex-col gap-6">
      <FormSectionCard title="Overview" icon={FileText}>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {description || "No description available."}
        </p>
      </FormSectionCard>

      {quickInfoFields.length > 0 && (
        <FormSectionCard title="Quick Information" icon={Info}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickInfoFields.map(({ label, value }) => (
              <ReviewField key={label} label={label} value={value} />
            ))}
          </div>
        </FormSectionCard>
      )}

      <FormSectionCard title="Location" icon={MapPin}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {fullAddress || "No address available."}
          </p>
          {mapsUrl && (
            <Button variant="outline" className="w-fit" asChild>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin className="size-3.5" />
                Open in Google Maps
              </a>
            </Button>
          )}
        </div>
      </FormSectionCard>
    </div>
  );
}
