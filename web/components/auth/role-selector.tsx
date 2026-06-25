"use client";

import { Check, Search, Store } from "lucide-react";

import { cn } from "@/lib/utils";

export type UserRole = "CUSTOMER" | "VENUE_OWNER";

type RoleSelectorProps = {
  value: UserRole;
  onChange: (role: UserRole) => void;
};

const roles = [
  {
    value: "CUSTOMER" as const,
    label: "Looking for venues",
    icon: Search,
  },
  {
    value: "VENUE_OWNER" as const,
    label: "I own a venue",
    icon: Store,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-on-surface">Select Your Role</p>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const isSelected = value === role.value;
          const Icon = role.icon;

          return (
            <button
              key={role.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(role.value)}
              className={cn(
                "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
                isSelected
                  ? "border-surface-tint bg-primary-container/30"
                  : "border-outline-variant bg-background hover:bg-muted/50"
              )}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-surface-tint">
                  <Check className="size-2.5 text-white" strokeWidth={3} />
                </span>
              )}
              <Icon
                className={cn(
                  "size-5",
                  isSelected ? "text-surface-tint" : "text-muted-foreground"
                )}
              />
              <span className="text-sm font-medium text-on-surface">
                {role.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
