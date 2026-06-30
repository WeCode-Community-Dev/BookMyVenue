"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Grid, X, ChevronLeft, ChevronRight } from "lucide-react";

interface VenueGalleryProps {
  images: string[];
  name: string;
}

export default function VenueGallery({ images, name }: VenueGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.slice(0, 5);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      {/* Mobile View: Single Banner */}
      <div className="sm:hidden relative aspect-[4/3] w-full overflow-hidden bg-slate-100 rounded-xl">
        <Image
          src={images[0]}
          alt={`${name} gallery view`}
          fill
          priority
          className="object-cover"
        />
        <button
          onClick={() => { setIsOpen(true); setCurrentIndex(0); }}
          className="absolute bottom-3 right-3 bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md transition border-0 cursor-pointer"
        >
          <Grid className="size-3" />
          <span>1 / {images.length}</span>
        </button>
      </div>

      {/* Desktop View: Airbnb style 5-Photo Grid */}
      <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 h-[320px] md:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden relative bg-slate-100 group/gallery select-none">
        {/* Main Large Image (Left, 50% width) */}
        <div className="col-span-2 row-span-2 relative overflow-hidden bg-slate-200 cursor-pointer" onClick={() => { setIsOpen(true); setCurrentIndex(0); }}>
          <Image
            src={displayImages[0]}
            alt={`${name} main view`}
            fill
            priority
            className="object-cover hover:scale-[1.025] hover:opacity-95 transition-all duration-300 ease-out"
          />
        </div>

        {/* 4 Small Images (Right side) */}
        {displayImages.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden bg-slate-200 cursor-pointer"
            onClick={() => { setIsOpen(true); setCurrentIndex(idx + 1); }}
          >
            <Image
              src={img}
              alt={`${name} gallery ${idx + 1}`}
              fill
              className="object-cover hover:scale-[1.025] hover:opacity-95 transition-all duration-300 ease-out"
            />
          </div>
        ))}

        {/* Floating Show All Photos Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-6 right-6 bg-white hover:bg-slate-50 text-slate-800 text-xs md:text-sm font-extrabold px-4 py-2.5 rounded-xl border border-slate-200 shadow-md transition-all duration-150 hover:shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Grid className="size-4" />
          <span>Show All Photos</span>
        </button>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-100 bg-slate-950/95 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between text-white py-2 z-10 select-none">
            <span className="text-xs sm:text-sm font-bold text-slate-400">
              Photo {currentIndex + 1} of {images.length} — {name}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border-0 cursor-pointer"
              aria-label="Close photo viewer"
            >
              <X className="size-5 sm:size-6" />
            </button>
          </div>

          {/* Modal Image Slider */}
          <div className="relative flex-grow flex items-center justify-center py-4 select-none">
            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition border-0 cursor-pointer disabled:opacity-50"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-5 sm:size-6" />
            </button>

            {/* Main Image View */}
            <div className="relative w-full max-w-5xl aspect-video sm:h-[70vh] rounded-lg overflow-hidden">
              <Image
                src={images[currentIndex]}
                alt={`${name} full view`}
                fill
                className="object-contain"
              />
            </div>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition border-0 cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="size-5 sm:size-6" />
            </button>
          </div>

          {/* Modal Footer Thumbnail strip */}
          <div className="hidden sm:flex items-center justify-center gap-2 overflow-x-auto py-4 select-none border-t border-white/10">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative size-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  currentIndex === idx ? "border-rose-500 scale-105" : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
