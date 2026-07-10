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

  if (images.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-2xl border border-border bg-card">
        <Building2 size={48} className="text-muted stroke-[1.2]" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="relative h-[400px] sm:h-[460px] bg-background">
        <img
          src={images[activeImageIndex]}
          alt={`${venueName} - Image ${activeImageIndex + 1}`}
          className="h-full w-full object-cover"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-2 text-white hover:bg-black/70 transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm p-2 text-white hover:bg-black/70 transition-all cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1.5 text-[11px] font-bold text-white tracking-wider">
          {activeImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                idx === activeImageIndex
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-muted'
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
