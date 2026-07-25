import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-start gap-2.5 select-none">
        <input
          type="checkbox"
          id={id}
          className={cn(
            "size-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500/20 focus:ring-3 focus:outline-none transition-all cursor-pointer accent-rose-600 shrink-0 mt-0.5",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-600 cursor-pointer leading-tight">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
