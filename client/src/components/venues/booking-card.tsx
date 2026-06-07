// src/components/venues/booking-widget.tsx
"use client";

import { useState } from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BookingWidgetProps {
  pricePerHour: number;
  venueId: string;
}

export function BookingCard({ pricePerHour, venueId }: BookingWidgetProps) {
  const [hours, setHours] = useState(4);
  const cleaningFee = 50;
  const serviceFee = 25;
  const total = pricePerHour * hours + cleaningFee + serviceFee;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl sticky top-24">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="text-3xl font-extrabold text-black">${pricePerHour}</span>
          <span className="text-gray-500 text-sm font-medium"> / hr</span>
        </div>
        <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-semibold">
          ★ 4.9 (48 reviews)
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-left text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" /> Select Date
          </span>
          <span className="text-xs text-gray-400">Choose</span>
        </button>

        <div className="flex items-center justify-between px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-sm font-medium text-gray-700">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" /> Duration
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setHours(Math.max(1, hours - 1))}
              className="w-7 h-7 bg-white rounded-md border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-100"
            >
              -
            </button>
            <span className="w-8 text-center">{hours} hrs</span>
            <button 
              onClick={() => setHours(hours + 1)}
              className="w-7 h-7 bg-white rounded-md border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600 font-medium border-b border-gray-100 pb-4 mb-4">
        <div className="flex justify-between">
          <span>${pricePerHour} x {hours} hours</span>
          <span className="text-black">${pricePerHour * hours}</span>
        </div>
        <div className="flex justify-between">
          <span>Cleaning fee</span>
          <span className="text-black">${cleaningFee}</span>
        </div>
        <div className="flex justify-between">
          <span>Service marketplace fee</span>
          <span className="text-black">${serviceFee}</span>
        </div>
      </div>

      <div className="flex justify-between items-baseline mb-6">
        <span className="text-base font-bold text-black">Total before taxes</span>
        <span className="text-2xl font-black text-black">${total}</span>
      </div>

      <button
        className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group shadow-lg"
      >
        <span>Reserve Space</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <p className="text-center text-xs text-gray-400 font-medium mt-3">
        You won't be charged yet
      </p>
    </div>
  );
}