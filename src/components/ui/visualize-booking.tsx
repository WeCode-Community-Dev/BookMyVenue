import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Standard 7-day week calendar columns header
const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export type DayType = {
  day: string;
  classNames: string;
  meetingInfo?: {
    id: string;
    date: string;
    time: string;
    title: string;
    participants: string[];
    location: string;
  }[];
};

export interface CalendarBooking {
  id: string;
  venueId: string | number;
  venueTitle: string;
  venueLocation: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: string;
  renterName: string | null;
  renterEmail: string | null;
  bookingType?: string;
}

interface DayProps {
  classNames: string;
  day: DayType;
  onHover: (day: string | null) => void;
  onClick: (day: string) => void;
  isSelected: boolean;
  isToday: boolean;
}

const Day: React.FC<DayProps> = ({ classNames, day, onHover, onClick, isSelected, isToday }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFiller = day.day[0] === '+' || day.day[0] === '-';

  return (
    <>
      <motion.div
        className={`relative flex items-center justify-center py-1 transition-all duration-200 ${classNames} ${
          isSelected
            ? 'ring-2 ring-[#c5a059] ring-offset-2 ring-offset-[#121212] scale-95 z-10'
            : isToday
            ? 'border border-[#c5a059]/50 bg-[#c5a059]/5 hover:scale-105 hover:border-[#c5a059]'
            : isFiller
            ? ''
            : 'hover:scale-105'
        }`}
        style={{ height: '4rem', borderRadius: 16 }}
        onMouseEnter={() => {
          if (!isFiller) {
            setIsHovered(true);
            onHover(day.day);
          }
        }}
        onMouseLeave={() => {
          if (!isFiller) {
            setIsHovered(false);
            onHover(null);
          }
        }}
        onClick={() => {
          if (day.day && !isFiller) {
            onClick(day.day);
          }
        }}
        id={`day-${day.day}`}
      >
        <motion.div className="flex flex-col items-center justify-center">
          {!isFiller && (
            <span className={`text-sm ${isToday ? 'text-[#c5a059] font-bold' : 'text-white'}`}>{day.day}</span>
          )}
          {isToday && (
            <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full mt-1 animate-pulse" />
          )}
        </motion.div>
        {day.meetingInfo && (
          <motion.div
            className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-zinc-700 p-1 text-[10px] font-bold text-white"
            layoutId={`day-${day.day}-meeting-count`}
            style={{
              borderRadius: 999,
            }}
          >
            {day.meetingInfo.length}
          </motion.div>
        )}

        <AnimatePresence>
          {day.meetingInfo && isHovered && (
            <div className="absolute inset-0 flex size-full items-center justify-center">
              <motion.div
                className="flex size-10 items-center justify-center bg-zinc-700 p-1 text-xs font-bold text-white"
                layoutId={`day-${day.day}-meeting-count`}
                style={{
                  borderRadius: 999,
                }}
              >
                {day.meetingInfo.length}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const CalendarGrid: React.FC<{
  days: DayType[];
  onHover: (day: string | null) => void;
  onClick: (day: string) => void;
  selectedDay: string | null;
  currentDate: Date;
}> = ({ days, onHover, onClick, selectedDay, currentDate }) => {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDayStr = String(today.getDate()).padStart(2, '0');

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => {
        const isFiller = day.day[0] === '+' || day.day[0] === '-';
        const isToday =
          !isFiller &&
          day.day === todayDayStr &&
          currentDate.getMonth() === todayMonth &&
          currentDate.getFullYear() === todayYear;

        return (
          <Day
            key={`${day.day}-${index}`}
            classNames={day.classNames}
            day={day}
            onHover={onHover}
            onClick={onClick}
            isSelected={selectedDay === day.day}
            isToday={isToday}
          />
        );
      })}
    </div>
  );
};

interface InteractiveCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  bookings?: CalendarBooking[];
}

const InteractiveCalendar = React.forwardRef<
  HTMLDivElement,
  InteractiveCalendarProps
