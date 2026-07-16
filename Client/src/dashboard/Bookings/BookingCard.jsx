import React, { useEffect, useState } from "react";
import { X, MapPin, User } from "lucide-react";
import AXIOS_API from "../../Api/api";

const BookingModal = ({ onClose, data }) => {
  const [venue, setVenue] = useState("");

  const fetchVenue = async () => {
    try {
      const response = await AXIOS_API.get(
        `/api/v2/list/getOne/${data.venueId}`,
      );
      setVenue(response?.data?.venue);
    } catch (error) {
      console.log(error);
    }
  };

  console.log("got from...", data.bookedRanges);
  console.log("got venue...", venue);

  useEffect(() => {
    fetchVenue();
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="flex h-full items-center justify-center p-4 overflow-y-auto animate-fade-in-up transition-all duration-300">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/40"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-56 w-full">
            <img
              src={venue.image}
              alt="Venue"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-5 left-6 right-6">
        

              <h2 className="mt-3 text-3xl font-bold text-white">
                {venue.name}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-200">
                <MapPin className="h-4 w-4" />
                {venue.place}
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 flex items-center gap-4 border-b pb-6">
              <div className="rounded-full bg-orange-100 p-3">
                <User className="h-6 w-6 text-orange-500" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer Profile
                </p>

                <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email Address
                </p>

                <p className="break-all font-medium text-gray-900 text-sm">
                  {data.email}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Phone Number
                </p>

                <p className="font-medium text-gray-900 text-sm">
                  {data.number}
                </p>
              </div>
            </div>

            <div className="border border-red-200 bg-red-50/20 rounded-2xl p-4 flex flex-col gap-3.5 mt-2 transition-all">
              <div className="text-red-800 text-xs font-bold uppercase tracking-wider">
                Booking Breakdown
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Daily Rent</span>
                <span className="font-bold text-slate-800">₹{data?.price}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Reservation Date</span>
                <span className="font-bold text-slate-800">
                  {data?.bookedRanges[0]?.startDate.split("T")[0]}
                </span>
                <span className="font-bold text-slate-800">
                  {data?.bookedRanges[0]?.endDate.split("T")[0]}
                </span>
              </div>

              <div className="h-px bg-red-100 my-1"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-red-900 font-bold text-sm">
                  Total Estimate:
                </span>
                <span className="text-xl font-black text-slate-900">
                  ₹{data.price}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 w-full rounded-xl bg-gray-900 py-3.5 font-semibold text-white transition hover:bg-gray-800"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
