import React, { useState } from 'react';

export function VenueAbout({  data }) {

  return (
    <div className="w-full flex flex-col gap-4 animate-fade-in-up">
      <h3 className="text-xl font-bold text-slate-800 tracking-tight">
        About {data.name}
      </h3>
      
      <div className="flex flex-col gap-4 text-sm text-slate-650 leading-relaxed font-normal transition-all 
      duration-505 overflow-hidden" >
        {data.description}
      </div>
    </div>
  );
}

export default VenueAbout;
