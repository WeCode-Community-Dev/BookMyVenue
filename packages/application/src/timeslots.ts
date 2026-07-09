// Application layer — Timeslots use-case

import { z } from "zod";
import type { BookingsRepo, VenuesRepo } from "@repo/contracts";
import { isBlocking } from "@repo/domain/bookings";
import {
  generateTimeslots,
  isSlotDisabled,
  slotToMinutes,
  minutesToSlot,
} from "@repo/domain/timeslots";

export const TimeslotsInputSchema = z.object({
  venue_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be in YYYY-MM-DD format"),
});

export type TimeslotsInput = z.infer<typeof TimeslotsInputSchema>;

export interface TimeslotStatus {
  time: string;
  is_disabled: boolean;
  is_booked: boolean;
  is_available: boolean;
}

export const getAvailableTimeslotsUseCase =
  (venues: VenuesRepo, bookings: BookingsRepo) =>
  async (input: TimeslotsInput): Promise<TimeslotStatus[]> => {
    const venue = await venues.findById(input.venue_id);
    if (!venue) {
      throw new Error("Venue not found");
    }

    const { date } = input;

    // Define local boundaries for the day, and convert to ISO string.
    const startOfDayLocal = `${date}T00:00:00`;
    const startOfDayIso = new Date(startOfDayLocal).toISOString();

    const tomorrow = new Date(startOfDayLocal);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfDayIso = tomorrow.toISOString();

    // Fetch all bookings for this venue overlapping with the day
    const conflicts = await bookings.findConflicts({
      venue_id: input.venue_id,
      start_time: startOfDayIso,
      end_time: endOfDayIso,
    });

    const now = Date.now();
    const activeBookings = conflicts.filter((b) => isBlocking(b, now));

    // Get timeslot configurations
    const disabledFrom = venue.address_data?.disabled_from;
    const disabledTo = venue.address_data?.disabled_to;

    const slots = generateTimeslots();
    const result: TimeslotStatus[] = [];

    for (const slot of slots) {
      const is_disabled = isSlotDisabled(slot, disabledFrom, disabledTo);

      // Calculate slot start and end local ISO
      const startMin = slotToMinutes(slot);
      const endMin = startMin + 30;

      const slotStartLocal = `${date}T${slot}:00`;
      const slotEndLocal = `${date}T${minutesToSlot(endMin)}:00`;

      const slotStartIso = new Date(slotStartLocal).toISOString();
      const slotEndIso = new Date(slotEndLocal).toISOString();

      // Check if slot overlaps with any active booking
      let is_booked = false;
      for (const booking of activeBookings) {
        if (slotStartIso < booking.end_time && slotEndIso > booking.start_time) {
          is_booked = true;
          break;
        }
      }

      result.push({
        time: slot,
        is_disabled,
        is_booked,
        is_available: !is_disabled && !is_booked,
      });
    }

    return result;
  };
