"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: number; // positive = up, negative = down, 0 = flat
  trendLabel?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  subValue,
  trend,
  trendLabel,
  icon,
  iconBg = "bg-[#E6F1F1]",
  iconColor = "text-[#0D7377]",
  className,
  loading = false,
}: StatCardProps) {
  const TrendIcon =
    trend === undefined || trend === 0
      ? Minus
      : trend > 0
      ? TrendingUp
      : TrendingDown;

  const trendColor =
    trend === undefined || trend === 0
      ? "text-[#70706e]"
      : trend > 0
      ? "text-emerald-600"
      : "text-red-500";

  if (loading) {
    return (
      <div
        className={cn(
          "bg-white rounded-2xl border border-[#E2E2DE] p-5 shadow-xs animate-pulse",
          className
        )}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-24 bg-neutral-200 rounded" />
            <div className="h-7 w-16 bg-neutral-200 rounded" />
            <div className="h-3 w-20 bg-neutral-100 rounded" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#E2E2DE] p-5 shadow-xs hover:shadow-sm transition-shadow",
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wide text-[#70706e] block mb-1">
            {title}
          </span>
          <span className="text-2xl font-bold text-[#1A1A19] block font-sans">
            {value}
          </span>
          {subValue && (
            <span className="text-[10px] text-[#70706e] block mt-0.5">
              {subValue}
            </span>
          )}
          {trend !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-[10px] font-semibold mt-1.5",
                trendColor
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {Math.abs(trend)}% {trendLabel ?? "this month"}
            </span>
          )}
        </div>
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ml-3",
            iconBg,
            iconColor
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
