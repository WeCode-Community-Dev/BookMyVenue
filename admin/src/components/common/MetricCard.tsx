import React from "react";

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="rounded-md border p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-zinc-900">
            {value}
          </p>
          <p className="text-xs text-zinc-400">{subtitle}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}
