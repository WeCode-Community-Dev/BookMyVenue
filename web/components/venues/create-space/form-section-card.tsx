import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FormSectionCardProps = {
  title: string;
  icon: LucideIcon;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
};

export function FormSectionCard({
  title,
  icon: Icon,
  headerAction,
  children,
}: FormSectionCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border bg-background",
      )}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary-container/30 text-surface-tint">
            <Icon className="size-4" />
          </span>
          <h2 className="text-base font-semibold text-on-surface">{title}</h2>
        </div>
        {headerAction}
      </div>
      <div className="border-t border-outline-variant/30 px-5 py-4">{children}</div>
    </section>
  );
}
