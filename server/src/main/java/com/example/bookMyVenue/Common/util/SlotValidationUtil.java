package com.example.bookMyVenue.Common.util;

import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalTime;

@Component
public class SlotValidationUtil {

    public void validateAlignsToSlotBoundaries(LocalTime start, LocalTime end, VenueAvailabilityRules rule) {

        long slotDurationHours = rule.getDurationHour();

        if (start.getMinute() != 0 || start.getSecond() != 0) {
            throw new IllegalArgumentException("startTime must be on the hour (e.g. 10:00, 12:00)");
        }
        if (end.getMinute() != 0 || end.getSecond() != 0) {
            throw new IllegalArgumentException("endTime must be on the hour (e.g. 12:00, 14:00)");
        }

        long hoursFromOpening = getOperatingSpanHours(rule.getOperatingStartTime(), start);
        long durationHours = getOperatingSpanHours(start, end);

        if (hoursFromOpening % slotDurationHours != 0) {
            throw new IllegalArgumentException(
                    "startTime must align with the venue's slot boundaries (slots start every " +
                            slotDurationHours + " hour(s) from " + rule.getOperatingStartTime() + ")");
        }

        if (durationHours % slotDurationHours != 0) {
            throw new IllegalArgumentException(
                    "Duration must be a multiple of the slot duration (" + slotDurationHours + " hour(s))");
        }
    }

    // handles overnight spans (e.g. open 18:00, close 02:00) consistently, reused across slot generation too
    public long getOperatingSpanMinutes(LocalTime start, LocalTime end) {
        long minutes = Duration.between(start, end).toMinutes();
        if (minutes <= 0) {
            minutes += 24 * 60;
        }
        return minutes;
    }

    private long getOperatingSpanHours(LocalTime start, LocalTime end) {
        return getOperatingSpanMinutes(start, end) / 60;
    }

    public boolean overlaps(LocalTime aStart, LocalTime aEnd, LocalTime bStart, LocalTime bEnd) {
        return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
    }
}
