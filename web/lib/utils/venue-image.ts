import type { VenueImage } from "@/lib/data/list-venue";

export function createImageFromFile(file: File): VenueImage {
  return {
    id: `${crypto.randomUUID()}-${file.name}`,
    url: URL.createObjectURL(file),
    alt: file.name.replace(/\.[^.]+$/, "") || "Uploaded photo",
  };
}

export function orderImageIdsWithCoverFirst(
  images: VenueImage[],
  coverImageId: string | null,
  uploadedIds: { localId: string; serverId: string }[]
): string[] {
  const idMap = new Map(uploadedIds.map(({ localId, serverId }) => [localId, serverId]));
  const orderedLocalIds = coverImageId
    ? [
        coverImageId,
        ...images.filter((image) => image.id !== coverImageId).map((image) => image.id),
      ]
    : images.map((image) => image.id);

  return orderedLocalIds
    .map((localId) => idMap.get(localId))
    .filter((id): id is string => Boolean(id));
}
