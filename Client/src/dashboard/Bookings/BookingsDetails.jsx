import React, { useState } from "react";
import { Search } from "lucide-react";
import { useOutletContext } from "react-router-dom";

function BookingsDetails() {
  const { bookedVenues, isLoading, handleBooking } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState("All");

  const handleSelect = (item) => {
    setSelectedDate(item._id);
  };

  const filteredItems = bookedVenues.filter((i) => {
   return selectedDate === "All" ||
      i?.bookedRanges.some((slot) => slot._id === selectedDate);
   
  });

  // console.log(filteredItems);
  

  return (
    <div className="max-w-none mx-auto space-y-6 animate-fade-in-up p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Booked Venues
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Booked venues will listed here.
          </p>
        </div>
      </div>

      <div className="flex flex-row ">
        <div
          onClick={() => setSelectedDate("All")}
          className={` ${selectedDate === "All" ? "bg-ticket-orange" : "bg-slate-300"} px-7 transition-colors py-2 rounded-lg cursor-pointer`}
        >
          All
        </div>
        {bookedVenues.map((venue) =>
          venue.bookedRanges.map((item, i) => (
            <div
              onClick={() => handleSelect(item)}
              key={i}
              className={`px-5 ${selectedDate === item._id ? "bg-ticket-orange" : "bg-slate-300"}  rounded-lg py-2 flex justify-center items-center mx-2 gap-2 
              font-medium cursor-pointer transition-colors text-xs `}
            >
              <span>{item.startDate.split("T")[0]} --</span>
              <span>{item.endDate.split("T")[0]}</span>
            </div>
          )),
        )}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item, i) => (
            <div
              key={i}
              className="w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm 
              font-sans  ease-in-out hover:shadow-xl hover:-translate-y-1 group  transition-all duration-500 animate-fade-in-up"
            >
              <div className="bg-ticket-orange p-5 flex justify-between items-center gap-4">
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-white/20 p-0.5 overflow-hidden flex-shrink-0">
                    <img
                      src="https://i.pravatar.cc/150?img=32"
                      alt={item.name || "User Avatar"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <span className="text-white/80 text-xs font-medium uppercase tracking-wider mb-0.5">
                      Venue
                    </span>
                    <h2 className="text-white text-lg font-bold leading-tight truncate">
                      {item.venueName || "Venue Name"}
                    </h2>
                  </div>
                </div>

                <div className="bg-white px-3 py-1.5 rounded-full text-ticket-orange text-sm font-bold shadow-sm whitespace-nowrap">
                  {item.price || "Free"}
                </div>
              </div>

              <div className="relative h-4 bg-white flex items-center justify-center overflow-hidden">
                <div className="absolute left-[-8px] w-4 h-4 bg-gray-50 rounded-full border border-gray-200"></div>
                <div className="w-full border-t-2 border-dashed border-gray-100 mx-3"></div>
                <div className="absolute right-[-8px] w-4 h-4 bg-gray-50 rounded-full border border-gray-200"></div>
              </div>

              <div className="p-5 pt-2">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                      Customer Name
                    </p>
                    <p className="text-gray-800 font-semibold mt-1">
                      {item.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="overflow-hidden">
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                        Email
                      </p>
                      <p
                        className="text-gray-800 text-sm font-medium mt-1 truncate"
                        title={item.email}
                      >
                        {item.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-gray-800 text-sm font-medium mt-1">
                        {item.number}
                      </p>
                    </div>
                  </div>

                  {item.bookedRanges.map((i) => (
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="overflow-hidden">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                          Booked From:
                        </p>
                        <p className="text-gray-800 text-sm font-bold mt-1">
                          {i.startDate.split("T")[0]}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                          Booked To:
                        </p>
                        <p className="text-gray-800 text-sm font-bold mt-1">
                          {i.endDate.split("T")[0]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <button 
                  onClick={()=> handleBooking(item)}
                  className="w-full bg-slate-200 py-2 px-4 rounded-md transition-colors hover:bg-ticket-orange hover:text-white mt-2 text-sm font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsDetails;
