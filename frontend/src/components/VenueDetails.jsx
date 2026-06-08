import React, { useState, useEffect } from'react';
import { useParams, useNavigate, useLocation } from'react-router-dom';
import { fetchVenueById } from '../services/venueApi';

const VenueDetails = ({ onBook }) => {
 const { id } = useParams();
 const navigate = useNavigate();
 const location = useLocation();
 const [venue, setVenue] = useState(location.state?.venue || null);
 const [loading, setLoading] = useState(!location.state?.venue);
 const [error, setError] = useState('');
 const [mainImageIndex, setMainImageIndex] = useState(0);

 useEffect(() => {
 const getVenue = async () => {
 try {
 const data = await fetchVenueById(id);
 setVenue(data);
 } catch (err) {
 setError(err.message ||'Failed to load venue');
 } finally {
 setLoading(false);
 }
 };
 getVenue();
 }, [id]);

 if (loading) return <div className="p-20 text-center">Loading venue details...</div>;
 if (error || !venue) return <div className="p-20 text-center text-red-500">{error ||'Venue not found'}</div>;

 return (
 <div className="animate-fade-in pb-20">
 <button 
 onClick={() => navigate('/')}
 className="mb-6 flex items-center text-slate-500 hover:text-indigo-600 font-medium transition-colors"
 >
 <svg className="w-5 h-5 mr-2"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
 Back to Venues
 </button>

 <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800">
 {/* Hero Section */}
 <div className={`h-96 relative overflow-hidden ${(!venue.photos || venue.photos.length === 0) ?'bg-gradient-to-br from-slate-800 to-indigo-900':'bg-slate-800 transition-all duration-500'}`}>
 {venue.photos && venue.photos.length > 0 && (
 <img key={mainImageIndex} src={venue.photos[mainImageIndex]} alt={venue.name} className="absolute inset-0 w-full h-full object-cover animate-fade-in"/>
 )}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
 <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
 <div className="flex flex-col md:flex-row md:items-end justify-between">
 <div>
 <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 shadow-black drop-shadow-md">{venue.name}</h1>
 <p className="text-xl text-slate-300 flex items-center shadow-black drop-shadow-sm">
 <svg className="w-6 h-6 mr-2"fill="none"stroke="currentColor"viewBox="0 0 24 24">
 <path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
 <path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
 </svg>
 {venue.location}
 </p>
 </div>
 <div className="mt-6 md:mt-0 flex-shrink-0">
 <button 
 onClick={() => onBook(venue)}
 className="btn-primary py-4 px-8 text-lg font-bold shadow-2xl shadow-primary-500/50 hover:scale-105 transform transition-all flex items-center"
 >
 Book This Venue
 <svg className="w-5 h-5 ml-2"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Content Section */}
 <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
 {/* Main Description */}
 <div className="md:col-span-2 space-y-8">
 {venue.photos && venue.photos.length > 1 && (
 <div>
 <h3 className="text-xl font-bold text-slate-100 mb-4">Photo Gallery</h3>
 <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
 {venue.photos.map((photo, index) => (
 <div 
 key={index} 
 onClick={() => setMainImageIndex(index)}
 className={`relative w-32 h-24 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImageIndex === index ?'border-indigo-600 scale-105 shadow-md':'border-transparent hover:opacity-80'}`}
 >
 <img src={photo} alt={`${venue.name} ${index + 1}`} className="w-full h-full object-cover"/>
 </div>
 ))}
 </div>
 </div>
 )}
 
 <div>
 <h2 className="text-2xl font-bold text-slate-100 mb-4">About {venue.name}</h2>
 <p className="text-slate-400 leading-relaxed text-lg">
 Welcome to {venue.name}, a premier venue located in the heart of {venue.location}. 
 Perfect for hosting a wide range of events, this space offers everything you need to make your next gathering unforgettable. 
 With top-tier amenities and a versatile layout, it's the ideal choice for discerning hosts.
 </p>
 </div>
 
 {venue.features && Object.values(venue.features).some(v => v) && (
 <div>
 <h3 className="text-xl font-bold text-slate-100 mb-4">Amenities</h3>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
 {Object.keys(venue.features).map((key) => {
 if (!venue.features[key]) return null;
 const normalizedKey = key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
 
 const icons = {
 'Wi Fi': '📶',
 'Projector': '📽️',
 'Whiteboard': '📝',
 'Parking': '🅿️',
 'Air Conditioning': '❄️',
 'Catering': '🍽️',
 'Wheelchair Accessible': '♿',
 'Audio System': '🔊',
 };
 return (
 <div key={key} className="p-2.5 rounded-lg border bg-slate-800 border-slate-700 text-indigo-400 flex items-center space-x-2 transition-transform hover:scale-105 shadow-sm">
 <div className="text-xl shrink-0">{icons[normalizedKey] || '✨'}</div>
 <div className="text-sm font-semibold leading-tight">{normalizedKey}</div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </div>

 {/* Sidebar Info */}
 <div className="space-y-6">
 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-inner">
 <h3 className="text-lg font-bold text-slate-100 mb-4">Venue Details</h3>
 
 <div className="space-y-4">
 <div className="flex items-start">
 <div className="w-10 h-10 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 mr-4 shrink-0 border border-indigo-800/50">
 <svg className="w-5 h-5"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
 </div>
 <div>
 <p className="text-sm text-slate-400 font-medium">Maximum Capacity</p>
 <p className="text-lg font-bold text-slate-200">{venue.capacity} People</p>
 </div>
 </div>

 <div className="flex items-start">
 <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-400 mr-4 shrink-0 border border-green-800/50">
 <svg className="w-5 h-5"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
 </div>
 <div>
 <p className="text-sm text-slate-400 font-medium flex items-center">
  Pricing
  {venue.dynamic_multiplier > 1.0 && (
    <span className="ml-2 text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded flex items-center">
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
      High Demand
    </span>
  )}
 </p>
 <p className="text-lg font-bold text-slate-200 flex items-center gap-2">
 {venue.dynamic_price != null ? (
   <>
     <span>${venue.dynamic_price} / hr</span>
     {venue.dynamic_multiplier > 1.0 && (
       <span className="text-sm text-slate-500 line-through">${venue.price_per_hour} / hr</span>
     )}
   </>
 ) : venue.price_per_hour != null ? (
   `$${venue.price_per_hour} / hr`
 ) : (
   'Contact for pricing'
 )}
 </p>
 </div>
 </div>
 
 <div className="flex items-start">
 <div className="w-10 h-10 rounded-full bg-orange-900/30 flex items-center justify-center text-orange-400 mr-4 shrink-0 border border-orange-800/50">
 <svg className="w-5 h-5"fill="none"stroke="currentColor"viewBox="0 0 24 24"><path strokeLinecap="round"strokeLinejoin="round"strokeWidth="2"d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
 </div>
 <div>
 <p className="text-sm text-slate-400 font-medium">Inventory Type</p>
 <p className="text-lg font-bold text-slate-200 capitalize">
 {venue.inventory_type.replace('_','')}
 </p>
 </div>
 </div>
 </div>
 </div>
 
 </div>
 </div>
 </div>
 </div>
 );
};

export default VenueDetails;
