import type { ReactNode } from "react";

export interface NavItem {
  title: string;
  path: string;
  icon: ReactNode;
}

export interface ReplyDialogState {
  open: boolean;
  reviewId?: string;
  currentText?: string;
}

export interface ReportDialogState {
  open: boolean;
  reviewId?: string;
}

export interface TooltipProps {
  active?: boolean;
  payload?: unknown[];
  label?: string;
}

export interface OfflineForm {
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  amountPaid: string;
}

export interface ReviewActionDialogState {
  open: boolean;
  action: "remove" | "reject_hide" | "restore" | "approve_hide" | null;
  reviewId: string | null;
}

export interface VenueDialogState {
  open: boolean;
  venueId?: string;
}
