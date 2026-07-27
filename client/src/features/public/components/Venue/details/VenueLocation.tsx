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

    // Custom marker icon matching primary pin style
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div class="w-9 h-9 rounded-full bg-primary border-4 border-background flex items-center justify-center shadow-xl"><span class="w-3 h-3 rounded-full bg-white animate-pulse"></span></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    L.marker(latLng, { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<b style="font-family: inherit; font-size: 14px;">${venueName}</b><br/><span style="font-size:12px; color:#71717a">${address.city}</span>`
      )
      .openPopup();

    mapInstance.current = map;

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
    <div className="py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Compass size={22} className="text-primary" />
          <h2 className="text-xl font-extrabold text-foreground tracking-tight">Location</h2>
        </div>
        {coordinates && (
          <span className="text-xs font-mono text-muted-foreground bg-surface border border-border/40 px-3 py-1 rounded-xl">
            {coordinates[1].toFixed(4)}° N, {coordinates[0].toFixed(4)}° E
          </span>
        )}
      </div>

      <div className="flex items-start gap-3 text-base text-foreground/85">
        <MapPin size={20} className="text-primary mt-0.5 shrink-0" />
        <p className="leading-relaxed font-normal">
          {address.street}, {address.city}, {address.district}, {address.state} - {address.pincode}
        </p>
      </div>

      <div
        ref={mapRef}
        className="h-[340px] w-full rounded-2xl overflow-hidden border border-border/50 shadow-md mt-4 z-0"
      />
    </div>
  );
}
