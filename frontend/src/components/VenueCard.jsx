import React from'react';
import { useNavigate } from'react-router-dom';

const VenueCard = ({ venue, onView, layout ='grid'}) => {
 const isList = layout ==='list';
 const navigate = useNavigate();
 const activeFeatures = Object.keys(venue.features || {}).filter(key => venue.features[key]);

 return (
 <div 
 onClick={() => {
 if (onView) onView(venue);
 navigate(`/venue/${venue.id}`, { state: { venue } });
 }}
 className={`h-full bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden hover:shadow-xl hover:border-slate-700 transition-all duration-300 group cursor-pointer ${
 layout ==='list'?'flex flex-col sm:flex-row':'flex flex-col'
 } animate-[slide-up_0.5s_ease-out]`}
 >
 <div className={`${layout ==='list'?'h-48 sm:h-auto sm:w-1/3 shrink-0':'h-48'} relative overflow-hidden ${(!venue.photos || venue.photos.length === 0) ?'bg-gradient-to-br from-slate-800 to-indigo-900':'bg-slate-800'}`}>
 {venue.photos && venue.photos.length > 0 && (
 <img src={venue.photos[0]} alt={venue.name} className="absolute inset-0 w-full h-full object-cover"/>
 )}
 <div className="absolute inset-0 bg-black/20"></div>
 </div>
 
 <div className={`p-5 flex flex-col justify-between flex-1 ${layout ==='list'?'w-full sm:w-2/3':'w-full'}`}>
  <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-100 text-lg sm:text-xl truncate pr-3 group-hover:text-indigo-400 transition-colors">
              {venue.name}
            </h3>
            <div className="flex flex-col items-end shrink-0">
              {venue.dynamic_multiplier > 1.0 && (
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded flex items-center mb-1">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  High Demand
                </span>
              )}
              <span className="font-extrabold text-indigo-400 text-lg">
                ${venue.dynamic_price !== null ? venue.dynamic_price : venue.price_per_hour}
                <span className="text-sm font-normal text-slate-500">/hr</span>
              </span>
              {venue.dynamic_multiplier > 1.0 && (
                <span className="text-xs text-slate-500 line-through">${venue.price_per_hour}/hr</span>
              )}
            </div>
          </div>
 
 <div className="flex items-center text-slate-500 text-sm mb-4">
 <svg className="w-4 h-4 mr-1 shrink-0"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
 <span className="truncate">{venue.location}</span>
 </div>
 
 <div className="flex flex-wrap gap-2 mb-4">
 <span className="inline-flex items-center bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-700">
 <svg className="w-3.5 h-3.5 mr-1"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
 Up to {venue.capacity}
 </span>
 {activeFeatures.slice(0, 3).map((f) => (
 <span key={f} className="text-xs font-medium text-indigo-300 bg-indigo-900/30 px-2 py-1 rounded capitalize border border-indigo-800/30">
 {f}
 </span>
 ))}
 {activeFeatures.length > 3 && (
 <span className="text-xs font-medium text-slate-500 px-1 py-1">
 +{activeFeatures.length - 3} more
 </span>
 )}
 </div>
 </div>
 
 <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
 <div className="flex -space-x-2">
 <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-300">
 4.8
 </div>
 <div className="w-8 h-8 rounded-full bg-indigo-900/50 border-2 border-slate-900 flex items-center justify-center text-xs text-indigo-400">
 <svg className="w-4 h-4"fill="currentColor"viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
 </div>
 </div>
 <span className="text-indigo-400 font-medium text-sm group-hover:translate-x-1 transition-transform flex items-center">
 View details
 <svg className="w-4 h-4 ml-1"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M9 5l7 7-7 7"></path></svg>
 </span>
 </div>
 </div>
 </div>
 );
};

export default React.memo(VenueCard);
