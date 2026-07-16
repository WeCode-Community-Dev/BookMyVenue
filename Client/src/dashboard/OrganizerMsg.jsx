import React from "react";
import { MailPlus, TriangleAlert } from "lucide-react";

function OrganizerMsg() {
  return (
    <div
      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-slate-350
     hover:-translate-y-1.5 transition-all
      duration-400 select-none  flex flex-col justify-between animate-fade-in-up"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            <MailPlus className="w-5 h-5 text-ticket-orange " />
            Messages
          </h3>
          <p className="text-slate-400 text-xs mt-1 font-semibold">
            Messages from admin or users...
          </p>
        </div>
      </div>

      <div className="bg-slate-200 w-full rounded-md p-5 ">
        <div className="flex gap-2 justify-center items-center">
          <TriangleAlert className="text-rose-500" />
          <h1 className="text-sm">No message available....</h1>
        </div>
      </div>
    </div>
  );
}

export default OrganizerMsg;
