import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { getImageUrl } from "./utils";

function VenueGallery({
  venue,
  currentImageIndex,
  setCurrentImageIndex,
}) {
  const images = venue?.images || [];

  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;

  const currentImage = hasImages
    ? getImageUrl(images[currentImageIndex])
    : "";

  function previousImage() {
    if (!hasMultipleImages) return;

    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  function nextImage() {
    if (!hasMultipleImages) return;

    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gray-100 shadow">
      {hasImages ? (
        <img
          src={currentImage}
          alt={venue.name}
          className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
        />
      ) : (
        <div className="flex h-[300px] items-center justify-center bg-gray-100 text-gray-500 sm:h-[420px] lg:h-[520px]">
          <div className="flex flex-col items-center gap-3">
            <ImageOff size={42} />
            <span>No images available</span>
          </div>
        </div>
      )}

      {hasMultipleImages && (
        <>
          <button
            onClick={previousImage}
            className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {hasImages && (
        <div className="absolute bottom-5 right-5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}

      {hasMultipleImages && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                currentImageIndex === index
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default VenueGallery;