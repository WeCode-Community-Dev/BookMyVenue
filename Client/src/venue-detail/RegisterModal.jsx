import React, { useState } from "react";
import { X, Sparkles, User, Mail, Phone, Calendar, Clock } from "lucide-react";
import AXIOS_API from "../Api/api";

function RegisterModal({ onClose, bookingData, user }) {
  const [isEnd, setIsEnd] = useState(false);

  const [name, setName] = useState(user?.userName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [number, setNumber] = useState(user?.number || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("test-2", bookingData);

  const startDate = new Date(bookingData.date);
  const endDate = new Date(startDate);

  const daysToAdd = parseInt(bookingData.days) || 0;
  endDate.setDate(startDate.getDate() + daysToAdd);

  console.log("days...", bookingData.days);

  const endDateString = endDate.toDateString();

  function toUTCDateOnly(date, endOfDay = false) {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        endOfDay ? 23 : 0,
        endOfDay ? 59 : 0,
        endOfDay ? 59 : 0,
        endOfDay ? 999 : 0,
      ),
    );
  }

  const finalStart = toUTCDateOnly(new Date(bookingData.date));
  const finalEnd = toUTCDateOnly(new Date(endDateString), true);

  const bookedRanges = [
    {
      startDate: finalStart.toISOString(),
      endDate: finalEnd.toISOString(),
    },
  ];

  console.log("range..", bookingData);

  const handleBookSlot = async () => {
    setError("");
    setIsLoading(true);
    try {
      const response = await AXIOS_API.post(
        `/api/v2/list/${bookingData.venueId}/book`,
        {
          userId: user.userId,
          venueId: bookingData.venueId,
          organizerId: bookingData.orgId,
          venueName: bookingData.venueName,
          name,
          email,
          number,
          price: bookingData.totalPrice,
          bookedRanges,
        },
      );
      window.location.reload();
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm animate-fade-in-up
      p-4"
      >
        <div className="relative w-full max-w-[500px] bg-[#FAF9F6] rounded-[2rem] p-6 shadow-2xl animate-modal-fade">
          <button
            onClick={() => onClose()}
            className="absolute top-6 right-6 flex items-center justify-center w-10 h-10 bg-white border border-gray-200
             rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none
              focus:ring-2 focus:ring-slate-800"
          >
            <X strokeWidth={2} className="w-5 h-5" />
          </button>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs tracking-wider uppercase mb-3">
              <Sparkles strokeWidth={2} className="w-4 h-4" />
              Direct Request
            </div>
            <h2 className="text-[1.75rem] font-extrabold text-slate-800 leading-tight mb-2">
              Book Your Slot
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed pr-8">
              Select a preferred day and time window for a private guide through
              Industrial Heights Loft.
            </p>
          </div>
          {error && (
            <div className="w-full bg-red-800 p-3 rounded-lg mb-2 text-white text-center  font-light">
              <span>{error?.message}</span>
            </div>
          )}

          <div className="space-y-2">
            <div>
              <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User strokeWidth={1.5} className="w-5 h-5" />
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail strokeWidth={1.5} className="w-5 h-5" />
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="johndoe@example.com"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-800
                   placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-800
                    focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.7rem] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Phone strokeWidth={1.5} className="w-5 h-5" />
                </div>
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  type="tel"
                  placeholder="+91 ....."
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="border border-red-200 bg-red-50/20 rounded-2xl p-4 flex flex-col gap-3.5 mt-2 transition-all">
              <div className="text-red-800 text-xs font-bold uppercase tracking-wider">
                Price Breakdown
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Date</span>
                <span className="font-bold text-slate-800">
                  {bookingData.date.toDateString()}
                </span>
              </div>

              {endDateString && (
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>End Day</span>
                  <span className="font-bold text-slate-800">
                    {endDateString}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Days</span>
                <span className="font-bold text-slate-800">
                  {bookingData.days}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Venue Name</span>
                <span className="font-bold text-slate-800">
                  {bookingData.venueName}
                </span>
              </div>

              <div className="h-px bg-red-100 my-1"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-red-900 font-bold text-sm">
                  Total Estimate:
                </span>
                <span className="text-xl font-black text-slate-900">
                  ₹{bookingData.totalPrice}
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => onClose()}
                type="button"
                className="flex-1 bg-transparent border border-gray-200 text-slate-600 font-bold py-3.5 rounded-2xl
                 hover:bg-gray-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all"
              >
                Cancel
              </button>
              {isLoading ? (
                <button
                  className="flex-1 bg-slate-700 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:bg-[#1f2937] 
                hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all"
                >
                  Booking Slot...
                </button>
              ) : (
                <button
                  onClick={() => handleBookSlot()}
                  className="flex-1 bg-[#111827] text-white font-bold py-3.5 rounded-2xl shadow-lg hover:bg-[#1f2937] 
                hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all"
                >
                  Book Slot
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
