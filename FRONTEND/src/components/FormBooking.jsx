import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function FormBooking ({venue}) {

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedSession, setSelectedSession] = useState("Hourly")

    const handleChange = (e) => {
        setSelectedSession(e.target.value)
    }
    
    return (
        <div className="mb-6 space-y-4">
    
        

        {/* 2. Unified Session & Time Slot Card */}
        <div className="border border-gray-300 rounded-xl shadow-sm bg-white overflow-hidden transition-all">
            
            {/* Select Wrapper */}
            <div className="relative group hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="absolute top-2 left-3 text-[10px] font-bold text-gray-500 uppercase tracking-wide pointer-events-none">
                    Session
                </div>
                
                <select
                    className="w-full pt-6 pb-2 px-3 text-sm font-medium text-gray-800 bg-transparent outline-none appearance-none cursor-pointer"
                    onChange={handleChange}
                >
                    <option value="Hourly">Hourly</option>
                    <option value="Daily">Daily</option>
                </select>
                
                {/* FIX: SVG is now positioned specifically inside the select area */}
                <svg 
                    className="w-4 h-4 text-gray-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 group-hover:text-gray-600 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Hourly Slots - Now seamlessly attached to the bottom of the select */}
            {selectedSession === "Hourly" && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                    {venue.availtime && venue.availtime.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {venue.availtime.map((time) => (
                                <button
                                    className="border border-gray-200 rounded-lg py-2 px-3 bg-white hover:border-black hover:ring-1 hover:ring-black text-sm font-medium text-gray-700 transition-all text-center cursor-pointer shadow-sm"
                                    type="button"
                                    key={time}
                                >
                                    {time}
                                </button>
                            ))}
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
            )
}