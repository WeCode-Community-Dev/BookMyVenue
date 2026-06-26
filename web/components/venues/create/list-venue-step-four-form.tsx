import type { ListVenueBasicsForm, VenueImage } from "@/lib/data/list-venue";

import { ReviewAmenitiesSection } from "./review-amenities-section";
import { ReviewBasicInfoSection } from "./review-basic-info-section";
import { ReviewPhotosSection } from "./review-photos-section";
import { ReviewPublishPanel } from "./review-publish-panel";
import { ReviewVerificationPanel } from "./review-verification-panel";

type ListVenueStepFourFormProps = {
  basics: ListVenueBasicsForm;
  selectedAmenityIds: string[];
  images: VenueImage[];
  coverImageId: string;
  onEditStep: (step: number) => void;
};

export function ListVenueStepFourForm({
  basics,
  selectedAmenityIds,
  images,
  coverImageId,
  onEditStep,
}: ListVenueStepFourFormProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-4">
        <ReviewBasicInfoSection basics={basics} onEditStep={onEditStep} />
        <ReviewAmenitiesSection
          selectedAmenityIds={selectedAmenityIds}
          onEditStep={onEditStep}
        />
        <ReviewPhotosSection
          images={images}
          coverImageId={coverImageId}
          onEditStep={onEditStep}
        />
      </div>
      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <ReviewPublishPanel />
        <ReviewVerificationPanel />
      </div>
    </div>
  );
}
