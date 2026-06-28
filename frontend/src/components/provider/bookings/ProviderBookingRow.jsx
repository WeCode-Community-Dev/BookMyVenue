import { Mail, Phone } from "lucide-react";
import {
  formatSlotDateCompact,
  formatSlotLabel,
  formatTimeRange,
} from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";
import { resolvePopulatedRef } from "../../../utils/booking";

const formatStatus = (status) => {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const statusStyles = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  cancelled: "bg-gray-100 text-gray-600 ring-gray-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  failed: "bg-red-50 text-red-700 ring-red-100",
  refunded: "bg-sky-50 text-sky-700 ring-sky-100",
};

const formatPhoneDisplay = (phone) => {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
};

const toTelHref = (phone) => {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) return `tel:+91${digits}`;
  if (digits.length > 10) return `tel:+${digits}`;
  return `tel:${digits}`;
};

const ROW_GRID =
  "md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)_minmax(0,1fr)_auto_minmax(0,5.5rem)] md:items-center md:gap-3";

const ProviderBookingRow = ({ booking }) => {
  const customer = resolvePopulatedRef(booking?.userId);
  const venue = resolvePopulatedRef(booking?.venueId);
  const slot = resolvePopulatedRef(booking?.availabilityId);

  const { amount } = formatPrice(booking?.amount);
  const slotDate = slot?.date ? formatSlotDateCompact(slot.date) : "—";
  const slotTime = slot
    ? formatTimeRange(slot.startTime, slot.endTime)
    : "—";
  const slotLabel = slot?.slotLabel ? formatSlotLabel(slot.slotLabel) : null;
  const reference = booking.bookingReference || booking._id || "—";
  const customerPhone = customer?.phone?.trim() || "";

  return (
    <article
      className={`px-3 py-2.5 transition-colors hover:bg-gray-50/80 sm:px-4 ${ROW_GRID}`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900">
          {customer?.name || "Customer"}
        </p>
        {customer?.email ? (
          <a
            href={`mailto:${customer.email}`}
            className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-gray-500 hover:text-red-600"
          >
            <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{customer.email}</span>
          </a>
        ) : (
          <p className="mt-0.5 text-xs text-gray-400">No email</p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:mt-2">
          {customerPhone ? (
            <a
              href={toTelHref(customerPhone)}
              className="inline-flex min-h-7 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
            >
              <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
              Call {formatPhoneDisplay(customerPhone)}
            </a>
          ) : (
            <span className="text-[11px] text-gray-400">No phone on profile</span>
          )}
        </div>
      </div>

      <div className="mt-2 min-w-0 md:mt-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {venue?.title || "Venue unavailable"}
        </p>
        <p className="mt-0.5 truncate font-mono text-[11px] text-gray-400 md:hidden">
          {reference}
        </p>
      </div>

      <div className="mt-2 min-w-0 text-xs text-gray-600 md:mt-0">
        <p className="font-medium text-gray-800">{slotDate}</p>
        {slotLabel && <p className="mt-0.5 text-gray-700">{slotLabel}</p>}
        <p className="mt-0.5 text-gray-500">{slotTime}</p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1 md:mt-0 md:justify-end">
        {booking.bookingStatus && (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
              statusStyles[booking.bookingStatus] ||
              "bg-gray-100 text-gray-600 ring-gray-200"
            }`}
          >
            {formatStatus(booking.bookingStatus)}
          </span>
        )}
        {booking.paymentStatus && (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
              statusStyles[booking.paymentStatus] ||
              "bg-gray-100 text-gray-600 ring-gray-200"
            }`}
          >
            {formatStatus(booking.paymentStatus)}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 md:mt-0 md:flex-col md:items-end md:justify-center">
        <p className="text-sm font-bold text-red-600 tabular-nums">{amount}</p>
        <p className="hidden truncate font-mono text-[10px] text-gray-400 md:block">
          {reference}
        </p>
      </div>
    </article>
  );
};

export const ProviderBookingTableHeader = () => (
  <div
    className={`hidden border-b border-gray-100 bg-gray-50/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500 md:grid ${ROW_GRID.replace("md:grid ", "")}`}
  >
    <span>Customer</span>
    <span>Venue</span>
    <span>Slot</span>
    <span className="text-right">Status</span>
    <span className="text-right">Amount</span>
  </div>
);

export default ProviderBookingRow;
