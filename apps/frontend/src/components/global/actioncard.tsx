"use client";

import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

type ProfileActionCardProps = {
  title: string;
  description: string;
  buttonText: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
};

export default function ProfileActionCard({
  title,
  description,
  buttonText,
  icon,
  iconBgColor = "bg-teal-50",
  iconColor = "text-teal-600",
}: ProfileActionCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-md">

      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${iconBgColor}`}
      >
        <div className={iconColor}>
          {icon}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 min-h-[48px] text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      <button className="mt-5 flex w-full items-center justify-between rounded-xl border border-teal-600 px-4 py-3 text-sm font-medium text-teal-700 transition hover:bg-teal-50">
        {buttonText}

        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}