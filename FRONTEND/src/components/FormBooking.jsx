import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import apiService from '../services/apiService'; // Important: Import your apiService!

export default function FormBooking ({
    venue, 
    selectedDate, 
    setSelectedDate, 
    selectedSession, 
    setSelectedSession, 
    selectedTimes, 
    setSelectedTimes,
    SetTimeFromString
}) {
    // 1. New State to hold the API response
    const [bookedSlots, setBookedSlots] = useState([]);

    // 2. Fetch the booked slots when the component mounts
    useEffect(() => {
        const fetchBookedSlots = async () => {
            try {
                if (venue?.id) {
                    const response = await apiService.GetAlreadyBookedSlotsToDisable(venue.id);
                    setBookedSlots(Array.isArray(response) ? response : []);
                }
            } catch (error) {
                console.error("Failed to fetch booked slots:", error);
                setBookedSlots([]);
            }
        };
        fetchBookedSlots();
    }, [venue?.id]);

    // 3. Helper function to format the JS Date into "YYYY-MM-DD" so it matches your Database perfectly
    const formatDateForDB = (dateObj) => {
        if (!dateObj) return "";
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const date = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${date}`;
    };

    // 4. When a user clicks a new date, clear out their old time selections to prevent bugs!
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        setSelectedTimes([]); 
    };

    const handleTimeClick = (time) => {
        setSelectedTimes((prevTimes) => {
            if(prevTimes.includes(time)){
                return prevTimes.filter((t) => t !== time)
            } else {
                return [...prevTimes, time]
            }
        })
    }

    const GenerateHourlyTimeIntervals = () => {
        let intervals = [] 
        const startTime = new Date()
        const endTime = new Date()

        console.log(venue)
        SetTimeFromString(startTime, venue.availability.open_time) 
        SetTimeFromString(endTime, venue.availability.closing_time)
        
        while(startTime < endTime){
            const startStr = startTime.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})
            startTime.setHours(startTime.getHours() + 2);
            const endStr = startTime.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})

            intervals.push(`${startStr} - ${endStr}`)   
        }
        intervals.pop()
        
        return(intervals);
    }

    const availTime = GenerateHourlyTimeIntervals();
    const isHourly = venue.availability.booking_types == "hourly";
    const isDaily = venue.availability.booking_types == "daily";

    // 5. Isolate ONLY the bookings that match the currently clicked calendar date
    const selectedDateString = formatDateForDB(selectedDate);
    const todaysBookings = bookedSlots.filter(b => b.booking_date === selectedDateString && b.status === "confirmed");

    // 6. Logic to disable specific days on the calendar completely (For Daily Venues)
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            const dateString = formatDateForDB(date);
            const dayBookings = bookedSlots.filter(b => b.booking_date === dateString && b.status === "confirmed");

            // If it's a daily venue and a booking exists for this date, disable the calendar square!
            if (isDaily && dayBookings.length > 0) {
                return true;
            }
        }
        return false;
    };

    return (
        <>
        <div className="mb-6 space-y-4">
            
            <div className="border border-gray-300 rounded-xl shadow-sm bg-white overflow-hidden transition-all">
                
                <div className="relative group hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="absolute top-2 left-3 text-[10px] font-bold text-gray-500 uppercase tracking-wide pointer-events-none">
                        Session
                    </div>
                    
                    <div className="w-full pt-6 pb-2 px-3 text-sm font-medium text-gray-800 bg-transparent outline-none appearance-none cursor-pointer">
                        {isHourly && <h3 value="hourly">Hourly</h3>}
                        {isDaily && <h3 value="daily">Daily</h3>}
                    </div>
                </div>

                {/* HOURLY SLOTS LOGIC */}
                {isHourly && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                        {availTime && availTime.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {availTime.map((time) => {
                                    const isSelected = selectedTimes.includes(time)
                                    
                                    // 7. Check if this specific button's timeframe overlaps with ANY of today's booked times
                                    const [slotStartStr, slotEndStr] = time.split(" - ");
                                    // Use your helper function to convert "9:00 AM" to "09:00" for math comparison
                                    const slotStart24 = SetTimeFromString(new Date(), slotStartStr, "razorpay");
                                    const slotEnd24 = SetTimeFromString(new Date(), slotEndStr, "razorpay");

                                    // Overlap logic: Does the button start before the booking ends, AND end after the booking starts?
                                    const isBooked = todaysBookings.some(booking => {
                                        return (slotStart24 < booking.end_time) && (slotEnd24 > booking.start_time);
                                    });

                                    return (
                                        <button
                                            key={time}
                                            onClick={() => handleTimeClick(time)}
                                            disabled={isBooked} // Disables the HTML button
                                            className={`border rounded-lg py-2 px-3 text-sm font-medium transition-all text-center shadow-sm
                                            ${isBooked 
                                                ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed line-through' // Grayed out styling
                                                : isSelected
                                                    ? 'bg-[#ff5c5d] text-white border-[#ff5c5d] ring-1 ring-[#ff5c5d] cursor-pointer'
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-black cursor-pointer'
                                            }`}
                                            type="button"
                                        >
                                            {time}
                                        </button>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 text-center py-2 italic">
                                No hourly slots available for this venue.
                            </div>
                        )}
                    </div>
                )}
                
            </div>
            
            <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white">
                <Calendar
                    value={selectedDate}
                    onChange={handleDateChange} // Now uses our new function to clear times!
                    minDate={new Date()}
                    tileDisabled={tileDisabled} // Now applies the gray-out logic to Daily venues!
                    className="border-none w-full"
                />
            </div>
        </div>
    </>
    )
}