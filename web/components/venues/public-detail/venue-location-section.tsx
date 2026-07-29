"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";

import type { VenueDetails } from "@/lib/data/venues";
import {
  getNeighborhoodDescription,
  getTransportDescription,
} from "@/lib/data/public-venue-detail";

type VenueLocationSectionProps = {
  venue: VenueDetails;
};

export function VenueLocationSection({ venue }: VenueLocationSectionProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const lat = parseFloat(venue.latitude);
  const lng = parseFloat(venue.longitude);
  const hasCoordinates = !Number.isNaN(lat) && !Number.isNaN(lng);

  useEffect(() => {
    if (!mapContainer.current || !hasCoordinates) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [lng, lat],
      zoom: 14,
      interactive: false,
    });

    new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);

    map.on("load", () => map.resize());

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
    };
  }, [lat, lng, hasCoordinates]);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-on-surface">Where you&apos;ll be</h2>

      {hasCoordinates ? (
        <div
          ref={mapContainer}
          className="h-64 w-full overflow-hidden rounded-xl sm:h-80"
        />
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl bg-linear-to-br from-surface-container-low to-surface-container-high sm:h-80">
          <MapPin className="size-10 text-surface-tint/50" />
        </div>
      )}

      <div className="flex flex-col gap-2 text-sm text-on-surface-variant leading-relaxed">
        <p>{getNeighborhoodDescription(venue.city)}</p>
        <p>{getTransportDescription(venue.city)}</p>
      </div>
    </section>
  );
}
