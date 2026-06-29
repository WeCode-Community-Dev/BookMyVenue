"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const IconComp = variant === "info" ? Info : AlertTriangle;

  const iconBg = {
    destructive: "bg-red-50",
    warning: "bg-amber-50",
    info: "bg-[#E6F1F1]",
  }[variant];

  const iconColor = {
    destructive: "text-red-500",
    warning: "text-amber-500",
    info: "text-[#0D7377]",
  }[variant];

  const confirmBg = {
    destructive: "bg-red-500 hover:bg-red-600",
    warning: "bg-amber-500 hover:bg-amber-600",
    info: "bg-[#0D7377] hover:bg-[#0a5b5e]",
  }[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />
      {/* Dialog card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-slide-up">
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 h-7 w-7 rounded-lg flex items-center justify-center text-[#70706e] hover:bg-[#F0F0EC] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center mb-4",
            iconBg
          )}
        >
          <IconComp className={cn("h-6 w-6", iconColor)} />
        </div>

        <h3 className="text-base font-bold text-[#1A1A19] mb-1">{title}</h3>
        <p className="text-sm text-[#70706e] mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-[#E2E2DE] text-[#70706e] rounded-xl hover:bg-[#F0F0EC]"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            className={cn(
              "flex-1 rounded-xl text-white flex items-center gap-1.5",
              confirmBg
            )}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
