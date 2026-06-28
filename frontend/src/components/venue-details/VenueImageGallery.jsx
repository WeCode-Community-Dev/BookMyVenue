import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";

const GALLERY_PREVIEW_LIMIT = 5;

const VenueImageLightbox = ({ images, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const goPrev = useCallback(() => {
    setIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Venue photo gallery"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close gallery"
      >
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <img
        src={images[index]}
        alt={`Venue photo ${index + 1} of ${images.length}`}
        className="max-h-[85vh] max-w-full rounded-lg object-contain"
      />

      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
        {index + 1} / {images.length}
      </p>
    </div>
  );
};

const ImageCountBadge = ({ count, className = "" }) => (
  <span
    className={`pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm ${className}`}
  >
    <Images className="h-3.5 w-3.5" aria-hidden="true" />
    {count} photos
  </span>
);

const GalleryTile = ({ url, alt, onClick, className = "", overlay }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative overflow-hidden bg-gray-100 ${className}`}
  >
    <img
      src={url}
      alt={alt}
      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
      loading="lazy"
    />
    {overlay}
  </button>
);

const VenueImageGallery = ({ images, title }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const previewImages = images.slice(0, GALLERY_PREVIEW_LIMIT);
  const remainingCount = Math.max(images.length - GALLERY_PREVIEW_LIMIT, 0);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-400 sm:aspect-[2/1]">
        No photos available
      </div>
    );
  }

const GALLERY_HEIGHT = "h-[340px] lg:h-[460px]";

  const renderDesktopGallery = () => {
    if (previewImages.length === 1) {
      return (
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className={`relative block w-full overflow-hidden rounded-2xl bg-gray-100 ${GALLERY_HEIGHT}`}
        >
          <img
            src={previewImages[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
          <ImageCountBadge count={images.length} />
        </button>
      );
    }

    if (previewImages.length === 2) {
      return (
        <div
          className={`relative grid grid-cols-3 gap-2 overflow-hidden rounded-2xl ${GALLERY_HEIGHT}`}
        >
          <GalleryTile
            url={previewImages[0]}
            alt={`${title} primary`}
            onClick={() => openLightbox(0)}
            className="col-span-2 h-full"
          />
          <GalleryTile
            url={previewImages[1]}
            alt={`${title} photo 2`}
            onClick={() => openLightbox(1)}
            className="h-full"
          />
          <ImageCountBadge count={images.length} />
        </div>
      );
    }

    if (previewImages.length === 3) {
      return (
        <div
          className={`relative grid grid-cols-2 gap-2 overflow-hidden rounded-2xl ${GALLERY_HEIGHT}`}
        >
          <GalleryTile
            url={previewImages[0]}
            alt={`${title} primary`}
            onClick={() => openLightbox(0)}
            className="row-span-2 h-full"
          />
          <GalleryTile
            url={previewImages[1]}
            alt={`${title} photo 2`}
            onClick={() => openLightbox(1)}
            className="h-full"
          />
          <GalleryTile
            url={previewImages[2]}
            alt={`${title} photo 3`}
            onClick={() => openLightbox(2)}
            className="h-full"
          />
          <ImageCountBadge count={images.length} />
        </div>
      );
    }

    if (previewImages.length === 4) {
      return (
        <div
          className={`relative grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl ${GALLERY_HEIGHT}`}
        >
          <GalleryTile
            url={previewImages[0]}
            alt={`${title} primary`}
            onClick={() => openLightbox(0)}
            className="col-span-2 row-span-2 h-full"
          />
          <GalleryTile
            url={previewImages[1]}
            alt={`${title} photo 2`}
            onClick={() => openLightbox(1)}
            className="h-full"
          />
          <GalleryTile
            url={previewImages[2]}
            alt={`${title} photo 3`}
            onClick={() => openLightbox(2)}
            className="h-full"
          />
          <GalleryTile
            url={previewImages[3]}
            alt={`${title} photo 4`}
            onClick={() => openLightbox(3)}
            className="col-span-2 h-full"
          />
          <ImageCountBadge count={images.length} />
        </div>
      );
    }

    return (
      <div
        className={`relative grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl ${GALLERY_HEIGHT}`}
      >
        <GalleryTile
          url={previewImages[0]}
          alt={`${title} primary`}
          onClick={() => openLightbox(0)}
          className="col-span-2 row-span-2"
        />

        {previewImages.slice(1, GALLERY_PREVIEW_LIMIT).map((url, index) => {
          const absoluteIndex = index + 1;
          const isLastPreview =
            absoluteIndex === GALLERY_PREVIEW_LIMIT - 1 && remainingCount > 0;

          return (
            <GalleryTile
              key={url}
              url={url}
              alt={`${title} photo ${absoluteIndex + 1}`}
              onClick={() => openLightbox(absoluteIndex)}
              overlay={
                isLastPreview ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white">
                    +{remainingCount} more
                  </span>
                ) : null
              }
            />
          );
        })}

        <ImageCountBadge count={images.length} />
      </div>
    );
  };

  return (
    <>
      <div className="relative md:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => openLightbox(index)}
              className="relative aspect-[4/3] w-[88vw] max-w-md shrink-0 snap-center overflow-hidden rounded-2xl bg-gray-100"
            >
              <img
                src={url}
                alt={`${title} photo ${index + 1}`}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </button>
          ))}
        </div>
        <ImageCountBadge count={images.length} className="bottom-5 right-5" />
      </div>

      <div className="hidden md:block">{renderDesktopGallery()}</div>

      {lightboxIndex !== null && (
        <VenueImageLightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

export default VenueImageGallery;
