import React, { useMemo, useState } from "react";
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
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

export default function Venues() {
  const {
    venues,
    setVenues,
    handleAddNotification,
    isLoading,
    user,
    handleAdd,
    handleApprove,
    handleVenueDelete,
    handleEdit,
  } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [approved, setApproved] = useState([]);

  const handleDelete = (id, name) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
    handleAddNotification(`Venue '${name}' was deleted successfully.`);
  };

  const isAdmin = user.role === "admin";
  const isOrganizer = user.role === "organizer";

  const approvedVenues = venues.filter((i) => i.isApproved === "yes");
  const mapVenues = useMemo(() => {
    if (isAdmin) {
      return venues.filter((i) => i.isApproved === "yes");
    }
    if (isOrganizer) {
      return venues;
    }
  });

  const filteredVenues = mapVenues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.place.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-none mx-auto space-y-6 animate-fade-in-up p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Approved Venues
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Approved venues will listed here.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by venue name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-ticket-orange focus:ring-1 focus:ring-ticket-orange/20 transition-all outline-none text-sm text-slate-700 font-medium"
          />
        </div>
      </div>
      <div className="flex ">
        <button
          type="button"
          onClick={() => handleAdd(user.userId)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all
           bg-ticket-orange rounded-lg shadow-sm  hover:shadow active:scale-95 focus:outline-none
            focus:ring-2 focus:ring-offset-2 hover:scale-105 focus:ring-ticket-orange "
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Venues</span>
        </button>
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
      ) : venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue, index) => (
            <div
              key={venue.id || index}
              className="group relative bg-[#F7F5EE] rounded-3xl overflow-hidden border
         border-slate-200/80 hover:border-slate-350 shadow-md hover:shadow-xl transition-all duration-500 
         hover:-translate-y-1.5 flex flex-col h-full cursor-pointer animate-fade-in-up"
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
                  transition-colors duration-300"
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
                    {venue.isApproved === "yes" ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                       bg-emerald-100 text-emerald-800 border border-emerald-200"
                      >
                        <CheckCircle2 size={14} />
                        Verified
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium
                       bg-rose-100 text-rose-600 border border-slate-200"
                      >
                        <XCircle size={14} />
                        Not Verified
                      </span>
                    )}
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

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprove(venue)}
                    className="flex-1 bg-slate-50 hover:bg-ticket-orange text-slate-700 hover:text-white
           py-2.5 rounded-xl font-bold text-xs transition-colors duration-300 flex items-center
           justify-center gap-1 group/btn border border-slate-200 active:scale-95 animate-fade-in"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>

                  {isOrganizer && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(venue);
                        }}
                        className="px-3 bg-slate-50 hover:bg-blue-500 text-slate-700 hover:text-white
           rounded-xl transition-colors duration-300 flex items-center justify-center 
           border border-slate-200 active:scale-95 group/edit"
                        aria-label="Edit venue"
                      >
                        <Edit className="w-4 h-4 transition-transform group-hover/edit:scale-110" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVenueDelete(venue._id);
                        }}
                        className="px-3 bg-slate-50 hover:bg-rose-500 text-slate-700 hover:text-white
           rounded-xl transition-colors duration-300 flex items-center justify-center 
           border border-slate-200 active:scale-95 group/delete"
                        aria-label="Delete venue"
                      >
                        <Trash2 className="w-4 h-4 transition-transform group-hover/delete:scale-110" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          {isAdmin ? (
            <div>
              <div
                className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border
           border-slate-100"
              >
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                All Caught Up!
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                There are no pending venue approval requests at the moment.
              </p>
            </div>
          ) : (
            <div>
              <div
                className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4 border
           border-slate-100"
              >
                <X className="w-8 h-8 text-red-800" />
              </div>
              <h2 className="text-xl font-bold text-red-600">
                No venues 
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                There are no venues listed by you.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
