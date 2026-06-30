import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function FormBooking ({
    venue, 
    selectedDate, 
    setSelectedDate, 
    selectedSession, 
    setSelectedSession, 
    selectedTimes, 
    setSelectedTimes 
}) {

    // handles muiltiple time interval selection and removing.
    const handleTimeClick = (time) => {
        setSelectedTimes((prevTimes) => {
            if(prevTimes.includes(time)){
                return prevTimes.filter((t) => t !== time)
            } else {
                return [...prevTimes, time]
            }
        })
    }

    // converts string time(9am) to (9, 0, 0, 0) format
    const SetTimeFromString = (dateObject, StringTime) => {
        const [time, modifier] = StringTime.split(" ");
        let [hour, minute] = time.split(":").map(Number)

        if(modifier === "PM" && hour < 12) hour += 12
        if(modifier === "AM" && hour === 12) hour = 0

        dateObject.setHours(hour, minute, 0, 0);
        return dateObject
    }

    // generate time interval list to display time intervals (9am - 11am)
    const GenerateHourlyTimeIntervals = () => {
        let intervals = [] 
        const startTime = new Date()

        const endTime = new Date()

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

    const isHourly = venue.availability.booking_types == "hourly"
    const isDaily = venue.availability.booking_types == "daily"

    return (
        <>
        <div className="mb-6 space-y-4">
            {/* 2. Unified Session & Time Slot Card */}
            <div className="border border-gray-300 rounded-xl shadow-sm bg-white overflow-hidden transition-all">
                
                {/* Select Wrapper */}
                <div className="relative group hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="absolute top-2 left-3 text-[10px] font-bold text-gray-500 uppercase tracking-wide pointer-events-none">
                        Session
                    </div>
                    
                    <div
                        className="w-full pt-6 pb-2 px-3 text-sm font-medium text-gray-800 bg-transparent outline-none appearance-none cursor-pointer"
                    >
                        {isHourly && <h3 value="hourly">Hourly</h3>}
                        {isDaily && <h3 value="daily">Daily</h3>}
                    </div>
                    
                    {/* <svg 
                        className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 group-hover:text-gray-600 transition-colors" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg> */}
                </div>

                {/* hourly Slots - Now seamlessly attached to the bottom of the select */}
                {isHourly && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                        {availTime && availTime.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {availTime.map((time) => {
                                    const isSelected = selectedTimes.includes(time)
                                    return (
                                        <button
                                            onClick={() => handleTimeClick(time)}
                                            className={`border border-gray-200 rounded-lg py-2 px-3 bg-white text-sm font-medium text-gray-700 transition-all text-center cursor-pointer shadow-sm
                                            ${isSelected
                                                ? 'bg-[#ff5c5d] border-[#ff5c5d] ring-1 ring-[#ff5c5d]'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:border-black '
                                            }`}
                                            type="button"
                                            key={time}
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
                    onChange={setSelectedDate}
                    minDate={new Date()}
                    className="border-none w-full"
                />
            </div>
        </div>
    </>
    )
}