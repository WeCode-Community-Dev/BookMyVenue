import React from "react";
import { cn } from "@/lib/utils";

interface VenueSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  id?: string;
}

export default function VenueSection({ title, children, className, action, id }: VenueSectionProps) {
  return (
    <section id={id} className={cn("py-8 border-b border-slate-200/80 last:border-0", className)}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </section>
  );
}
