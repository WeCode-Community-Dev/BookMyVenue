import { useState, useMemo } from "react";
import { useParams } from "react-router";
import { CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { DEFAULT_PAGE_LIMIT } from "@/constants/pagination";
import { AxiosError } from "axios";

import {
  useOwnerAvailability,
  useBlockDates,
  useUnblockDates,
} from "@/services/api/useVenues";
import type { BlockedDate } from "@/types/models";

import { VenueCalendar } from "@/components/calendar/VenueCalendar";
import { CalendarLegend } from "@/components/calendar/CalendarLegend";
import { BlockedDatesTable } from "@/components/calendar/BlockedDatesTable";
import { BlockDateDialog } from "@/components/calendar/BlockDateDialog";
import { toLocalDateStr } from "@/utils/dateUtils";

export default function CalendarPage() {
  const { venueId } = useParams<{ venueId: string }>();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);

  const { data, isLoading } = useOwnerAvailability(venueId!);
  const blockMutation = useBlockDates();
  const unblockMutation = useUnblockDates();
  const { success, error } = useToast();

  const bookedSet = useMemo(() => new Set(data?.bookedDates ?? []), [data]);
  const blockedSet = useMemo(() => new Set(data?.blockedDates ?? []), [data]);
  const workingDaysSet = useMemo(
    () => new Set(data?.workingDays ?? []),
    [data],
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const sixMonthsFromNow = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + 6);
    return d;
  }, [today]);

  const dateRangeSet = useMemo(() => {
    return (fromStr: string | null | undefined): Set<string> => {
      if (!fromStr) return new Set();
      const from = new Date(`${fromStr}T00:00:00Z`);
      const start = from > today ? from : today;
      if (start > sixMonthsFromNow) return new Set();
      const set = new Set<string>();
      const cursor = new Date(start);
      while (cursor <= sixMonthsFromNow) {
        set.add(toLocalDateStr(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
      return set;
    };
  }, [today, sixMonthsFromNow]);

  const tempBlockedSet = useMemo(
    () => dateRangeSet(data?.temporaryBlockAfterDate),
    [data?.temporaryBlockAfterDate, dateRangeSet],
  );

  const inactivityBlockedSet = useMemo(
    () => dateRangeSet(data?.inactivityBlockedAfterDate),
    [data?.inactivityBlockedAfterDate, dateRangeSet],
  );

  const isBooked = (date: Date) => bookedSet.has(toLocalDateStr(date));
  const isBlocked = (date: Date) => blockedSet.has(toLocalDateStr(date));
  const isTempBlocked = (date: Date) =>
    tempBlockedSet.has(toLocalDateStr(date));
  const isInactivityBlocked = (date: Date) =>
    inactivityBlockedSet.has(toLocalDateStr(date));
  const isPast = (date: Date) => date < today;
  const isTooFar = (date: Date) => date > sixMonthsFromNow;
  const isNonWorkingDay = (date: Date) => {
    if (workingDaysSet.size === 0) return false;
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return !workingDaysSet.has(dayName);
  };
  const isDisabledDay = (date: Date) =>
    isPast(date) ||
    isTooFar(date) ||
    isBooked(date) ||
    isNonWorkingDay(date) ||
    isTempBlocked(date) ||
    isInactivityBlocked(date);

  const [tablePage, setTablePage] = useState(1);

  const blockedDatesArray = useMemo(() => {
    if (!data?.blockedDates) return [];
    return data.blockedDates
      .map((dateStr) => {
        const d = new Date(`${dateStr}T00:00:00Z`);
        const localD = new Date(
          d.getUTCFullYear(),
          d.getUTCMonth(),
          d.getUTCDate(),
        );
        return {
          date: dateStr,
          dateObj: localD,
          isPast: localD < today,
          venueId: venueId ?? "",
        };
      })
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  }, [data, today, venueId]);

  const paginatedData = useMemo(() => {
    const limit = DEFAULT_PAGE_LIMIT;
    return blockedDatesArray.slice((tablePage - 1) * limit, tablePage * limit);
  }, [blockedDatesArray, tablePage]);

  const totalPages = Math.ceil(blockedDatesArray.length / 10);

  const handleDayClick = (date: Date) => {
    if (isDisabledDay(date)) return;

    setSelectedDate(date);
    setConflictMessage(null);
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedDate) return;
    const dateStr = toLocalDateStr(selectedDate);
    const currentlyBlocked = isBlocked(selectedDate);

    if (currentlyBlocked) {
      unblockMutation.mutate(
        { venueId: venueId!, dates: [dateStr] },
        {
          onSuccess: () => {
            success(`Unblocked ${dateStr}`);
            setConfirmOpen(false);
            setSelectedDate(null);
          },
          onError: (e: unknown) => {
            const err = e as AxiosError<{ message: string }>;
            error(err.response?.data?.message ?? "Failed to unblock date");
          },
        },
      );
    } else {
      blockMutation.mutate(
        { venueId: venueId!, dates: [dateStr] },
        {
          onSuccess: () => {
            success(`Blocked ${dateStr}`);
            setConfirmOpen(false);
            setSelectedDate(null);
          },
          onError: (e: unknown) => {
            const err = e as AxiosError<{ message: string }>;
            if (err.response?.status === 409) {
              setConflictMessage(
                err.response.data.message ||
                  "This date cannot be blocked because there are existing bookings.",
              );
            } else {
              error(err.response?.data?.message ?? "Failed to block date");
              setConfirmOpen(false);
            }
          },
        },
      );
    }
  };

  const isCurrentlyBlocked = selectedDate ? isBlocked(selectedDate) : false;

  return (
    <div className="space-y-6 p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Manage availability — block dates to prevent new bookings.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
          <CalendarDays className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Legend */}
      <CalendarLegend
        hasTempBlock={!!data?.temporaryBlockAfterDate}
        hasInactivityBlock={!!data?.inactivityBlockedAfterDate}
      />

      {/* Calendar */}
      <VenueCalendar
        isLoading={isLoading}
        handleDayClick={handleDayClick}
        isDisabledDay={isDisabledDay}
        isBooked={isBooked}
        isBlocked={isBlocked}
        isTempBlocked={isTempBlocked}
        isInactivityBlocked={isInactivityBlocked}
        isPast={isPast}
        isTooFar={isTooFar}
        isNonWorkingDay={isNonWorkingDay}
      />

      {/* Blocked Dates Data Table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold tracking-tight mb-4">
          Blocked Dates List
        </h2>
        <BlockedDatesTable
          tablePage={tablePage}
          setTablePage={setTablePage}
          paginatedData={paginatedData as BlockedDate[]}
          totalPages={totalPages}
          isLoading={isLoading}
          unblockMutation={unblockMutation}
        />
      </div>

      {/* Conflict error banner */}
      {conflictMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Conflict:</strong> {conflictMessage}
        </div>
      )}

      {/* Block/Unblock Confirmation Dialog */}
      <BlockDateDialog
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isCurrentlyBlocked={isCurrentlyBlocked}
        handleConfirmAction={handleConfirmAction}
        blockPending={blockMutation.isPending}
        unblockPending={unblockMutation.isPending}
      />
    </div>
  );
}
