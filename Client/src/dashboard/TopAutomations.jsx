import React, { useState } from "react";
import { UserPen } from "lucide-react";

export default function TopAutomations({ organizers }) {
  // console.log("f..", organizers);

  return (
    <div
      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-slate-350
     hover:-translate-y-1.5 transition-all
      duration-400 select-none  flex flex-col justify-between animate-fade-in-up"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <UserPen className="w-5 h-5 text-ticket-orange fill-current" />
            Organizers List
          </h3>
          <p className="text-slate-400 text-xs mt-1 font-semibold">
            Best performing marketing sequences.
          </p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {organizers.map((item, index) => {
          return (
            <div
              key={index}
              className="p-4 border rounded-2xl cursor-pointer transition-all duration-350 animate-fade-in-stagger $
                isSelected 
                   border-ticket-orange bg-slate-50 shadow-sm "
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.userName}
                  </h4>
                  <div className="flex flex-col  gap-2 mt-1 text-[10px] ">
                    <div className="flex gap-5">
                      <h2 className="text-slate-400 font-medium">Email</h2>
                      <h2 className="text-black" font-bold>
                        {" "}
                        {item.email}{" "}
                      </h2>
                    </div>
                    <div className="flex gap-5">
                      <h2 className="text-slate-400 font-medium">Number</h2>
                      <h2 className="text-black" font-bold>
                        {" "}
                        {item.number}{" "}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
