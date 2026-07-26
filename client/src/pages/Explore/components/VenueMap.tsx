import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useVenuePins, type VenuePin } from '@/hooks/useVenuePins';
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MAP_MAX_ZOOM,
  MAP_DEBOUNCE_MS,
} from '@/constants/map';

interface VenueMapProps {
  onBBoxChange?: (bbox: { swLng: number; swLat: number; neLng: number; neLat: number }) => void;
  selectedVenueId?: string;
  onPinClick?: (venue: VenuePin) => void;
  venues?: Array<{
    _id: string;
    name: string;
    location: { coordinates: [number, number] };
    coverImage: string;
    avgRating?: number;
  }>;
}

export function VenueMap({ onBBoxChange, selectedVenueId, onPinClick, venues }: VenueMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { pins, fetchPins, loading, error } = useVenuePins();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchPinsRef = useRef(fetchPins);
  const onBBoxChangeRef = useRef(onBBoxChange);

  useEffect(() => {
    fetchPinsRef.current = fetchPins;
    onBBoxChangeRef.current = onBBoxChange;
  }, [fetchPins, onBBoxChange]);

  useEffect(() => {
    // Initialize map
    const initMap = () => {
      try {
        if (!mapContainer.current) return;

        // Create map centered on Kerala, India
        const map = L.map(mapContainer.current, {
          center: DEFAULT_MAP_CENTER,
          zoom: DEFAULT_MAP_ZOOM,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: MAP_MAX_ZOOM,
        }).addTo(map);

        mapRef.current = map;

        // Fetch pins on map move
        const handleMapMove = () => {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

          const timer = setTimeout(() => {
            const bounds = map.getBounds();
            const bbox = {
              swLng: bounds.getWest(),
              swLat: bounds.getSouth(),
              neLng: bounds.getEast(),
              neLat: bounds.getNorth(),
            };
            onBBoxChangeRef.current?.(bbox);
            fetchPinsRef.current(bbox);
          }, MAP_DEBOUNCE_MS);

          debounceTimerRef.current = timer;
        };

        map.on('moveend', handleMapMove);

        // Fetch initial pins
        const initialBounds = map.getBounds();
        fetchPinsRef.current({
          swLng: initialBounds.getWest(),
          swLat: initialBounds.getSouth(),
          neLng: initialBounds.getEast(),
          neLat: initialBounds.getNorth(),
        });

        return () => {
          map.off('moveend', handleMapMove);
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        };
      } catch (err) {
        console.error('Failed to initialize map:', err);
      }
    };

    initMap();
  }, []);

  // Add/update markers when pins or venues change
  useEffect(() => {
    if (!mapRef.current) return;

    const pinsToShow =
      venues && venues.length > 0
        ? venues.map((v) => ({
            _id: v._id,
            name: v.name,
            location: v.location,
            coverImage: v.coverImage,
            avgRating: v.avgRating || 0,
          }))
        : pins;

    if (!pinsToShow.length) return;

    const updateMarkers = () => {
      // Clear existing markers
      if (mapRef.current?.eachLayer) {
        mapRef.current.eachLayer((layer: unknown) => {
          if (L.Marker && layer instanceof L.Marker && mapRef.current?.removeLayer) {
            mapRef.current.removeLayer(layer);
          }
        });
      }

      // Add new markers
      pinsToShow.forEach((pin: VenuePin) => {
        const [lng, lat] = pin.location.coordinates;

        const marker = L.marker([lat, lng], {
          title: pin.name,
        }).addTo(mapRef.current!);

        // Popup with venue info — build DOM programmatically to prevent XSS
        const popupDiv = document.createElement('div');
        popupDiv.style.maxWidth = '200px';

        const img = document.createElement('img');
        // Validate coverImage is HTTPS to prevent protocol-based XSS
        if (pin.coverImage && pin.coverImage.startsWith('https://')) {
          img.src = pin.coverImage;
        } else {
          img.src = '/placeholder-venue.png'; // Fallback to safe placeholder
        }
        img.alt = pin.name;
        img.style.cssText =
          'width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;';
        popupDiv.appendChild(img);

        const title = document.createElement('h4');
        title.textContent = pin.name;
        title.style.cssText = 'margin: 0 0 4px 0; font-size: 14px;';
        popupDiv.appendChild(title);

        const rating = document.createElement('div');
        rating.textContent = `⭐ ${pin.avgRating.toFixed(1)}`;
        rating.style.cssText = 'font-size: 12px; color: var(--text-secondary);';
        popupDiv.appendChild(rating);

        marker.bindPopup(popupDiv);

        // Handle marker click
        marker.on('click', () => {
          onPinClick?.(pin);
        });

        // Highlight selected venue
        if (selectedVenueId === pin._id) {
          marker.setIcon(
            L.icon({
              iconUrl:
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            })
          );
        }
      });
    };

    try {
      updateMarkers();
    } catch (err) {
      console.error(err);
    }
  }, [pins, venues, selectedVenueId, onPinClick]);

  return (
    <div className="relative w-full h-full bg-[var(--bg-grey)]/20 rounded-lg overflow-hidden">
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
        }}
      />

      {loading && (
        <div className="absolute top-4 left-4 bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] px-3 py-2 rounded shadow text-sm text-[var(--text-secondary)]">
          Loading venues...
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-3 py-2 rounded shadow text-sm">
          {error}
        </div>
      )}

      <div className="absolute top-4 right-4 bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] px-3 py-2 rounded shadow text-sm text-[var(--text-secondary)]">
        {pins.length} venue{pins.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
