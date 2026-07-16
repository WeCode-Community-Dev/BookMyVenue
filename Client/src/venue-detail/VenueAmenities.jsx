import React from "react";
import { Sparkles } from "lucide-react";

export function VenueAmenities({ venue, data }) {
 

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 tracking-tight">
        Building Amenities
      </h3>

      <div className="bg-[#FAF9F6] border border-slate-200/60 rounded-[2rem] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {data?.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-150/70 hover:border-slate-300 hover:shadow-sm rounded-2xl
                 p-4 flex items-center gap-3 transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div
                className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center
                 justify-center text-slate-450 group-hover:text-ticket-orange group-hover:bg-ticket-orange/5 transition-all"
              >
                <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-xs font-bold text-slate-700">
                {item.spec}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VenueAmenities;
