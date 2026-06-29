"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";

type StatusVariant =
  | "PENDING_REVIEW"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED"
  | "DRAFT"
  | "active"
  | "inactive"
  | "suspended"
  | string;

const statusConfig: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  PENDING_REVIEW: {
    label: "Pending Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  RESUBMITTED: {
    label: "Resubmitted",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Clock,
  },
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  CHANGES_REQUESTED: {
    label: "Changes Requested",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: MessageSquare,
  },
  DRAFT: {
    label: "Draft",
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
    icon: FileText,
  },
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: UserCheck,
  },
  inactive: {
    label: "Inactive",
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
    icon: UserX,
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: UserX,
  },
  customer: {
    label: "Customer",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: UserCheck,
  },
  venue_owner: {
    label: "Venue Owner",
    className: "bg-[#E6F1F1] text-[#0D7377] border-[#0D7377]/20",
    icon: ShieldCheck,
  },
  admin: {
    label: "Admin",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    icon: ShieldCheck,
  },
};

interface StatusBadgeProps {
  status: StatusVariant;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  size = "sm",
  showIcon = true,
}: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-neutral-100 text-neutral-600 border-neutral-200",
    icon: Clock,
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        config.className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}
      {config.label}
    </span>
  );
}
