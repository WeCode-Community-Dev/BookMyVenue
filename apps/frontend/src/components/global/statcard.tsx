import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subText: string;
  subTextColor?: string;
}

const StatsCard = ({
  icon,
  title,
  value,
  subText,
  subTextColor = "text-green-600",
}: StatsCardProps) => {
  return (
    <div className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="mt-1 text-4xl font-bold text-slate-900">
            {value}
          </h3>

          <p className={`mt-1 text-sm ${subTextColor}`}>
            {subText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;