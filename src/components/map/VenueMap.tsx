import React, { useState, useEffect } from "react";
import { Map } from "@/components/ui/map";
import { MapMarker } from "./MapMarker";
import { MapPopup } from "./MapPopup";
import { MapControls } from "./MapControls";
import { OSM_STYLE, DEFAULT_ZOOM } from "./mapConfig";
import { ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VenueMapProps {
  latitude?: number | null;
  longitude?: number | null;
  venueName: string;
  address: string;
  zoom?: number;
}

export const VenueMap: React.FC<VenueMapProps> = ({
  latitude,
  longitude,
  venueName,
  address,
  zoom = DEFAULT_ZOOM
}) => {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setCoords([longitude, latitude]);
      setErrorMsg(null);
    } else if (address) {
      // Dynamic geocoding fallback
      setIsGeocoding(true);
      setErrorMsg(null);
      
      const cleanAddress = address.trim();
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          cleanAddress
        )}&limit=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "BookMyVenue/1.0.0"
          }
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setCoords([lon, lat]);
          } else {
            setErrorMsg("Could not verify location coordinates on the map.");
          }
        })
        .catch((err) => {
          console.error("Geocoding error:", err);
          setErrorMsg("Could not load map: offline or connection error.");
        })
        .finally(() => {
          setIsGeocoding(false);
        });
    }
  }, [latitude, longitude, address]);

  const handleOpenGoogleMaps = () => {
    if (!coords) return;
    const [lng, lat] = coords;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  if (isGeocoding) {
    return (
      <div className="h-[320px] w-full bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm text-white/50">Locating venue on map...</span>
      </div>
    );
  }

  if (errorMsg || !coords) {
    return (
      <div className="h-[320px] w-full bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <MapPin className="w-8 h-8 text-white/30 mb-2" />
        <span className="text-sm font-semibold text-white/70">Map View Unavailable</span>
        <span className="text-xs text-white/40 mt-1 max-w-xs">{errorMsg || "Address is missing or invalid."}</span>
        {address && (
          <Button
            variant="link"
            className="text-xs text-[#c5a059] hover:text-[#b08e4d] mt-2 flex items-center gap-1.5"
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank")}
          >
            Search on Google Maps <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    );
  }

  const [lng, lat] = coords;

  return (
    <div className="space-y-3.5">
      <div className="h-[320px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black">
        <Map
          className="h-full w-full"
          center={coords}
          zoom={zoom}
          styles={{ light: OSM_STYLE, dark: OSM_STYLE }}
        >
          <MapControls showZoom showLocate showFullscreen />
          
          <MapMarker
            latitude={lat}
            longitude={lng}
            onClick={() => setShowPopup(true)}
          />

          {showPopup && (
            <MapPopup
              latitude={lat}
              longitude={lng}
              onClose={() => setShowPopup(false)}
            >
              <h5 className="font-semibold text-xs text-[#c5a059] truncate">{venueName}</h5>
              <p className="text-[10px] text-white/70 mt-1 line-clamp-2 leading-relaxed">{address}</p>
            </MapPopup>
          )}
        </Map>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleOpenGoogleMaps}
          variant="outline"
          className="bg-white/5 hover:bg-white/10 text-white border-white/10 rounded-full h-8 text-[11px] px-4 flex items-center gap-1.5 shadow-md active:scale-97 transition-all"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3 text-[#c5a059]" />
        </Button>
      </div>
    </div>
  );
};