>((({ className, bookings, ...props }, ref) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setHoveredDay(null);
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setHoveredDay(null);
    setSelectedDay(null);
  };

  const handleDayHover = (day: string | null) => {
    setHoveredDay(day);
  };

  const handleDayClick = (day: string) => {
    setSelectedDay((prev) => (prev === day ? null : day));
  };

  // Dynamically generate the days for the current month/year based on provided bookings
  const dynamicDays = React.useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed
    
    // First day of current month
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sun, 6 = Sat
    
    // Days in current month
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Days in previous month (for filler)
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days: DayType[] = [];
    
    // 1. Fill in previous month's days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push({
        day: `-${dayNum}`,
        classNames: 'bg-zinc-700/10 opacity-30 cursor-default',
      });
    }
    
    // 2. Fill in current month's days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      // Construct date string for this day (YYYY-MM-DD)
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${dayStr}`;
      
      // Filter bookings that cover this date
      const activeBookings = (bookings || []).filter(b => {
        if (b.status === 'cancelled') return false;
        
        // Normalize strings to compare YYYY-MM-DD
        const bStart = b.startDate.split('T')[0];
        const bEnd = b.endDate.split('T')[0];
        
        return dateStr >= bStart && dateStr <= bEnd;
      });
      
      const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      };

      const meetingInfo = activeBookings.length > 0
        ? activeBookings.map(b => {
            const isHourly = b.bookingType === 'hours';
            const dateText = isHourly 
              ? new Date(b.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : `${new Date(b.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(b.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            
            let timeText = b.status === 'offline' ? 'Offline Lock' : `Guests: ${b.guests}`;
            if (isHourly) {
              const startT = formatTime(b.startDate);
              const endT = formatTime(b.endDate);
              timeText = `${startT} - ${endT}`;
            }

            const participantsList = b.status === 'offline'
              ? ['Offline Block', b.renterName].filter(Boolean)
              : [b.renterName || 'Registered User', b.renterEmail || ''].filter(Boolean);
            
            if (isHourly && b.status !== 'offline') {
              participantsList.push(`${b.guests} Guests`);
            } else if (isHourly && b.status === 'offline') {
              participantsList.push('Offline Lock');
            }

            return {
              id: String(b.id),
              date: dateText,
              time: timeText,
              title: b.venueTitle,
              participants: participantsList,
              location: b.venueLocation,
            };
          })
        : undefined;
      
      days.push({
        day: dayStr,
        classNames: `bg-[#1e1e1e] ${meetingInfo ? 'cursor-pointer' : ''}`,
        meetingInfo,
      });
    }
    
    // 3. Fill in next month's days to complete a 6-row grid (42 cells total)
    const totalGridCells = 42;
    const nextMonthDaysCount = totalGridCells - days.length;
    for (let i = 1; i <= nextMonthDaysCount; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      days.push({
        day: `+${dayStr}`,
        classNames: 'bg-zinc-700/10 opacity-30 cursor-default',
      });
    }
    
    return days;
  }, [currentDate, bookings]);

  const sortedDays = React.useMemo(() => {
    const activeDay = hoveredDay || selectedDay;
    if (!activeDay) return dynamicDays;
    return [...dynamicDays].sort((a, b) => {
      if (a.day === activeDay) return -1;
      if (b.day === activeDay) return 1;
      return 0;
    });
  }, [hoveredDay, selectedDay, dynamicDays]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        className={cn("relative mx-auto my-10 flex w-full flex-col items-center justify-center gap-8 lg:flex-row", className)}
        {...props}
      >
        <motion.div layout className="w-full max-w-lg">
          <motion.div
            key="calendar-view"
            className="flex w-full flex-col gap-4"
          >
            {/* Header controls with month navigation */}
            <div className="flex items-center justify-between mb-2">
              <motion.h2 className="text-3xl font-bold tracking-wider text-zinc-300">
                {currentDate.toLocaleString('default', { month: 'long' })}{' '}
                <span className="opacity-50">{currentDate.getFullYear()}</span>
              </motion.h2>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-white/10"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-white/10"
                  type="button"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="px-0/5 rounded-xl bg-[#323232] py-1 text-center text-xs text-white"
                >
                  {day}
                </div>
              ))}
            </div>
            <CalendarGrid
              days={dynamicDays}
              onHover={handleDayHover}
              onClick={handleDayClick}
              selectedDay={selectedDay}
              currentDate={currentDate}
            />
          </motion.div>
        </motion.div>
        
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            key="more-view"
            className="mt-4 flex w-full flex-col gap-4"
          >
            <div className="flex w-full flex-col items-start justify-between">
              <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-zinc-300">
                Bookings
              </motion.h2>
              <p className="font-medium text-zinc-300/50 text-xs">
                See upcoming and past events booked through your event type
                links.
              </p>
            </div>
            <motion.div
              className="flex h-[320px] flex-col items-start justify-start overflow-hidden overflow-y-auto rounded-xl border-2 border-[#323232] shadow-md bg-black/40 backdrop-blur-sm w-full"
              layout
            >
              <AnimatePresence>
                {sortedDays.filter((day) => day.meetingInfo).length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center m-auto">
                    <span className="text-zinc-500 text-xs font-light">
                      No active bookings scheduled for this month.
                    </span>
                  </div>
                ) : (
                  sortedDays
                    .filter((day) => day.meetingInfo)
                    .map((day) => (
                      <motion.div
                        key={day.day}
                        className={`w-full border-b border-[#323232] py-0 last:border-b-0`}
                        layout
                      >
                        {day.meetingInfo &&
                          day.meetingInfo.map((meeting, mIndex) => (
                            <motion.div
                              key={mIndex}
                              className="border-b border-[#323232] p-3 last:border-b-0"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{
                                duration: 0.2,
                                delay: mIndex * 0.05,
                              }}
                            >
                              <div className="mb-2 flex items-center justify-between text-xs">
                                <span className="text-white">
                                  {meeting.date}
                                </span>
                                <span className="text-white">
                                  {meeting.time}
                                </span>
                              </div>
                              <h3 className="mb-1 text-sm font-semibold text-[#c5a059]">
                                {meeting.title}
                              </h3>
                              <p className="mb-1 text-[11px] text-zinc-400">
                                {meeting.participants.join(', ')}
                              </p>
                              <button
                                onClick={() => navigate(`/bookings?bookingId=${meeting.id}`)}
                                className="mt-2 text-xs font-semibold text-[#c5a059] hover:underline flex items-center gap-1 transition-all"
                              >
                                View Details →
                              </button>
                            </motion.div>
                          ))}
                      </motion.div>
                    ))
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}));
InteractiveCalendar.displayName = 'InteractiveCalendar';

export default InteractiveCalendar;


