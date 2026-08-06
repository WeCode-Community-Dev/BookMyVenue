"use client";

import Image from "next/image";
import { CircleHelp, Images, Info, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { capacityTypeLabels, CapacityType } from "@/lib/data/venues";
import type { VenueImage } from "@/lib/data/list-venue";
import { cn } from "@/lib/utils";

type CreateSpacePreviewPanelProps = {
  name: string;
  categoryName: string | null;
  capacityValue: string;
  capacityType: string;
  amenityCount: number;
  images: VenueImage[];
  coverImageId: string | null;
  description: string;
  rules: string;
};

export function CreateSpacePreviewPanel({
  name,
  categoryName,
  capacityValue,
  capacityType,
  amenityCount,
  images,
  coverImageId,
  description,
  rules,
}: CreateSpacePreviewPanelProps) {
  const coverImage =
    images.find((image) => image.id === coverImageId) ?? images[0] ?? null;

  const capacityLabel =
    capacityValue && capacityType
      ? `${capacityValue} ${capacityTypeLabels[capacityType as CapacityType] ?? capacityType}`
      : "--";

  const isReady = description.trim().length > 0 && rules.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border border-outline-variant/40 bg-background shadow-elevation-1">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <Badge variant="secondary" className="bg-primary-container/30 text-surface-tint">
            DRAFT
          </Badge>
          <span className="text-xs text-on-surface-variant">Updated just now</span>
        </div>

        <div className="px-4 pb-4">
          <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-surface-container-high">
            {coverImage ? (
              <Image
                src={coverImage.url}
                alt={coverImage.alt}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-on-surface-variant">
                <Images className="size-8 opacity-40" />
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-on-surface">
            {name.trim() || "New Space"}
          </h3>
          <p className="text-sm text-on-surface-variant">
            {categoryName ?? "No category selected"}
          </p>

          <ul className="mt-4 flex flex-col gap-2 text-sm text-on-surface">
            <li className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              {capacityLabel}
            </li>
            <li className="flex items-center gap-2">
              <CircleHelp className="size-4 text-muted-foreground" />
              {amenityCount} Selected
            </li>
            <li className="flex items-center gap-2">
              <Images className="size-4 text-muted-foreground" />
              {images.length} Uploaded
            </li>
          </ul>

          <div
            className={cn(
              "mt-4 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm",
              isReady
                ? "bg-green-50 text-green-800"
                : "bg-primary-container/20 text-surface-tint"
            )}
          >
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              {isReady
                ? "Your space is ready to be created."
                : "Complete the description and rules to reach 'Ready' status."}
            </span>
          </div>
        </div>
      </div>

      {/* <div className="flex items-start gap-3 rounded-lg bg-primary-container/20 px-4 py-3 text-sm text-on-surface">
        <CircleHelp className="mt-0.5 size-4 shrink-0 text-surface-tint" />
        <span>Need assistance? Contact your Account Manager</span>
      </div> */}
    </div>
  );
}
