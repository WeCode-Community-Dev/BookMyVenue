import React, { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Star,
  Sparkles,
  Users,
  XCircle,
  Check,
  Mail,
  Phone,
  Trash2,
  Edit,
} from "lucide-react";
import AXIOS_API from "../../Api/api";
import useAuth from "../../Auth/useAuth";

function DetailModal({
  venue,
  onClose,
  fetchVenue,
  verify,
  edit,
  deleteVenue,
}) {
  const orgId = venue.organiZerId;
  const [organizer, setOrganizer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  console.log("this", user);

  const isAdmin = user.role === "admin";
  const isOrganizer = user.role === "organizer";

  const fetchOrg = async () => {
    setIsLoading(true);
    try {
      const res = await AXIOS_API.get(`/api/v1/register/getOrg/${orgId}`);
      setOrganizer(res.data.organizer);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div
        className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-[#fdfdfc] shadow-2xl
       max-h-[90vh] animate-fade-in-up"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="relative h-64 w-full sm:h-96 shrink-0 bg-gray-100">
            <img
              src={venue.image}
              alt={venue.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute bottom-6 right-6 rounded-full bg-[#FFD700] px-4 py-1.5 text-xs font-bold tracking-widest text-black shadow-md">
              {venue.type}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 text-[#1a1f2c]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {venue.name}
                </h2>
                <div className="mt-2 flex items-center gap-1.5 text-base text-gray-500">
                  <MapPin className="h-4.5 w-4.5" />
                  <span>{venue.place}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-lg font-bold">
                <Star className="h-6 w-6 fill-[#FFC107] text-[#FFC107]" />
                {venue.rating}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-xl font-bold mb-3">About the Venue</h3>
                  <p className="leading-relaxed text-[#596274]">
                    {venue.description}
                  </p>
                </section>

                <div className="bg-[#FAF9F6] border border-slate-200/60 rounded-[2rem] p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2  gap-2">
                    {venue.spec?.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-150/70 hover:border-slate-300 hover:shadow-sm rounded-xl
                                p-4 flex items-center gap-3 transition-all duration-300 group hover:-translate-y-0.5"
                      >
                        <div
                          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center
                                justify-center text-slate-450 group-hover:text-ticket-orange group-hover:bg-ticket-orange/5 transition-all"
                        >
                          <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {item.spec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <section>
                  <h3 className="text-xl font-bold mb-3">Approval Notes</h3>
                  <div className="rounded-xl bg-amber-50 p-4 border border-amber-100">
                    <p className="text-sm text-amber-800">
                      <strong>Pending checks:</strong> Fire safety certificate
                      expires next month. Please verify renewal status with the
                      host before final approval.
                    </p>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Key Specifications
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Maximum Capacity
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-lg">
                        <Users className="h-5 w-5 text-[#FFD700]" />
                        {venue.capacity}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">
                        Base Pricing
                      </div>
                      <div className="text-3xl font-extrabold tracking-tight">
                        ₹{venue.price}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        per day
                      </div>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Organizer Details
                    </h4>

                    <div className="flex items-center gap-4 mb-5">
                      {isLoading ? (
                        <>
                          <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse shrink-0" />
                          <div className="space-y-2 w-full">
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-lg font-bold text-indigo-600">
                            {venue?.organizer?.name?.charAt(0) || "O"}
                          </div>
                          <div>
                            <h5 className="font-bold text-[#1a1f2c] leading-tight">
                              {organizer?.userName || "Organizer Name"}
                            </h5>
                            <p className="text-xs font-medium text-green-500 mt-0.5">
                              Verified Host
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      {isLoading ? (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                            <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                            <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 text-sm text-[#596274]">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50">
                              <Phone className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium">
                              {organizer?.number || "+91 98765 43210"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-[#596274]">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50">
                              <Mail className="h-4 w-4 text-gray-500" />
                            </div>
                            <span className="font-medium truncate">
                              {organizer?.email || "host@example.com"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white p-4 sm:px-8 sm:py-5 shrink-0 flex items-center justify-between">
          {isAdmin && (
            <div>
              <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                Request Changes
              </button>
            </div>
          )}

          {isAdmin ? (
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-700 transition-all hover:bg-red-100 focus:ring-2 focus:ring-red-200 focus:outline-none">
                <XCircle className="h-4 w-4" />
                Reject
              </button>
              <button
                onClick={() => deleteVenue(venue._id)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1a1f2c] px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-black focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:outline-none"
              >
                <Check className="h-4 w-4" />
                Approve Venue
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-700 transition-all hover:bg-red-100 focus:ring-2 focus:ring-red-200 focus:outline-none">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <button
                onClick={() => edit(venue)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1a1f2c] px-8 py-2.5 text-sm font-bold text-white transition-all hover:bg-black focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 focus:outline-none"
              >
                <Edit className="h-4 w-4" />
                Edit Venue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailModal;
