import { useState } from 'react';
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react';

interface VenueImageGalleryProps {
  images: string[];
  venueName: string;
}

export default function VenueImageGallery({ images, venueName }: VenueImageGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex h-[360px] sm:h-[480px] items-center justify-center rounded-3xl border border-border/40 bg-surface/60">
        <Building2 size={56} className="text-muted/40 stroke-[1.2]" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/40 bg-card shadow-lg overflow-hidden space-y-3 p-2 sm:p-3">
      <div className="relative h-[360px] sm:h-[480px] rounded-2xl overflow-hidden bg-black/40">
        <img
          src={images[activeImageIndex]}
          alt={`${venueName} - Image ${activeImageIndex + 1}`}
          className="h-full w-full object-cover transition-all duration-300"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md p-3 text-white hover:bg-black/70 transition-all cursor-pointer shadow-lg"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-md p-3 text-white hover:bg-black/70 transition-all cursor-pointer shadow-lg"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 rounded-xl bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white tracking-widest uppercase">
          {activeImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 px-1 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`shrink-0 h-20 w-28 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                idx === activeImageIndex
                  ? 'border-primary ring-4 ring-primary/20 scale-[1.02]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
