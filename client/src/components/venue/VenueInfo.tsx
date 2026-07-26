import { useState } from 'react';
import { MapPin, Users, ShieldCheck } from 'lucide-react';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { GiTable } from 'react-icons/gi';
import { TbBuildingEstate, TbReceiptRefund, TbShieldOff } from 'react-icons/tb';
import type { VenueDetail } from '@/types/venue.types';
import { CANCELLATION_POLICIES, REFUND_TYPES } from '@/constants/bookingConstants';

interface VenueInfoProps {
  venue: VenueDetail;
}

export function VenueInfo({ venue }: VenueInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const getSafeGoogleMapsEmbedUrl = (url: string | undefined): string | null => {
    if (!url) return null;
    try {
      const { protocol, hostname, pathname } = new URL(url);
      const ALLOWED_HOSTS = ['maps.google.com', 'www.google.com', 'google.com'];
      if (protocol !== 'https:') return null;
      if (!ALLOWED_HOSTS.includes(hostname)) return null;
      const isEmbedPath = pathname.startsWith('/maps/embed');
      const isEmbedQuery = url.includes('output=embed');
      if (!isEmbedPath && !isEmbedQuery) return null;
      return url;
    } catch {
      return null;
    }
  };

  const safeMapUrl = getSafeGoogleMapsEmbedUrl(venue.googleMapsUrl);

  return (
    <>
      <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-5 sm:p-6 lg:p-8 mb-10 shadow-sm hover:shadow-md transition-all duration-300">
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-5 flex items-center gap-2">
          <span>About Venue</span>
          <span className="w-8 h-[2px] bg-[var(--bg-green)]"></span>
        </h2>
        <div className="relative">
          <p
            className={`text-[var(--text-secondary)] leading-relaxed text-sm whitespace-pre-wrap ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}
          >
            {venue.description}
          </p>
          {venue.description && venue.description.length > 150 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-[var(--bg-green)] font-bold text-sm mt-2 hover:underline cursor-pointer"
            >
              {isDescriptionExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <span>Venue Details</span>
          <span className="w-8 h-[2px] bg-[var(--bg-green)]"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md hover:border-[var(--bg-green)]/25 transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="bg-[var(--bg-green)]/10 p-3.5 rounded-2xl group-hover:scale-110 transition duration-300">
                <MdOutlineMeetingRoom className="text-[var(--bg-green)] text-2xl" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                  Venue Type
                </p>
                <h3 className="font-bold text-[var(--text-primary)] text-lg capitalize mt-0.5">
                  {venue.venueType}
                </h3>
              </div>
            </div>
          </div>

          {venue.maxCapacity && (
            <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md hover:border-[var(--bg-green)]/25 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="bg-[var(--bg-green)]/10 p-3.5 rounded-2xl group-hover:scale-110 transition duration-300">
                  <Users className="text-xl text-[var(--bg-green)] mr-3" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                    Capacity
                  </p>
                  <h3 className="font-bold text-[var(--text-primary)] text-lg mt-0.5">
                    Up to {venue.maxCapacity} Guests
                  </h3>
                </div>
              </div>
            </div>
          )}

          {venue.spaceAttributes && venue.spaceAttributes.length > 0 && (
            <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md hover:border-[var(--bg-green)]/25 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="bg-[var(--bg-green)]/10 p-3.5 rounded-2xl group-hover:scale-110 transition duration-300">
                  <TbBuildingEstate className="text-[var(--bg-green)] text-2xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                    Space Type
                  </p>
                  <h3 className="font-bold text-[var(--text-primary)] text-lg mt-0.5">
                    {venue.spaceAttributes.join(', ')}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {venue.seatingConfigurations && venue.seatingConfigurations.length > 0 && (
            <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md hover:border-[var(--bg-green)]/25 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="bg-[var(--bg-green)]/10 p-3.5 rounded-2xl group-hover:scale-110 transition duration-300">
                  <GiTable className="text-[var(--bg-green)] text-2xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                    Seating
                  </p>
                  <h3 className="font-bold text-[var(--text-primary)] text-lg mt-0.5">
                    {venue.seatingConfigurations.join(', ')}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[var(--bg-green)]/10 p-3.5 rounded-2xl">
            <MapPin className="text-[var(--bg-green)] mt-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Location</h2>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">
              {venue.city}, {venue.district}
            </p>
          </div>
        </div>
        <p className="text-[var(--text-primary)] text-lg mb-6 leading-relaxed">
          {venue.address}, {venue.pincode}
        </p>
        {venue.googleMapsUrl &&
          (safeMapUrl ? (
            <div className="relative rounded-3xl overflow-hidden border border-[var(--bg-grey)] h-[300px] shadow-inner">
              <iframe
                src={safeMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                sandbox="allow-scripts allow-same-origin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              ></iframe>
            </div>
          ) : (
            <a
              href={venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-green)]/10 text-[var(--bg-green)] border border-[var(--bg-green)]/25 font-semibold text-sm hover:bg-[var(--bg-green)]/20 transition"
            >
              <MapPin className="text-base" />
              Open in Google Maps
            </a>
          ))}
      </div>

      <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 mt-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[var(--bg-green)]/10 p-3.5 rounded-2xl">
            <TbReceiptRefund className="text-[var(--bg-green)] text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Cancellation & Refund Policy
            </h2>
            <p className="text-[var(--text-secondary)] mt-1 font-medium">
              Please review the refund terms for this venue
            </p>
          </div>
        </div>

        {venue.cancellation?.policy === CANCELLATION_POLICIES.NON_REFUNDABLE && (
          <div className="bg-red-500/5 dark:bg-red-950/10 border border-red-500/15 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-red-500/10 p-2.5 rounded-xl text-red-600 dark:text-red-400 shrink-0">
              <TbShieldOff size={24} />
            </div>
            <div>
              <h3 className="font-bold text-red-800 dark:text-red-400 text-lg mb-1">
                Non-Refundable Policy
              </h3>
              <p className="text-red-700/80 dark:text-red-300/80 leading-relaxed text-sm">
                This venue operates under a strict non-refundable policy. Cancelled bookings are not
                eligible for any refund.
              </p>
            </div>
          </div>
        )}

        {venue.cancellation?.policy === CANCELLATION_POLICIES.REFUNDABLE &&
          venue.cancellation?.refundType === REFUND_TYPES.FULL && (
            <div className="bg-[var(--bg-green)]/10 border border-[var(--bg-green)]/20 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
              <div className="bg-[var(--bg-green)]/10 p-2.5 rounded-xl text-[var(--bg-green)] shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400 text-lg mb-1">
                  Full Refund Policy
                </h3>
                <p className="text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed text-sm">
                  Bookings cancelled prior to the event are eligible for a 100% full refund of the
                  booking amount.
                </p>
              </div>
            </div>
          )}

        {venue.cancellation?.policy === CANCELLATION_POLICIES.REFUNDABLE &&
          venue.cancellation?.refundType === REFUND_TYPES.TIME_BASED && (
            <div>
              <div className="bg-blue-500/5 dark:bg-blue-950/10 border border-blue-500/15 rounded-2xl p-5 flex items-start gap-4 mb-6 shadow-sm">
                <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-800 dark:text-blue-400 text-lg mb-1">
                    Time-based Refund Policy
                  </h3>
                  <p className="text-blue-700/80 dark:text-blue-300/80 leading-relaxed text-sm">
                    Refunds are calculated dynamically based on the number of days remaining until
                    the scheduled event start date.
                  </p>
                </div>
              </div>

              {venue.cancellation.refundRules && venue.cancellation.refundRules.length > 0 ? (
                <div className="overflow-hidden border border-[var(--bg-grey)]/80 rounded-2xl shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--bg-grey)] text-[var(--text-primary)]">
                        <th className="py-4 px-6 font-semibold border-b border-[var(--bg-grey)] text-base">
                          Timeline
                        </th>
                        <th className="py-4 px-6 font-semibold border-b border-[var(--bg-grey)] text-base text-right">
                          Refund Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...venue.cancellation.refundRules]
                        .sort((a, b) => b.daysBefore - a.daysBefore)
                        .map((rule, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-[var(--bg-grey)]/20 transition-colors border-b border-[var(--bg-grey)] last:border-b-0"
                          >
                            <td className="py-4 px-6 text-[var(--text-primary)] font-medium text-base">
                              {rule.daysBefore} or more days before event
                            </td>
                            <td className="py-4 px-6 text-right font-bold text-base text-[var(--bg-green)]">
                              {rule.refundPercentage}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[var(--text-secondary)] italic">No refund rules configured.</p>
              )}
            </div>
          )}
      </div>
    </>
  );
}
