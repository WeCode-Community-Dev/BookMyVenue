
export const STATUS_STYLES: Record<string, string> = {
  RESERVED: 'border-blue-500/20 bg-blue-500/10 text-blue-500',
  CONFIRMED: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  COMPLETED: 'border-purple-500/20 bg-purple-500/10 text-purple-500',
  CANCELLED: 'border-rose-500/20 bg-rose-500/10 text-rose-500',
};

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const SORT_OPTIONS = [
  { value: 'new-old', label: 'Newest First' },
  { value: 'old-new', label: 'Oldest First' },
  { value: 'a-z', label: 'Venue: A–Z' },
  { value: 'z-a', label: 'Venue: Z–A' },
  { value: 'price-high-low', label: 'Price: High → Low' },
  { value: 'price-low-high', label: 'Price: Low → High' },
  { value: 'guests-high-low', label: 'Guests: High → Low' },
  { value: 'guests-low-high', label: 'Guests: Low → High' },
];