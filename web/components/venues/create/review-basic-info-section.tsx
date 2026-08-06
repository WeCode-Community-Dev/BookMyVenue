import { Info } from "lucide-react";

import type { ListVenueBasicsForm } from "@/lib/data/list-venue";
import {
  formatVenueAddress,
  formatVenueLocation,
} from "@/lib/data/list-venue";

import { ReviewField } from "./review-field";
import { ReviewSectionCard } from "./review-section-card";

type ReviewBasicInfoSectionProps = {
  basics: ListVenueBasicsForm;
  onEditStep: (step: number) => void;
};

export function ReviewBasicInfoSection({
  basics,
  onEditStep,
}: ReviewBasicInfoSectionProps) {
  return (
    <ReviewSectionCard
      title="Basic Information"
      icon={Info}
      onEdit={() => onEditStep(1)}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewField label="Venue Name" value={basics.name} />
          <ReviewField label="Location" value={formatVenueLocation(basics)} />
        </div>
        <ReviewField label="Address" value={formatVenueAddress(basics)} />
        <ReviewField label="Description" value={basics.description} />
      </div>
    </ReviewSectionCard>
  );
}
