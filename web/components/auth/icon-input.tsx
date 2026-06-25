import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type IconInputProps = React.ComponentProps<typeof Input> & {
  label: string;
  icon?: React.ReactNode;
  labelAction?: React.ReactNode;
};

export function IconInput({
  label,
  icon,
  labelAction,
  className,
  id,
  ...props
}: IconInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={inputId} className="text-sm font-medium text-on-surface">
          {label}
        </Label>
        {labelAction}
      </div>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
        )}
        <Input
          id={inputId}
          className={cn("h-10", icon && "pl-9", className)}
          {...props}
        />
      </div>
    </div>
  );
}
