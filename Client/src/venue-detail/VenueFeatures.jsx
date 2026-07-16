import React, { useState } from 'react';
import { BedDouble, Bath, Maximize2, Car, Shield, X, MapPin } from 'lucide-react';

export function VenueFeatures({ venue }) {
  const [mapOpen, setMapOpen] = useState(false);

  
  const renderSafetyDots = (score) => {
   
    const dots = [];
    const fullDots = Math.floor(score);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullDots) {
        dots.push("bg-emerald-500");
      } else if (i === fullDots + 1 && score % 1 >= 0.5) {
        dots.push("bg-emerald-450 opacity-70");
      } else {
        dots.push("bg-slate-200");
      }
    }
    return dots;
  };

  return (
    <div className="w-full">
      {/* Grid of features */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Bedrooms */}
        <div className="bg-[#FAF9F6] border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition-all duration-300">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bedrooms</div>
          <div className="flex items-center gap-2 mt-2">
            <BedDouble className="w-4 h-4 text-ticket-orange" />
            <span className="text-sm font-bold text-slate-800">{venue.bedrooms || 5}</span>
          </div>
        </div>

        {/* Bathrooms */}
        <div className="bg-[#FAF9F6] border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition-all duration-300">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bathrooms</div>
          <div className="flex items-center gap-2 mt-2">
            <Bath className="w-4 h-4 text-ticket-orange" />
            <span className="text-sm font-bold text-slate-800">{venue.bathrooms || 2}</span>
          </div>
        </div>

        {/* Area */}
        <div className="bg-[#FAF9F6] border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition-all duration-300">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Area</div>
          <div className="flex items-center gap-2 mt-2">
            <Maximize2 className="w-4 h-4 text-ticket-orange" />
            <span className="text-sm font-bold text-slate-800">{venue.area || "8x7.5 m²"}</span>
          </div>
        </div>

        {/* Parking */}
        <div className="bg-[#FAF9F6] border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition-all duration-300">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parking</div>
          <div className="flex items-center gap-2 mt-2">
            <Car className="w-4 h-4 text-ticket-orange" />
            <span className="text-sm font-bold text-slate-800">{venue.parking || "Indoor"}</span>
          </div>
        </div>

        {/* Area Safety */}
        <div className="bg-[#FAF9F6] border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition-all duration-300">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Area Safety</div>
          <div className="flex items-center gap-1.5 mt-2.5">
            {renderSafetyDots(venue.safety || 4.8).map((dotClass, idx) => (
              <span key={idx} className={`w-2.5 h-2.5 rounded-full ${dotClass} transition-all`}></span>
            ))}
          </div>
        </div>

        {/* Interactive Map Box */}
        <div 
          onClick={() => setMapOpen(true)}
          className="bg-[#FAF9F6] border border-slate-200/80 rounded-2xl overflow-hidden relative cursor-pointer hover:border-slate-350 shadow-sm hover:shadow-md transition-all duration-300 h-[68px] sm:h-auto"
        >
          <img 
            src={venue.mapImage || "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=300&auto=format&fit=crop"} 
            alt="Mini Map view" 
            className="w-full h-full object-cover brightness-[0.95]"
          />
          <div className="absolute inset-0 bg-slate-900/10 hover:bg-transparent transition-colors"></div>
          
          {/* Pulsing Pin Indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div className="w-5 h-5 bg-ticket-orange/30 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-ticket-orange rounded-full animate-ping"></div>
              <div className="absolute w-2 h-2 bg-ticket-orange rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Map Modal Overlay */}
      {mapOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setMapOpen(false)}
        >
          <div 
            className="bg-[#FAF9F6] border border-slate-200 max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up"
            style={{ animationDuration: '0.4s' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-ticket-orange" /> Location Map
                </h3>
                <p className="text-xs text-slate-500 mt-1">{venue.location}</p>
              </div>
              <button 
                onClick={() => setMapOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-850 hover:bg-slate-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Large Map Container */}
            <div className="relative h-96 w-full bg-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
                alt="Large Interactive Map" 
                className="w-full h-full object-cover"
              />
              {/* Overlay graphics */}
              <div className="absolute inset-0 bg-ticket-orange/5 mix-blend-overlay"></div>
              
              {/* Map Marker Info Window */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 flex flex-col items-center gap-1.5 max-w-[200px] animate-fade-in-up">
                <div className="text-[10px] font-black text-ticket-orange uppercase tracking-wider">Property Site</div>
                <div className="text-xs font-bold text-slate-800 text-center truncate w-full">{venue.name}</div>
                <div className="text-[10px] text-slate-400 font-semibold">{venue.location}</div>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(venue.name + ' ' + venue.location)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 bg-ticket-orange hover:bg-ticket-orange/95 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors shadow-sm"
                >
                  Open in Google Maps
                </a>
              </div>

              {/* Glowing pin element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-12 h-12 bg-ticket-orange/20 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-ticket-orange rounded-full border-2 border-white shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Directions / Info Panel */}
            <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
              <div>
                <span>Estimated safety rating: </span>
                <span className="text-emerald-600 font-bold">{venue.safety} / 5.0</span>
              </div>
              <button 
                onClick={() => alert("Route directions details copied to clipboard!")}
                className="text-ticket-orange hover:text-ticket-orange/80 transition-colors uppercase font-bold text-[10px]"
              >
                Copy directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VenueFeatures;
