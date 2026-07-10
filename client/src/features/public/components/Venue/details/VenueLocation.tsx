import { useEffect, useRef } from 'react';
import { Compass, MapPin } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface VenueLocationProps {
  address: Venue['address'];
  coordinates: number[]; // [longitude, latitude]
  venueName: string;
}

export default function VenueLocation({ address, coordinates, venueName }: VenueLocationProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current || !coordinates || coordinates.length < 2) return;

    // Leaflet uses [lat, lng]
    const latLng: L.LatLngExpression = [coordinates[1], coordinates[0]];

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView(latLng, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom marker icon matching red primary pin style
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div class="w-8 h-8 rounded-full bg-red-500 border-4 border-white flex items-center justify-center shadow-lg"><span class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    L.marker(latLng, { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<b style="font-family: inherit; font-size: 13px;">${venueName}</b><br/><span style="font-size:11px; color:#71717a">${address.city}</span>`
      )
      .openPopup();

    mapInstance.current = map;

    // Fix drawing sizing
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coordinates, venueName, address]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Compass size={18} className="text-primary" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Location</h2>
        </div>
        {coordinates && (
          <span className="text-[10px] font-mono text-muted bg-background border border-border px-2.5 py-1 rounded-lg">
            Lat: {coordinates[1].toFixed(5)}, Lng: {coordinates[0].toFixed(5)}
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-foreground leading-relaxed">
          {address.street}, {address.city}
          <br />
          {address.district}, {address.state} - {address.pincode}
        </p>
      </div>

      <div
        ref={mapRef}
        className="h-[300px] w-full rounded-xl overflow-hidden border border-border shadow-inner mt-4 z-0"
      />
    </div>
  );
}
