import { FiCalendar, FiClock, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import type { BookingCardDTO } from '@/types/booking.types';

interface NextBookingBannerProps {
  nextBooking: BookingCardDTO;
  bannerType?: 'nextUp' | 'inProgress';
}

export function NextBookingBanner({ nextBooking, bannerType = 'nextUp' }: NextBookingBannerProps) {
  const navigate = useNavigate();
  const isInProgress = bannerType === 'inProgress';

  return (
    <div
      onClick={() => navigate(`/booking/${nextBooking.bookingRef}`)}
      className={`mb-10 rounded-3xl p-6 text-white shadow-xl cursor-pointer hover:shadow-2xl transition-all relative overflow-hidden group ${
        isInProgress
          ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
          : 'bg-gradient-to-r from-[var(--bg-green)] to-green-600'
      }`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20">
          <img
            src={nextBooking.coverImage}
            alt={nextBooking.venueName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            {isInProgress ? 'In Progress' : 'Next Up'}
          </div>
          <h2 className="text-2xl font-bold mb-2">{nextBooking.venueName}</h2>
          <div className="flex flex-wrap gap-4 text-white/80 text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <FiCalendar /> {nextBooking.date}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock /> {nextBooking.timeRange}
            </span>
            <span className="flex items-center gap-1.5">
              <FiMapPin /> {nextBooking.city}
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors hidden md:flex">
          <FiChevronRight className="text-2xl" />
        </div>
      </div>
    </div>
  );
}
