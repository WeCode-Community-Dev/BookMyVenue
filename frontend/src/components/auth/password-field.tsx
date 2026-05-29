"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { inputClassName } from "@/components/auth/auth-split-layout";
import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
};

export function PasswordField({
  id,
  label,
  placeholder = "••••••••",
  autoComplete = "current-password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-label-md text-on-surface" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(inputClassName, "pr-12")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-text-muted transition-colors hover:text-on-surface"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="size-5" />
          ) : (
            <Eye className="size-5" />
          )}
        </button>
      </div>
    </div>
  );
}
