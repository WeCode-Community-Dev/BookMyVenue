"use client";

import * as React from "react";

import type { VenueImage } from "@/lib/data/list-venue";
import { cn } from "@/lib/utils";

import { VenueImageThumbnail } from "./venue-image-thumbnail";

type VenueImageGalleryProps = {
  images: VenueImage[];
  coverImageId: string;
  onImagesChange: (images: VenueImage[]) => void;
  onCoverChange: (id: string) => void;
};

export function VenueImageGallery({
  images,
  coverImageId,
  onImagesChange,
  onCoverChange,
}: VenueImageGalleryProps) {
  const [isReorderMode, setIsReorderMode] = React.useState(false);
  const [draggedId, setDraggedId] = React.useState<string | null>(null);

  function handleDelete(id: string) {
    const remaining = images.filter((image) => image.id !== id);
    const deleted = images.find((image) => image.id === id);

    if (deleted?.url.startsWith("blob:")) {
      URL.revokeObjectURL(deleted.url);
    }

    onImagesChange(remaining);

    if (id === coverImageId && remaining.length > 0) {
      onCoverChange(remaining[0].id);
    }
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      return;
    }

    const draggedIndex = images.findIndex((image) => image.id === draggedId);
    const targetIndex = images.findIndex((image) => image.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const reordered = [...images];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    onImagesChange(reordered);
    setDraggedId(null);
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-on-surface">
          Uploaded Photos ({images.length})
        </h2>
        <button
          type="button"
          onClick={() => setIsReorderMode((value) => !value)}
          className={cn(
            "text-sm font-medium transition-colors",
            isReorderMode
              ? "text-on-surface"
              : "text-surface-tint hover:text-primary"
          )}
        >
          {isReorderMode ? "Done Reordering" : "Reorder Images"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((image) => (
          <VenueImageThumbnail
            key={image.id}
            image={image}
            isCover={image.id === coverImageId}
            isReorderMode={isReorderMode}
            isDragging={draggedId === image.id}
            onSelectCover={onCoverChange}
            onDelete={handleDelete}
            onDragStart={setDraggedId}
            onDragOver={(event) => {
              if (isReorderMode) {
                event.preventDefault();
              }
            }}
            onDrop={handleDrop}
            onDragEnd={() => setDraggedId(null)}
          />
        ))}
      </div>
    </div>
  );
}
