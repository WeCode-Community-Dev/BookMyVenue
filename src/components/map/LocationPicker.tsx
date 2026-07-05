import React, { useState, useEffect, useRef } from "react";
import MapLibreGL from "maplibre-gl";
import { Map } from "@/components/ui/map";
import { MapMarker } from "./MapMarker";
import { MapControls } from "./MapControls";
import { OSM_STYLE, DEFAULT_ZOOM, DEFAULT_CENTER } from "./mapConfig";
import { Search, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddressInfo {
  formattedAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  value: { latitude: number; longitude: number } | null;
  onChange: (value: { latitude: number; longitude: number }) => void;
  onAddressPicked?: (addressInfo: AddressInfo) => void;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  onAddressPicked,
  className
}) => {
  const mapRef = useRef<MapLibreGL.Map>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize display coordinates from value or default
  const lat = value ? value.latitude : DEFAULT_CENTER[1];
  const lng = value ? value.longitude : DEFAULT_CENTER[0];

  // Listen to map clicks to place marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e: MapLibreGL.MapMouseEvent) => {
      const coords = e.lngLat;
      onChange({ latitude: coords.lat, longitude: coords.lng });
      reverseGeocode(coords.lat, coords.lng);
    };

    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
  }, [onChange, mapRef.current]);

  // Sync viewport when value changes externally (e.g. after search)
  useEffect(() => {
    const map = mapRef.current;
    if (map && value) {
      map.jumpTo({
        center: [value.longitude, value.latitude],
        zoom: map.getZoom() < 12 ? DEFAULT_ZOOM : map.getZoom()
      });
    }
  }, [value, mapRef.current]);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "BookMyVenue/1.0.0"
          }
        }
      );
      if (!res.ok) throw new Error("Reverse geocoding failed");
      const data = await res.json();

      if (data && onAddressPicked) {
        const address = data.address || {};
        const formattedAddress = data.display_name || "";
        const city = address.city || address.town || address.village || address.suburb || address.county || "";
        const state = address.state || "";
        const country = address.country || "";
        const postalCode = address.postcode || "";

        onAddressPicked({
          formattedAddress,
          city,
          state,
          country,
          postalCode,
          latitude,
          longitude
        });
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      performSearch();
    }
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    performSearch();
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`,
        {
          headers: {
            "Accept-Language": "en",
            "User-Agent": "BookMyVenue/1.0.0"
          }
        }
      );
      if (!res.ok) throw new Error("Search request failed");
      const data = await res.json();

      if (data && data.length > 0) {
        const resultLat = parseFloat(data[0].lat);
        const resultLng = parseFloat(data[0].lon);

        onChange({ latitude: resultLat, longitude: resultLng });
        
        // Trigger reverse geocoding to retrieve structured address parts
        await reverseGeocode(resultLat, resultLng);

        // Center map
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [resultLng, resultLat],
            zoom: 15,
            duration: 1200
          });
        }
      } else {
        setErrorMsg("Address not found. Please try a different search.");
      }
    } catch (err) {
      console.error("Geocoding search error:", err);
      setErrorMsg("Geocoding service unavailable.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleMarkerDragEnd = (coords: { lng: number; lat: number }) => {
    onChange({ latitude: coords.lat, longitude: coords.lng });
    reverseGeocode(coords.lat, coords.lng);
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {/* Search Input Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search street address, city, or zip code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 bg-black/40 hover:bg-black/60 focus:bg-black/80 border border-white/10 focus:border-[#c5a059]/40 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none transition-all duration-200"
          />
          <Search className="w-4 h-4 text-white/30 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <Button
          type="button"
          onClick={handleSearchClick}
          disabled={isSearching}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 text-xs h-9 transition-all flex items-center gap-1.5"
        >
          {isSearching ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#c5a059]" />
          ) : (
            "Verify"
          )}
        </Button>
      </div>

      {errorMsg && (
        <p className="text-[10px] text-red-400 font-medium flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {errorMsg}
        </p>
      )}

      {/* Interactive Picker Map */}
      <div className="h-[320px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black">
        <Map
          ref={mapRef}
          className="h-full w-full"
          center={[lng, lat]}
          zoom={value ? DEFAULT_ZOOM : 4} // Zoom out initially if no coordinate is selected
          styles={{ light: OSM_STYLE, dark: OSM_STYLE }}
        >
          <MapControls showZoom showLocate showFullscreen />
          
          <MapMarker
            latitude={lat}
            longitude={lng}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </Map>
      </div>

      <div className="flex items-center justify-between text-[10px] text-white/40 bg-white/[0.01] border border-white/5 p-3 rounded-xl">
        <span>Click anywhere on the map or drag the marker to pin the exact venue location.</span>
        {value && (
          <span className="font-mono text-[#c5a059]">
            {lat.toFixed(5)}, {lng.toFixed(5)}
          </span>
        )}
      </div>
    </div>
  );
};
