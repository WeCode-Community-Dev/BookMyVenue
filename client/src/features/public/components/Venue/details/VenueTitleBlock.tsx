import { MapPin } from 'lucide-react';

interface VenueTitleBlockProps {
  categoryName: string;
  venueName: string;
  city: string;
  state: string;
}

export default function VenueTitleBlock({
  categoryName,
  venueName,
  city,
  state,
}: VenueTitleBlockProps) {
  console.log('the category',categoryName)
  return (
    <div className="space-y-2">
      <span className="inline-flex items-center rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
        {categoryName}
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{venueName}</h1>
      <div className="flex items-center gap-1.5 text-sm text-muted">
        <MapPin size={14} className="shrink-0" />
        <span>
          {city}, {state}
        </span>
      </div>
    </div>
  );
}
