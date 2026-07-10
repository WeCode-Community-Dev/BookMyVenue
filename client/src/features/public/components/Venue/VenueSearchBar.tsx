import { Search } from 'lucide-react';

interface VenueSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VenueSearchBar({ value, onChange }: VenueSearchBarProps) {
  return (
    <div className="relative flex-1 max-w-lg">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or description..."
        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
      />
    </div>
  );
}
