"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { VenueImage } from "@/lib/data/list-venue";

import { ReviewSectionCard } from "./review-section-card";

type ReviewPhotosSectionProps = {
  images: VenueImage[];
  coverImageId: string | null;
  onEditStep: (step: number) => void;
};

function sortCoverFirst(images: VenueImage[], coverImageId: string|null) {
  const cover = images.find((image) => image.id === coverImageId);
  const rest = images.filter((image) => image.id !== coverImageId);

  return cover ? [cover, ...rest] : images;
}

export function ReviewPhotosSection({
  images,
  coverImageId,
  onEditStep,
}: ReviewPhotosSectionProps) {
  const sortedImages = sortCoverFirst(images, coverImageId);
  const visibleImages = sortedImages.slice(0, 3);
  const remainingCount = sortedImages.length - 3;
  const fourthImage = sortedImages[3];

  return (
    <ReviewSectionCard
      title="Photos & Media"
      icon={ImageIcon}
      accentClassName="border-tertiary"
      onEdit={() => onEditStep(3)}
    >
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {visibleImages.map((image) => (
            <div
              key={image.id}
              className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="160px"
                unoptimized={image.url.startsWith("blob:")}
              />
            </div>
          ))}
          {remainingCount > 0 ? (
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-primary-container/30 text-sm font-medium text-surface-tint">
              +{remainingCount} More
            </div>
          ) : fourthImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container">
              <Image
                src={fourthImage.url}
                alt={fourthImage.alt}
                fill
                className="object-cover"
                sizes="160px"
                unoptimized={fourthImage.url.startsWith("blob:")}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-on-surface-variant">No photos uploaded</p>
      )}
    </ReviewSectionCard>
  );
}
