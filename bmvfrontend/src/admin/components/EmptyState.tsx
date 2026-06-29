"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: "default" | "error";
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center mb-4",
            variant === "error"
              ? "bg-red-50 text-red-400"
              : "bg-[#E6F1F1] text-[#0D7377]"
          )}
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-[#1A1A19] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#70706e] max-w-xs mb-5">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-[#0D7377] hover:bg-[#0a5b5e] text-white rounded-xl text-sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
