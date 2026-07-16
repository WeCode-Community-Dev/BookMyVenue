import { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import "react-day-picker/style.css";

export function VenueBookingWidget({
  venueName,
  pricePerDay,
  fetchedBookings,
  dateSelect,
  date
}) {
  const [selectedDate, setSelectedDate] = useState();
  


  const disabledDates = useMemo(() => {

    return [{ before: new Date() }, ...fetchedBookings];
  }, [fetchedBookings]);


  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden font-sans p-5">


      <div className="p-4 flex justify-center w-full max-w-sm mx-auto overflow-hidden">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={dateSelect}
          disabled={disabledDates}
          modifiersClassNames={{
            selected:
              "bg-ticket-yellow text-black font-bold hover:bg-ticket-yellow shadow-md rounded-full",
            today: "text-ticket-yellow font-bold",
            disabled:
              "text-slate-300 line-through cursor-not-allowed hover:bg-transparent",
          }}
          classNames={{
            months: "w-full",
            month: "w-full space-y-4",

            month_caption:
              "flex justify-center items-center font-bold text-xl text-slate-800 relative",

            nav: "flex items-center",
            button_previous:
              "absolute left-0 p-1 text-indigo-600 hover:text-indigo-800",
            button_next:
              "absolute right-0 p-1 text-indigo-600 hover:text-indigo-800",

            month_grid: "w-full border-collapse",

            weekdays: "grid grid-cols-7 w-full",
            weekday:
              "text-center font-semibold text-slate-500 text-xs uppercase py-2",

            week: "grid grid-cols-7 w-full",
            day: "flex items-center justify-center aspect-square p-0",

            day_button:
              "w-full h-full flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-base font-medium max-w-10 max-h-10 mx-auto",

            outside: "invisible",
          }}
          className="bg-white w-full"
        />
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-4">
        <div className="h-6">
          {date ? (
            <p className="text-xs font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Selected:{" "}
              {date.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          ) : (
            <p className=" text-slate-500 flex items-center gap-2 text-xs">
              <CalendarIcon className="w-4 h-4" />
              Please select an available date
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VenueBookingWidget;
