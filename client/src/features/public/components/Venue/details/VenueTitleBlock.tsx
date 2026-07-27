import { MapPin } from 'lucide-react';

interface VenueTitleBlockProps {
  venueName: string;
  city: string;
  state: string;
}

export default function VenueTitleBlock({
  venueName,
  city,
  state,
}: VenueTitleBlockProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
        {venueName}
      </h1>
      <div className="flex items-center gap-2 text-base text-muted font-medium">
        <MapPin size={18} className="shrink-0 text-primary" />
        <span>
          {city}, {state}
        </span>
      </div>
    </div>
  );
}
