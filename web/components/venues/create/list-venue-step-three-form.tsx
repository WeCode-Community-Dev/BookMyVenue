"use client";

import type { VenueImage } from "@/lib/data/list-venue";
import { createImageFromFile } from "@/lib/utils/image";

import { ImageGallery } from "../../common/image-gallery";
import { ImageUploadZone } from "../../common/image-upload-zone";

type ListVenueStepThreeFormProps = {
  images: VenueImage[];
  coverImageId: string | null;
  onImagesChange: (images: VenueImage[]) => void;
  onCoverChange: (id: string) => void;
};



export function ListVenueStepThreeForm({
  images,
  coverImageId,
  onImagesChange,
  onCoverChange,
}: ListVenueStepThreeFormProps) {
  
  function handleFilesSelected(files: FileList) {
    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => createImageFromFile(file));

    if (newImages.length === 0) {
      return;
    }

    onImagesChange([...images, ...newImages]);

    if (!coverImageId || !images.some((image) => image.id === coverImageId)) {
      onCoverChange(newImages[0].id);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <ImageUploadZone onFilesSelected={handleFilesSelected} />
      <ImageGallery
        images={images}
        coverImageId={coverImageId}
        onImagesChange={onImagesChange}
        onCoverChange={onCoverChange}
      />
    </div>
  );
}
