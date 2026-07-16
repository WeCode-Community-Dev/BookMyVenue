import React, { useState } from "react";
import {
  Share2,
  Bookmark,
  MoreHorizontal,
  AlertCircle,
  Download,
  Printer,
  Heart,
} from "lucide-react";

export function VenueHeader({ venue, data }) {
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => {
      setShowShareToast(false);
    }, 2000);
  };



  return (
    <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-4 relative">
     
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {data.name}
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-2 flex items-center gap-1.5">
          <span className="text-slate-400">Premium location</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-350"></span>
          <span className="text-slate-400">Luxury amenities</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-350"></span>
          <span className="text-slate-400">City views</span>
        </p>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          {data.place}
        </p>
      </div>

      
      <div className="flex items-center gap-2 md:self-start relative">
  
        <button
          onClick={handleShare}
          className="w-11 h-11 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-full flex 
          items-center justify-center text-slate-600 hover:text-slate-800 shadow-sm transition-all duration-300
           hover:scale-105 active:scale-95"
          title="Share Listing"
        >
          <Share2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}

export default VenueHeader;
