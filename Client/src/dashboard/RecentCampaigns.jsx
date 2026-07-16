import React, { useState } from "react";
import {
  MoreVertical,
  ChevronDown,
  Check,
  Play,
  Pause,
  Trash2,
  ArrowUpDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
} from "lucide-react";

export default function RecentCampaigns({ venue }) {


  return (
    <div
      className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md 
    hover:border-slate-350 hover:-translate-y-1.5 transition-all duration-300 select-none 
    max-h-96 flex flex-col justify-between animate-fade-in-up"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Venues List
          </h3>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto"></div>
      </div>

      {venue.length > 0 ? (
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left text-sm border-collapse min-w-[500px]">
            <thead>
              <tr
                className="border-b border-slate-100 bg-slate-200 text-slate-400 text-xs font-bold uppercase 
            tracking-wider sticky top-1 "
              >
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                  >
                    Venue <ArrowUpDown className="w-3 h-3 text-slate-300" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                  >
                    Status <ArrowUpDown className="w-3 h-3 text-slate-300" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort("sent")}
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                  >
                    Price <ArrowUpDown className="w-3 h-3 text-slate-300" />
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort("opens")}
                    className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                  >
                    Capacity <ArrowUpDown className="w-3 h-3 text-slate-300" />
                  </button>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {venue.map((row, index) => {
                const delayClass = `delay-${(index % 6) * 150}`;
                return (
                  <tr
                    key={row?._id}
                    className={`hover:bg-slate-50/50 transition-colors animate-fade-in-stagger ${delayClass}`}
                  >
                    <td className="py-4 px-4">
                      <span className="text-slate-900 font-bold block">
                        {row.name}
                      </span>
                    </td>
                    {row.isApproved === "yes" ? (
                      <td className="py-4 px-4">
                        <span className="bg-green-100 text-green-600 border-green-100 p-1 rounded-lg text-xs">
                          Approved
                        </span>
                      </td>
                    ) : (
                      <td className="py-4 px-4">
                        <span className="bg-rose-100 text-rose-600 border-rose-100 p-1 rounded-lg text-xs">
                          Pending
                        </span>
                      </td>
                    )}
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {row.price}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {row.capacity}
                    </td>
                    <td className="py-4 px-4 text-right relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === row.id ? null : row.id,
                          )
                        }
                        className="w-8 h-8 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 inline-flex items-center justify-center text-slate-550 transition-all"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-200 w-full rounded-md p-5 ">
          <div className="flex gap-2 justify-center items-center">
            <TriangleAlert className="text-rose-500" />
            <h1 className="text-sm">No venue is listed....</h1>
          </div>
        </div>
      )}
    </div>
  );
}
