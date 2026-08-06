"use client";

import { fromSmallUnit } from "../lib/utils";


export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.name === "revenue" ? fromSmallUnit(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}
