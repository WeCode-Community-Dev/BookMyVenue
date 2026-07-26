import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { useToast } from '@/hooks/useToast';
import { API_ENDPOINTS } from '@/constants';
import { BOOKING_TYPES } from '@/constants/venueConstants';
import type { Slot } from '@/types/booking.types';
import type { VenueDetail } from '@/types/venue.types';
import { parseTimeToMinutes } from '@/utils/timeUtils';
import type { AxiosError } from 'axios';

export function useVenueBooking(venueId: string | undefined, venue: VenueDetail | undefined) {
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [calendarVisible, setCalendarVisible] = useState<boolean>(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const blockIdempotencyKeyRef = useRef(crypto.randomUUID());

  useEffect(() => {
    const t = setTimeout(() => {
      setShowFab(true);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const { data: bookableDatesData, isLoading: isCalendarLoading } = useApiQuery<{
    bookableDates: string[];
    disabledDates: string[];
    maxDate: string;
  }>(
    ['bookableDates', venueId || ''],
    {
      url: API_ENDPOINTS.GET_AVAILABILITY(venueId as string),
      method: 'GET',
    },
    {
      enabled: !!venueId,
      staleTime: 5 * 60 * 1000,
    }
  );

  const {
    data: availabilityResponse,
    isLoading: isSlotsLoading,
    refetch,
  } = useApiQuery<{
    venueId: string;
    date: string;
    bookingType: string;
    slots: {
      slotId: string;
      name: string | null;
      startTime: string;
      endTime: string;
      price: number;
      isAvailable: boolean;
      reason: string | null;
    }[];
  }>(
    ['availability', venueId || '', selectedDate],
    {
      url: API_ENDPOINTS.GET_AVAILABILITY(venueId as string),
      method: 'GET',
      params: { date: selectedDate },
    },
    {
      enabled: !!venueId && !!selectedDate,
      staleTime: 0,
      refetchOnMount: 'always',
    }
  );

  const allSlots = availabilityResponse?.slots || [];
  const totalPrice = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
  const sortedSelection = [...selectedSlots].sort(
    (a, b) =>
      allSlots.findIndex((s) => s.slotId === a.slotId) -
      allSlots.findIndex((s) => s.slotId === b.slotId)
  );

  const finalStartTime = sortedSelection.length > 0 ? sortedSelection[0].startTime : null;
  const finalEndTime =
    sortedSelection.length > 0 ? sortedSelection[sortedSelection.length - 1].endTime : null;

  const handleSlotSelect = (slot: Slot) => {
    if (venue?.bookingType === BOOKING_TYPES.FIXED) {
      setSelectedSlots((prev) => (prev[0]?.slotId === slot.slotId ? [] : [slot]));
      return;
    }

    const clickedIdx = allSlots.findIndex((s) => s.slotId === slot.slotId);

    setSelectedSlots((prev) => {
      const isSelected = prev.some((s) => s.slotId === slot.slotId);

      const sortedPrev = [...prev].sort(
        (a, b) =>
          allSlots.findIndex((s) => s.slotId === a.slotId) -
          allSlots.findIndex((s) => s.slotId === b.slotId)
      );

      if (isSelected) {
        if (sortedPrev.length === 1) return [];

        const selIdx = sortedPrev.findIndex((s) => s.slotId === slot.slotId);

        if (selIdx === 0) {
          return sortedPrev.slice(1);
        } else if (selIdx === sortedPrev.length - 1) {
          return sortedPrev.slice(0, -1);
        } else {
          return sortedPrev.slice(0, selIdx);
        }
      }

      if (sortedPrev.length === 0) return [slot];

      const firstIdx = allSlots.findIndex((s) => s.slotId === sortedPrev[0].slotId);
      const lastIdx = allSlots.findIndex(
        (s) => s.slotId === sortedPrev[sortedPrev.length - 1].slotId
      );

      const startRange = Math.min(firstIdx, clickedIdx);
      const endRange = Math.max(lastIdx, clickedIdx);

      const rangeSlots = allSlots.slice(startRange, endRange + 1);

      const isRangeAvailable = rangeSlots.every((s) => s.isAvailable);

      if (isRangeAvailable) {
        return rangeSlots;
      } else {
        setTimeout(
          () =>
            toast.info(
              'Cannot select a range containing unavailable slots. Started a new selection.'
            ),
          0
        );
        return [slot];
      }
    });
  };

  const { mutate: blockSlot, isPending: isBlocking } = useApiMutation(
    (variables) => ({
      url: API_ENDPOINTS.BLOCK_SLOT(venueId as string),
      method: 'POST',
      data: variables,
      headers: { 'Idempotency-Key': blockIdempotencyKeyRef.current },
    }),
    {
      onSuccess: (data) => {
        navigate('/booking/summary', {
          state: {
            lockData: data,
            venueName: venue?.name,
            date: selectedDate,
            slotTime: finalStartTime ? `${finalStartTime} - ${finalEndTime}` : '',
            slotPrice: totalPrice,
          },
        });
      },
      onError: (error: AxiosError<{ message: string }> | Error) => {
        const errorMessage =
          (error as AxiosError<{ message: string }>).response?.data?.message ||
          'Failed to secure slots. Someone may have just booked one.';
        toast.error(errorMessage);
        refetch();
      },
    }
  );

  const handleProceedToBook = () => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }
    if (selectedSlots.length === 0 || !finalStartTime || !finalEndTime) {
      toast.info('Please select a date and at least one time slot.');
      return;
    }

    blockIdempotencyKeyRef.current = crypto.randomUUID();
    blockSlot({
      date: selectedDate,
      selectedSlots: sortedSelection.map((slot) => ({
        startTime: parseTimeToMinutes(slot.startTime),
        endTime: parseTimeToMinutes(slot.endTime),
      })),
      expectedPrice: totalPrice,
    });
  };

  return {
    selectedSlots,
    setSelectedSlots,
    selectedDate,
    setSelectedDate,
    calendarVisible,
    setCalendarVisible,
    bookingOpen,
    setBookingOpen,
    showFab,
    bookableDatesData,
    isCalendarLoading,
    availabilityResponse,
    isSlotsLoading,
    allSlots,
    totalPrice,
    finalStartTime,
    finalEndTime,
    handleSlotSelect,
    handleProceedToBook,
    isBlocking,
  };
}
