import type { CSSProperties } from "react";

interface LegendItem {
  color: string;
  label: string;
  style?: CSSProperties;
}

export function CalendarLegend({
  hasTempBlock,
  hasInactivityBlock,
}: {
  hasTempBlock?: boolean;
  hasInactivityBlock?: boolean;
}) {
  const items: LegendItem[] = [
    { color: "bg-zinc-200", label: "Past / Unavailable" },
    {
      color: "bg-blue-100 border border-blue-300",
      label: "Booked by customer",
    },
    {
      color: "bg-red-100 border border-red-300",
      label: "Blocked by you",
    },
    // One two-tone swatch for both, since past bookings and blocks keep their colour
    {
      color: "border border-zinc-300",
      label: "Past booking / block",
      style: {
        background: "linear-gradient(135deg, #eff6ff 0 50%, #fef2f2 50% 100%)",
      },
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
  ];

  return (
    <div className="flex flex-wrap gap-4 text-sm">
      {items.map(({ color, label, style }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`h-4 w-4 rounded ${color}`} style={style} />
          <span className="text-zinc-600">{label}</span>
        </div>
      ))}
    </div>
  );
}
