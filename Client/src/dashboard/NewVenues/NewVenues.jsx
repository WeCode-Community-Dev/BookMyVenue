import React from "react";
import { useOutletContext } from "react-router-dom";
import {
  Check,
  X,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Star,
  CheckCheck,
  ArrowUpRight,
} from "lucide-react";
import DetailModal from "./DetailModal";

export default function NewVenues() {
  const {
    venues,
    setVenues,
    handleAddNotification,
    handleApprove,
    isLoading,
    handleVerify,
  } = useOutletContext();

  // console.log("ve...", handleApprove);

  const pendingVenues =
    venues?.filter((v) => v.isApproved === "no" || v.status === "pending") ||
    [];

  const handleReject = (id, name) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
    handleAddNotification(`Venue '${name}' approval request was rejected.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in-up mt-10 p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            New Venue Approvals
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review and approve pending venue submissions from organizers.
          </p>
        </div>
        <div
          className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center
         gap-2 self-start md:self-auto"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-ticket-orange animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">
            {isLoading ? "..." : pendingVenues.length} Pending Submission
            {pendingVenues.length !== 1 && "s"}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="group relative bg-[#F7F5EE] rounded-3xl overflow-hidden border
         border-slate-200/80 shadow-md flex flex-col h-full"
            >
              <div className="relative h-60 w-full bg-slate-200 animate-pulse"></div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-end justify-end gap-2">
                  <div className="h-4 w-10 bg-slate-200 rounded animate-pulse"></div>
                </div>

                <div className="mt-2 h-6 w-3/4 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="mt-2 h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>

                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse"></div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
                </div>

                <div className="flex gap-2 mt-4">
                  <div className="h-10 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="h-10 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pendingVenues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingVenues.map((venue, index) => (
            <div
              key={venue.id || index}
              className="group relative bg-[#F7F5EE] rounded-3xl overflow-hidden border
         border-slate-200/80 hover:border-slate-350 shadow-md hover:shadow-xl transition-all duration-500 
         hover:-translate-y-1.5 flex flex-col h-full cursor-pointer   animate-fade-in-up "
              style={{
                animationDelay: `0.${index++}s`,
              }}
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-200">
                <img
                  src={venue.image}
                  alt={`${venue.name}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                <div className="absolute bottom-4 left-4 flex gap-1 z-10"></div>

                <span
                  className="absolute bottom-4 right-4 bg-ticket-yellow text-slate-900 text-[10px] 
        font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm"
                >
                  {venue.type}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-end justify-end gap-2">
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-ticket-yellow text-ticket-yellow" />
                    <span>{venue.rating}</span>
                  </div>
                </div>

                <h3
                  className="mt-2 text-lg font-bold text-slate-900 leading-snug group-hover:text-ticket-orange
                    transition-colors
         duration-300"
                >
                  {venue.name}
                </h3>

                <div className="mt-2 flex items-center gap-1.5 text-slate-500 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{venue.place}</span>
                </div>

                <p className="mt-3 text-slate-600 text-xs line-clamp-2 leading-relaxed">
                  {venue.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">
                      Up to {venue.capacity} guests
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">
                      ₹{venue.price}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      / hour
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(venue)}
                    className="w-full mt-4 bg-slate-50 hover:bg-black text-slate-700 hover:text-white
           py-2.5 rounded-xl font-bold text-xs transition-colors duration-300 flex items-center
            justify-center gap-1 group/btn border border-slate-250/60 active:scale-95 animate-fade-in"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                  <button
                    onClick={() => handleVerify(venue._id)}
                    className="w-full mt-4 bg-slate-50 hover:bg-ticket-orange text-slate-700 hover:text-white
           py-2.5 rounded-xl font-bold text-xs transition-colors duration-300 flex items-center
            justify-center gap-1 group/btn border border-slate-250/60 active:scale-95 animate-fade-in"
                  >
                    <span>Approve</span>
                    <CheckCheck
                      className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5
                     group-hover/btn:-translate-y-0.5"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div
            className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border
           border-slate-100"
          >
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">All Caught Up!</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            There are no pending venue approval requests at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
