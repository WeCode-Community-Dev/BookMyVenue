import React from "react";
import { MapPopup as BaseMapPopup } from "@/components/ui/map";

interface MapPopupProps {
  latitude: number;
  longitude: number;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  closeButton?: boolean;
}

export const MapPopup: React.FC<MapPopupProps> = ({
  latitude,
  longitude,
  onClose,
  children,
  className,
  closeButton = true
}) => {
  return (
    <BaseMapPopup
      latitude={latitude}
      longitude={longitude}
      onClose={onClose}
      closeButton={closeButton}
      className={className}
    >
      <div className="bg-[#0e0e12]/95 text-white backdrop-blur-md rounded-xl p-2.5 max-w-[240px] text-left border border-white/10 shadow-2xl">
        {children}
      </div>
    </BaseMapPopup>
  );
};
