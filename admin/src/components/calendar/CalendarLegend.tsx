export function CalendarLegend({
  hasTempBlock,
  hasInactivityBlock,
}: {
  hasTempBlock?: boolean;
  hasInactivityBlock?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {[
        { color: "bg-zinc-200", label: "Past / Unavailable" },
        {
          color: "bg-blue-100 border border-blue-300",
          label: "Booked by customer",
        },
        {
          color: "bg-red-100 border border-red-300",
          label: "Blocked by you",
        },
        ...(hasTempBlock
          ? [
              {
                color: "bg-amber-100 border border-amber-300",
                label: "Temporarily blocked",
              },
            ]
          : []),
        ...(hasInactivityBlock
          ? [
              {
                color: "bg-purple-100 border border-purple-300",
                label: "Inactive period",
              },
            ]
          : []),
        { color: "bg-white border border-zinc-300", label: "Available" },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`h-4 w-4 rounded ${color}`} />
          <span className="text-zinc-600">{label}</span>
        </div>
      ))}
    </div>
  );
}
