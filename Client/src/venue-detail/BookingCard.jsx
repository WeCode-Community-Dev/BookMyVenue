import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  Minus,
  Clock,
} from "lucide-react";
import VenueBookingWidget from "./VenueBookingWidget";



export function BookingCard({
  onOpenRegister,
  data,
  selectedDate,
  setSelectedDate,
  selectedDays,
  setSelectedDays,
  finalPrice,
  setFinalPrice,
  bookedDates
}) {
 
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);


  const price = data?.price;
  const slots = data?.slots;


  useEffect(() => {
    if (price && selectedDays === 1) {
      setFinalPrice(price);
    }
  }, [price]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleForward = () => {
    const newDays = selectedDays + 1;
    setSelectedDays(newDays);
    setFinalPrice(price * newDays);
  };

  const handleBackward = () => {
    if (selectedDays <= 1) return;
    const newDays = selectedDays - 1;
    setSelectedDays(newDays);
    setFinalPrice(price * newDays);
  };

  return (
    <div
      className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.05)] p-6 flex flex-col 
    gap-6 sticky top-24 animate-fade-in-up"
    >
      <div>
        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">
          Premium Listing
        </div>
        <h4 className="text-xl font-bold text-slate-800 leading-snug mt-1">
          {data?.name || "Luxury Apartment"}
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          {data?.type || "Entire Home"} • {data?.place || "City Center"}
        </p>
      </div>

      <div className="flex items-baseline gap-1 py-4 border-y border-slate-100">
        <span className="text-3xl font-black text-slate-900">
          ₹{data?.price || 350}
        </span>
        <span className="text-slate-500 text-sm font-semibold">/day</span>
      </div>


      <div className="w-full ">
        <h2 className="text-sm font-semibold text-slate-500 mb-4">
          Available Slots
        </h2>

        <VenueBookingWidget 
        fetchedBookings={bookedDates}
        dateSelect={handleDateSelect}
        date={selectedDate}
        />
      </div>

              <div>
          <label className="block text-[10px] font-bold text-slate-500  uppercase tracking-wider mb-1.5 pl-1">
            Lease Duration
          </label>
          <div className="relative overflow-hidden">
            <input
              type="number"
              value={selectedDays}
              readOnly
              className="w-full text-center bg-[#FAF9F6] border border-slate-200  hover:border-slate-300 rounded-2xl py-3 
                px-10 text-slate-700 text-xs font-bold appearance-none cursor-pointer pr-10   transition-all outline-none overflow-hidden"
            />
            <Minus
              onClick={() => handleBackward()}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-full"
            />
            <Plus
              onClick={() => handleForward()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-full cursor-pointer"
            />
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
          <span>Lease Duration</span>
          <span className="font-bold text-slate-800">× {selectedDays}</span>
        </div>

        <div className="h-px bg-red-100 my-1"></div>

        <div className="flex justify-between items-baseline">
          <span className="text-red-900 font-bold text-sm">
            Total Estimate:
          </span>
          <span className="text-xl font-black text-slate-900">
            ₹{finalPrice}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <button
          onClick={onOpenRegister}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-[0.98]"
        >
          Book Venue
        </button>
        <button
          // onClick={onContactAgent}
          className="w-full bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 rounded-2xl font-bold text-xs transition-all active:scale-[0.98]"
        >
          Contact Agent
        </button>
      </div>
    </div>
  );
}

export default BookingCard;
