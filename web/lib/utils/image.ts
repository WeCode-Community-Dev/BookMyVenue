import type { VenueImage } from "@/lib/data/list-venue";

export function createImageFromFile(file: File): VenueImage {
  return {
    id: `${crypto.randomUUID()}-${file.name}`,
    url: URL.createObjectURL(file),
    alt: file.name.replace(/\.[^.]+$/, "") || "Uploaded photo",
  };
}

