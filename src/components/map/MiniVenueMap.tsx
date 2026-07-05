import React, { useState, useEffect } from "react";
import { Map } from "@/components/ui/map";
import { MapMarker } from "./MapMarker";
import { OSM_STYLE, DEFAULT_ZOOM } from "./mapConfig";
import { MapPin } from "lucide-react";

interface MiniVenueMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  zoom?: number;
}

export const MiniVenueMap: React.FC<MiniVenueMapProps> = ({
  latitude,
  longitude,
  address,
  zoom = DEFAULT_ZOOM - 1
}) => {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      setCoords([longitude, latitude]);
    } else if (address) {
      setIsGeocoding(true);
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "BookMyVenue/1.0.0"
          }
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setCoords([lon, lat]);
          }
        })
        .catch((err) => console.error("MiniMap geocoding error:", err))
        .finally(() => setIsGeocoding(false));
    }
  }, [latitude, longitude, address]);

  if (isGeocoding) {
    return (
      <div className="h-full w-full bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center">
        <div className="w-5 h-5 border border-[#c5a059] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="h-full w-full bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-center p-3 text-center text-white/30">
        <MapPin className="w-5 h-5" />
      </div>
    );
  }

  const [lng, lat] = coords;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-white/10 relative bg-black">
      <Map
        className="h-full w-full"
        center={coords}
        zoom={zoom}
        styles={{ light: OSM_STYLE, dark: OSM_STYLE }}
        interactive={false}
      >
        <MapMarker latitude={lat} longitude={lng} />
      </Map>
    </div>
  );
};
