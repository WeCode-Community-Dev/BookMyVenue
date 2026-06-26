"use client";

import * as React from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PasswordFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" 
> & {
  label?: string;
  showForgotPassword?: boolean;
};

export function PasswordField({
  label = "Password",
  showForgotPassword = true,
  className,
  id,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputId = id ?? "password";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={inputId} className="text-sm font-medium text-on-surface">
          {label}
        </Label>
        {showForgotPassword && (
          <a
            href="#"
            className="text-sm font-medium text-surface-tint hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </a>
        )}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
          <Lock className="size-4" />
        </span>
        <Input
          id={inputId}
          type={showPassword ? "text" : "password"}
          className={cn("h-10 pr-10 pl-9", className)}
          {...props}
        />
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-on-surface"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
