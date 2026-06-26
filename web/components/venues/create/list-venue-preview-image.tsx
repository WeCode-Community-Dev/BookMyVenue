import Image from "next/image";

import { listVenuePreviewImage } from "@/lib/data/list-venue";

export function ListVenuePreviewImage() {
  return (
    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg">
      <Image
        src={listVenuePreviewImage}
        alt="Venue preview"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}
