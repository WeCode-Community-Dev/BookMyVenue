import { MapPin } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mapWidget } from "@/lib/data/dashboard";

export function MapWidget() {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardHeader className="px-6 pt-6 pb-0">
        <CardTitle className="text-base font-semibold text-on-surface">
          Map View
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-4 pb-6">
        <div className="relative h-56 overflow-hidden rounded-lg bg-linear-to-br from-surface-container via-primary-container/20 to-secondary-container/30">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 size-3 rounded-full bg-surface-tint" />
            <div className="absolute top-1/2 left-1/2 size-3 rounded-full bg-surface-tint" />
            <div className="absolute top-1/3 right-1/4 size-3 rounded-full bg-surface-tint" />
            <div className="absolute bottom-1/3 left-1/3 size-3 rounded-full bg-surface-tint" />
            <div className="absolute right-1/3 bottom-1/4 size-3 rounded-full bg-surface-tint" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(87,103,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(87,103,246,0.05)_1px,transparent_1px)] bg-size-[24px_24px]" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-surface-container-lowest/95 px-3 py-2 shadow-elevation-1 backdrop-blur-sm">
            <MapPin className="size-4 text-surface-tint" />
            <span className="text-xs font-medium text-on-surface">
              {mapWidget.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
