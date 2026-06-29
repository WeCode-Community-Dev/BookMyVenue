"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Send,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
} from "lucide-react";

export interface TimelineStep {
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED" | "UPDATED";
  label: string;
  timestamp?: string;
  note?: string;
  actor?: string;
  completed: boolean;
  active?: boolean;
}

const stepIcons: Record<string, React.ElementType> = {
  SUBMITTED: Send,
  UNDER_REVIEW: Eye,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  CHANGES_REQUESTED: MessageSquare,
  UPDATED: Clock,
};

const stepColors: Record<string, { dot: string; line: string; icon: string }> = {
  SUBMITTED: {
    dot: "bg-[#0D7377]",
    line: "bg-[#0D7377]",
    icon: "text-[#0D7377]",
  },
  UNDER_REVIEW: {
    dot: "bg-amber-400",
    line: "bg-amber-400",
    icon: "text-amber-500",
  },
  APPROVED: {
    dot: "bg-emerald-500",
    line: "bg-emerald-500",
    icon: "text-emerald-600",
  },
  REJECTED: {
    dot: "bg-red-500",
    line: "bg-red-500",
    icon: "text-red-600",
  },
  CHANGES_REQUESTED: {
    dot: "bg-blue-500",
    line: "bg-blue-500",
    icon: "text-blue-600",
  },
  UPDATED: {
    dot: "bg-purple-500",
    line: "bg-purple-500",
    icon: "text-purple-600",
  },
};

interface VerificationTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function VerificationTimeline({
  steps,
  className,
}: VerificationTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, idx) => {
        const Icon = stepIcons[step.status] ?? Clock;
        const colors = stepColors[step.status] ?? {
          dot: "bg-neutral-300",
          line: "bg-neutral-200",
          icon: "text-neutral-500",
        };
        const isLast = idx === steps.length - 1;

        return (
          <div key={idx} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2",
                  step.completed
                    ? `${colors.dot} border-transparent`
                    : step.active
                    ? "bg-white border-[#0D7377]"
                    : "bg-neutral-100 border-neutral-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    step.completed
                      ? "text-white"
                      : step.active
                      ? colors.icon
                      : "text-neutral-400"
                  )}
                />
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 my-1 min-h-4",
                    step.completed ? colors.line : "bg-neutral-200"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("pb-5 min-w-0 flex-1", isLast && "pb-0")}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    step.completed || step.active
                      ? "text-[#1A1A19]"
                      : "text-neutral-400"
                  )}
                >
                  {step.label}
                </span>
                {step.timestamp && (
                  <span className="text-[10px] text-[#70706e] shrink-0">
                    {step.timestamp}
                  </span>
                )}
              </div>
              {step.actor && (
                <span className="text-[11px] text-[#70706e] block mt-0.5">
                  by {step.actor}
                </span>
              )}
              {step.note && (
                <div className="mt-2 text-xs text-[#70706e] bg-[#F0F0EC] rounded-lg px-3 py-2 leading-relaxed border border-[#E2E2DE]">
                  "{step.note}"
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
