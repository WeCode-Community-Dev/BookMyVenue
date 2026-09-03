interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

export function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-card px-4 py-3 shadow-lg">
        <p className="text-sm font-semibold text-zinc-800">{label}</p>
        <p className="text-sm text-emerald-600">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
}
