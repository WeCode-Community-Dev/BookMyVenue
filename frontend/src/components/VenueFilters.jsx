import React, { useState } from'react';

const COMMON_FACILITIES = [
'WiFi','Projector','Whiteboard','Parking','Air Conditioning', 
'Catering','Wheelchair Accessible','Audio System'
];

function VenueFilters({ onApplyFilters }) {
 const [filters, setFilters] = useState({
 min_price:'',
 max_price:'',
 location:'',
 min_capacity:'',
 max_distance:'',
 facilities: [],
 user_lat:'',
 user_lng:''
 });

 const [geoLoading, setGeoLoading] = useState(false);
 const [geoError, setGeoError] = useState('');

 const handleChange = (e) => {
 const { name, value } = e.target;
 setFilters(prev => ({ ...prev, [name]: value }));
 };

 const handleFacilityToggle = (facility) => {
 setFilters(prev => {
 const isSelected = prev.facilities.includes(facility);
 if (isSelected) {
 return { ...prev, facilities: prev.facilities.filter(f => f !== facility) };
 } else {
 return { ...prev, facilities: [...prev.facilities, facility] };
 }
 });
 };

 const getUserLocation = () => {
 if (!navigator.geolocation) {
 setGeoError('Geolocation is not supported by your browser');
 return;
 }
 
 setGeoLoading(true);
 setGeoError('');
 
 navigator.geolocation.getCurrentPosition(
 (position) => {
 setFilters(prev => ({
 ...prev,
 user_lat: position.coords.latitude.toFixed(6),
 user_lng: position.coords.longitude.toFixed(6)
 }));
 setGeoLoading(false);
 },
 (error) => {
 setGeoError('Unable to retrieve your location');
 setGeoLoading(false);
 }
 );
 };

 const handleSliderEnd = (e) => {
 const newFilters = { ...filters, max_price: e.target.value };
 const cleanFilters = {};
 for (const [key, value] of Object.entries(newFilters)) {
 if (key === 'facilities') {
 if (value.length > 0) cleanFilters[key] = value.join(',');
 } else if (value !== '') {
 cleanFilters[key] = value;
 }
 }
 onApplyFilters(cleanFilters);
 };

 const handleSubmit = (e) => {
 if (e && e.preventDefault) e.preventDefault();
 const cleanFilters = {};
 for (const [key, value] of Object.entries(filters)) {
 if (key ==='facilities') {
 if (value.length > 0) cleanFilters[key] = value.join(',');
 } else if (value !=='') {
 cleanFilters[key] = value;
 }
 }
 onApplyFilters(cleanFilters);
 };

 const clearFilters = () => {
 const empty = {
 min_price:'', max_price:'', location:'', min_capacity:'',
 max_distance:'', facilities: [], user_lat:'', user_lng:''
 };
 setFilters(empty);
 onApplyFilters({});
 };

 return (
  <div className="backdrop-blur-xl bg-slate-900/60 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50 p-6 sticky top-28">
  <div className="flex items-center justify-between mb-6">
  <h3 className="text-lg font-bold text-slate-100 flex items-center">
  <svg className="w-5 h-5 mr-2 text-indigo-400"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
  Filters
  </h3>
  <button onClick={clearFilters} className="text-sm text-slate-400 hover:text-indigo-400 font-medium transition-colors">
  Clear all
  </button>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 {/* Price Filter */}
 <div>
  <label className="flex justify-between text-sm font-semibold text-slate-300 mb-2">
  <span>Max Price ($/hr)</span>
  <span className="text-indigo-400">${filters.max_price ? Number(filters.max_price).toLocaleString() : '1,000,000+'}</span>
 </label>
 <input 
 type="range" 
 name="max_price"
 min="1000" 
 max="1000000" 
 step="1000"
 value={filters.max_price || 1000000} 
 onChange={handleChange}
 onMouseUp={handleSliderEnd}
 onTouchEnd={handleSliderEnd}
  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
 />
 </div>

 {/* Location Filter */}
 <div>
  <label className="block text-sm font-semibold text-slate-300 mb-2">Location Name</label>
  <input 
  type="text"name="location"placeholder="e.g. Downtown"
  value={filters.location} onChange={handleChange}
  className="w-full rounded-lg border-slate-700/50 bg-slate-950/50 text-slate-100 placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
 />
 </div>

 {/* Distance Filter */}
  <div className="pt-4 border-t border-slate-700/50">
  <label className="block text-sm font-semibold text-slate-300 mb-2">Distance</label>
  <div className="mb-3">
  <button 
  type="button"
  onClick={getUserLocation}
  disabled={geoLoading}
  className={`w-full flex items-center justify-center px-3 py-2 border shadow-sm text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 ${filters.user_lat ? 'bg-indigo-900/40 text-indigo-300 border-indigo-700/50 shadow-[0_0_10px_rgba(79,70,229,0.2)]' : 'bg-slate-800 text-slate-300 border-slate-700/50 hover:bg-slate-700 hover:border-slate-600'}`}
  >
  <svg className={`w-4 h-4 mr-2 ${filters.user_lat ? 'text-indigo-400' : 'text-slate-400'} ${geoLoading ? 'animate-spin' : ''}`} fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
 {geoLoading ?'Locating...': (filters.user_lat ?'Location Found ✓':'Use My Location')}
 </button>
 {geoError && <p className="mt-2 text-xs text-red-400 bg-red-900/20 p-2 rounded-md border border-red-800/50">{geoError}</p>}
 </div>
  {(filters.user_lat || filters.user_lng) && (
  <div className="flex items-center space-x-2 animate-fade-in">
  <span className="text-sm text-slate-400 whitespace-nowrap">Within</span>
  <input 
  type="number"name="max_distance"placeholder="km"
  value={filters.max_distance} onChange={handleChange}
  className="w-full rounded-lg border-slate-700/50 bg-slate-950/50 text-slate-100 placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
  />
  <span className="text-sm text-slate-400">km</span>
 </div>
 )}
 </div>

 {/* Capacity Filter */}
  <div className="pt-4 border-t border-slate-700/50">
  <label className="block text-sm font-semibold text-slate-300 mb-2">Minimum Capacity</label>
  <input 
  type="number"name="min_capacity"placeholder="e.g. 50 people"
  value={filters.min_capacity} onChange={handleChange}
  className="w-full rounded-lg border-slate-700/50 bg-slate-950/50 text-slate-100 placeholder:text-slate-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
 />
 </div>

 {/* Facilities Filter */}
  <div className="pt-4 border-t border-slate-700/50">
  <label className="block text-sm font-semibold text-slate-300 mb-3">Required Facilities</label>
  <div className="flex flex-wrap gap-2">
  {COMMON_FACILITIES.map(facility => {
    const isSelected = filters.facilities.includes(facility);
    return (
      <button
        type="button"
        key={facility}
        onClick={() => handleFacilityToggle(facility)}
        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${isSelected ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.4)]' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700 hover:text-slate-200'}`}
      >
        {facility}
      </button>
    );
  })}
 </div>
 </div>

 <div className="pt-6 mt-2">
  <button 
  type="submit"
  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-[1.02]"
  >
 Apply Filters
 </button>
 </div>
 </form>
 </div>
 );
}

export default VenueFilters;
