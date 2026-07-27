"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VenueImage } from "@/lib/data/list-venue";
import { cn } from "@/lib/utils";

type VenueImageThumbnailProps = {
  image: VenueImage;
  isCover: boolean;
  isDragging: boolean;
  onSelectCover: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDrop: (id: string) => void;
  onDragEnd: () => void;
};

export function VenueImageThumbnail({
  image,
  isCover,
  isDragging,
  onSelectCover,
  onDelete,
  onDragStart,
  onDrop,
  onDragEnd,
}: VenueImageThumbnailProps) {
  return (
    <div
      draggable={true}
      onDragStart={() => onDragStart(image.id)}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop(image.id);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative aspect-4/3 overflow-hidden rounded-lg",
        "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <button
        type="button"
        onClick={() => onSelectCover(image.id)}
        className={cn(
          "relative block size-full overflow-hidden rounded-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-tint focus-visible:ring-offset-2",
          isCover && "ring-2 ring-surface-tint"
        )}
      >
        <Image
          src={image.url}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 25vw"
          unoptimized={image.url.startsWith("blob:")}
        />
      </button>
      {isCover ? (
        <Badge className="absolute left-2 top-2 border-0 bg-surface-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-primary">
          Cover Image
        </Badge>
      ) : null}
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="absolute bottom-2 right-2 size-8 rounded-full bg-background/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(image.id);
        }}
        aria-label={`Delete ${image.alt}`}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
