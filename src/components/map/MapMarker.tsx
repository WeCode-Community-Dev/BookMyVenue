import React from "react";
import { MapMarker as BaseMapMarker, MarkerContent } from "@/components/ui/map";
import { MapPin } from "lucide-react";

interface MapMarkerProps {
  latitude: number;
  longitude: number;
  children?: React.ReactNode;
  draggable?: boolean;
  onDragEnd?: (coords: { lng: number; lat: number }) => void;
  onClick?: (e: MouseEvent) => void;
}

export const MapMarker: React.FC<MapMarkerProps> = ({
  latitude,
  longitude,
  children,
  draggable = false,
  onDragEnd,
  onClick
}) => {
  return (
    <BaseMapMarker
      latitude={latitude}
      longitude={longitude}
      draggable={draggable}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <MarkerContent>
        {children || (
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#c5a059] shadow-lg shadow-[#c5a059]/30 border border-black/20 hover:scale-110 transition-transform cursor-pointer">
            <MapPin className="h-4.5 w-4.5 text-black font-bold" />
          </div>
        )}
      </MarkerContent>
    </BaseMapMarker>
  );
};
