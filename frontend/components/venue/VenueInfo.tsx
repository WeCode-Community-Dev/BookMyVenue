import React from "react";
import { Users, Info, Calendar, Sparkles } from "lucide-react";

interface VenueInfoProps {
  capacity: number;
  category: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  city: string;
}

export default function VenueInfo({ capacity, category, rating, reviewCount, startingPrice, city }: VenueInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const infoItems = [
    {
      icon: <Users className="size-5 text-rose-600" />,
      title: "Capacity Limit",
      value: `${capacity} Guests Max`,
      desc: "Perfect layout configuration",
    },
    {
      icon: <Sparkles className="size-5 text-rose-600" />,
      title: "Category",
      value: category,
      desc: "Premium event type space",
    },
    {
      icon: <Info className="size-5 text-rose-600" />,
      title: "Starting Rate",
      value: `${formatPrice(startingPrice)}/day`,
      desc: "Basic package starting cost",
    },
    {
      icon: <Calendar className="size-5 text-rose-600" />,
      title: "Availability Status",
      value: "Available",
      desc: "Instant booking confirmation",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-200/80">
      {infoItems.map((item, idx) => (
        <div key={idx} className="bg-slate-50 border border-slate-200/40 rounded-2xl p-4 flex flex-col items-start gap-2 text-left shadow-xs transition-colors hover:bg-slate-100/40">
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-100/30">
            {item.icon}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5 leading-none">
              {item.title}
            </p>
            <p className="text-sm font-extrabold text-slate-900 leading-tight">
              {item.value}
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-none">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
