import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export function ImageGallery({ image }) {
  const [fadeState, setFadeState] = useState(false);

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[300px] md:h-[450px] animate-fade-in-up">
        <div
          className={`md:col-span-3 h-full rounded-[2rem] overflow-hidden relative cursor-pointer group bg-slate-900 border
             border-slate-200/50 shadow-md transition-all duration-300 ${
               fadeState ? "opacity-80 scale-[0.99]" : "opacity-100 scale-100"
             }`}
        >
          <img
            src={image}
            alt="Main property view"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
