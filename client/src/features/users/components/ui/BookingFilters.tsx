interface BookingFiltersProps {
  selected: string;
  onChange: (value: string) => void;
}

const filters = [
  {
    label: 'All Bookings',
    value: 'ALL',
  },
  {
    label: 'Upcoming',
    value: 'UPCOMING',
  },
  {
    label: 'Pending Payment',
    value: 'PENDING_PAYMENT',
  },
  {
    label: 'Completed',
    value: 'COMPLETED',
  },
  {
    label: 'Cancelled',
    value: 'CANCELLED',
  },
];

const BookingFilters = ({ selected, onChange }: BookingFiltersProps) => {
  return (
    <div className="bg-surface rounded-2xl border border-border p-4 shadow-sm">
      <div className="flex flex-wrap gap-2.5">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
              ${
                selected === filter.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-transparent border border-border text-foreground hover:bg-muted/30'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingFilters;
