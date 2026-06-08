import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VenueMap = ({ venues }) => {
  const navigate = useNavigate();
  
  // Calculate center based on venues, or default to a central location (e.g., NY)
  const defaultCenter = [40.7128, -74.0060];
  const mapCenter = venues.length > 0 && venues[0].latitude && venues[0].longitude 
    ? [venues[0].latitude, venues[0].longitude] 
    : defaultCenter;

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 z-0">
      <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {venues.map(venue => {
          if (!venue.latitude || !venue.longitude) return null;
          
          return (
            <Marker key={venue.id} position={[venue.latitude, venue.longitude]}>
              <Popup>
                <div className="text-center p-1">
                  <h3 className="font-bold text-slate-800">{venue.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{venue.location}</p>
                  <p className="font-semibold text-primary-600 mb-3">${venue.price_per_hour}/hr</p>
                  <button 
                    onClick={() => navigate(`/venue/${venue.id}`, { state: { venue } })}
                    className="w-full bg-primary-600 text-white py-1 px-3 rounded-md text-sm hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default VenueMap;
