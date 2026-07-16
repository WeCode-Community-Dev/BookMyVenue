import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function CalendarDropdown({ 
  selectedStartDate, 
  selectedEndDate, 
  onSelectDate, 
  onClose,
  activeField // 'start' or 'end'
}) {
  const [currentDate, setCurrentDate] = useState(selectedStartDate || new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };
  
  const isDateSelected = (day) => {
    const checkDate = new Date(year, month, day);
    
    if (selectedStartDate && checkDate.toDateString() === selectedStartDate.toDateString()) {
      return 'start';
    }
    if (selectedEndDate && checkDate.toDateString() === selectedEndDate.toDateString()) {
      return 'end';
    }
    return null;
  };
  
  const isDateInRange = (day) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const checkDate = new Date(year, month, day);
    return checkDate > selectedStartDate && checkDate < selectedEndDate;
  };
  
  const isDateDisabled = (day) => {
    const checkDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDayClick = (day) => {
    if (isDateDisabled(day)) return;
    const clickedDate = new Date(year, month, day);
    onSelectDate(clickedDate);
  };

  // Generate calendar days grid
  const days = [];
  
  // Fill previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      day: prevMonthTotalDays - i,
      isCurrentMonth: false,
      dateValue: new Date(year, month - 1, prevMonthTotalDays - i)
    });
  }
  
  // Fill current month days
  for (let i = 1; i <= totalDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      dateValue: new Date(year, month, i)
    });
  }
  
  // Fill next month padding days to make it a perfect grid of 6 rows (42 days)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      dateValue: new Date(year, month + 1, i)
    });
  }

  return (
    <div className="absolute top-full left-0 mt-2 z-40 bg-[#FAF9F6] border border-slate-200/80 rounded-2xl shadow-xl p-4 w-72 select-none animate-fade-in origin-top">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <button 
          type="button" 
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-bold text-slate-800 text-sm">
          {monthNames[month]} {year}
        </span>
        <button 
          type="button" 
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Days of week titles */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {daysOfWeek.map((day, idx) => (
          <span key={idx} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>
      
      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {days.map((item, idx) => {
          if (!item.isCurrentMonth) {
            // Disabled padding days
            return (
              <span 
                key={idx} 
                className="h-8 flex items-center justify-center text-xs text-slate-300 font-medium"
              >
                {item.day}
              </span>
            );
          }
          
          const disabled = isDateDisabled(item.day);
          const selectedType = isDateSelected(item.day);
          const inRange = isDateInRange(item.day);
          
          let dayClass = "text-slate-700 hover:bg-slate-150 rounded-lg cursor-pointer";
          
          if (disabled) {
            dayClass = "text-slate-300 cursor-not-allowed";
          } else if (selectedType === 'start' || selectedType === 'end') {
            dayClass = "bg-ticket-yellow text-slate-900 font-bold rounded-lg shadow-sm scale-105 transition-all";
          } else if (inRange) {
            dayClass = "bg-ticket-yellow/15 text-slate-800 font-medium rounded-lg";
          } else if (isToday(item.day)) {
            dayClass = "text-ticket-orange font-bold border border-ticket-orange/30 rounded-lg";
          }
          
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(item.day)}
              className={`h-8 text-xs font-semibold flex items-center justify-center transition-all ${dayClass}`}
            >
              {item.day}
            </button>
          );
        })}
      </div>
      
      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-ticket-yellow rounded-md inline-block"></span>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-ticket-yellow/15 border border-ticket-yellow/20 rounded-md inline-block"></span>
          <span>Range</span>
        </div>
        <button 
          type="button"
          onClick={onClose}
          className="text-ticket-orange hover:text-ticket-orange/80 transition-colors uppercase font-bold"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CalendarDropdown;
