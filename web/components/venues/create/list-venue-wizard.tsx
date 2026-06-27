"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  listVenueDefaultForm,
  listVenueStepContent,
  TOTAL_LIST_VENUE_STEPS,
  VenueImage,
} from "@/lib/data/list-venue";

import { ListVenueFormActions } from "./list-venue-form-actions";
import { ListVenuePreviewImage } from "./list-venue-preview-image";
import { ListVenueProTip } from "./list-venue-pro-tip";
import { ListVenueProgress } from "./list-venue-progress";
import { ListVenueStepFourForm } from "./list-venue-step-four-form";
import { ListVenueStepOneForm } from "./list-venue-step-one-form";
import { ListVenueStepThreeForm } from "./list-venue-step-three-form";
import { ListVenueStepTwoForm } from "./list-venue-step-two-form";
import { ListVenueWizardHeader } from "./list-venue-wizard-header";
import { uploadFile } from "@/services/r2Services";
import { createImages, createVenue } from "@/services/venueServices";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ListVenueWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [basicsForm, setBasicsForm] = useState(listVenueDefaultForm);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(
    []
  );
  const [venueImages, setVenueImages] = useState<VenueImage[]>([]);
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepContent = listVenueStepContent[currentStep];

  function handlePrevious() {
    setCurrentStep((step) => Math.max(1, step - 1));
  }

  function handleContinue() {
    setCurrentStep((step) => Math.min(TOTAL_LIST_VENUE_STEPS, step + 1));
  }

  async function handlePublish() {

    try{
      setIsSubmitting(true);
      for (const image of venueImages) {
        if (!image.url.startsWith('blob:')) continue;
        const response = await fetch(image.url);
        const blob = await response.blob();
  
        const file = new File(
          [blob],
          image.id, // choose a filename
          { type: blob.type }
        );
        const result = await uploadFile(file);
      }
  
      const images:{id: string}[] = await createImages(venueImages.filter((image) => image.url.startsWith('blob:')).map((image) => ({
        url: image.id,
        altText: image.alt,
      })));
  
      const venue = await createVenue({
        ...basicsForm,
        latitude: Number(basicsForm.latitude),
        longitude: Number(basicsForm.longitude),
        venueImageIds: images.map((image) => image.id),
        venueAmenityIds: selectedAmenityIds
      });
      toast.success('Venue published successfully');

    } catch (error) {
      console.error(error);
      toast.error((error as Error)?.message || 'Failed to publish venue');
      throw error;
    } finally {
      setIsSubmitting(false);
    }

  }
  if (isSubmitting) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  }
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:gap-8">
      <ListVenueWizardHeader
        title={stepContent.title}
        subtitle={stepContent.subtitle}
        currentStep={currentStep}
        totalSteps={TOTAL_LIST_VENUE_STEPS} />
      <ListVenueProgress
        currentStep={currentStep}
        totalSteps={TOTAL_LIST_VENUE_STEPS}
      />
      <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
        <CardContent className="p-6 lg:p-8">
          {currentStep === 1 ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <ListVenueProTip
                  title={stepContent.proTip.title}
                  body={stepContent.proTip.body}
                />
                <ListVenuePreviewImage />
              </div>
              <ListVenueStepOneForm value={basicsForm} onChange={setBasicsForm} />
            </div>
          ) : null}
          {currentStep === 2 ? (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <ListVenueProTip
                  title={stepContent.proTip.title}
                  body={stepContent.proTip.body}
                />
                <ListVenuePreviewImage />
              </div>
              <ListVenueStepTwoForm
                selectedIds={selectedAmenityIds}
                onChange={setSelectedAmenityIds}
              />
            </div>
          ) : null}
          {currentStep === 3 ? (
            <ListVenueStepThreeForm
              images={venueImages}
              coverImageId={coverImageId}
              onImagesChange={setVenueImages}
              onCoverChange={setCoverImageId}
            />
          ) : null}
          {currentStep === 4 ? (
            <ListVenueStepFourForm
              basics={basicsForm}
              selectedAmenityIds={selectedAmenityIds}
              images={venueImages}
              coverImageId={coverImageId}
              onEditStep={setCurrentStep}
              onPublish={handlePublish}
            />
          ) : null}
          <ListVenueFormActions
            currentStep={currentStep}
            totalSteps={TOTAL_LIST_VENUE_STEPS}
            continueLabel={currentStep === 3 ? "Review" : undefined}
            hideContinue={currentStep === 4}
            onPrevious={handlePrevious}
            onContinue={handleContinue}
          />
        </CardContent>
      </Card>
    </div>
  );
}
