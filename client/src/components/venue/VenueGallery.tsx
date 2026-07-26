import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface VenueGalleryProps {
  venueName?: string;
  images: string[];
}

export function VenueGallery({ venueName, images }: VenueGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (images.length === 0) return null;

  const handleOpenGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 grid-rows-3 gap-4 h-[240px] sm:h-[340px] lg:h-[440px] mb-12">
        <button
          onClick={() => handleOpenGallery(0)}
          className="col-span-4 sm:col-span-3 row-span-3 overflow-hidden rounded-3xl border border-[var(--bg-grey)]/65 shadow-md cursor-pointer group"
        >
          <img
            src={images[0]}
            alt={`${venueName} main`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </button>
        {images.length > 1 && (
          <button
            onClick={() => handleOpenGallery(1)}
            className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--bg-grey)]/65 shadow-sm cursor-pointer group"
          >
            <img
              src={images[1]}
              alt={`${venueName} view 1`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </button>
        )}
        {images.length > 2 && (
          <button
            onClick={() => handleOpenGallery(2)}
            className="hidden sm:block overflow-hidden rounded-2xl border border-[var(--bg-grey)]/65 shadow-sm cursor-pointer group"
          >
            <img
              src={images[2]}
              alt={`${venueName} view 2`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </button>
        )}
        {images.length > 3 && (
          <button
            onClick={() => handleOpenGallery(3)}
            className="hidden sm:block relative cursor-pointer overflow-hidden rounded-2xl border border-[var(--bg-grey)]/65 shadow-sm group"
          >
            <img
              src={images[3]}
              alt={`${venueName} view 3`}
              className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40 transition duration-300 group-hover:bg-black/50">
              <span className="text-2xl font-black">+ {images.length - 3}</span>
              <span className="text-[10px] tracking-wider uppercase font-semibold mt-1">
                Photos
              </span>
            </div>
          </button>
        )}
      </div>

      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all duration-300 ${
          galleryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setGalleryOpen(false)}
      >
        <div
          className="flex flex-col items-center justify-center w-full h-full px-4 py-4 sm:py-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          <div className="flex-1 flex items-center justify-center max-w-4xl max-h-[calc(100vh-160px)] w-full">
            <img
              src={images[currentImageIndex]}
              alt={`Gallery view ${currentImageIndex + 1}`}
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>

          <div className="mt-4 text-center text-white text-sm font-semibold">
            {currentImageIndex + 1} / {images.length}
          </div>

          <div className="flex items-center gap-4 mt-6 sm:mt-8">
            <button
              onClick={handlePrevImage}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-2 overflow-x-auto max-w-[calc(100vw-200px)] sm:max-w-none px-2 py-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    idx === currentImageIndex
                      ? 'border-white/80 scale-110'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <button
              onClick={handleNextImage}
              className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
