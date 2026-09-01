package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Venue.Enums.DurationType;
import com.example.bookMyVenue.Venue.Model.Venue;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueAvailabilityRulesRequest {

    private DurationType durationType;

    private Integer durationHour;

    @NotNull
    private DayOfWeek weekStartDay;
    @NotNull
    private DayOfWeek weekEndDay;

    @NotNull
    private LocalTime operatingStartTime;
    @NotNull
    private LocalTime operatingEndTime;

    private LocalTime nightStartTime;

    private BigDecimal weekdayDayRate;
    private BigDecimal weekdayNightRate;
    private BigDecimal weekendDayRate;
    private BigDecimal weekendNightRate;


    @AssertTrue(message = "Duration hour is required when duration type is HOURLY")
    public boolean isDurationHourRequiredForHourly() {
        if (durationType != DurationType.HOURLY) {
            return true;
        }
        return durationHour != null && durationHour > 0;
    }

    @AssertTrue(message = "Duration hour must only be set when duration type is HOURLY")
    public boolean isDurationHourOnlySetForHourly() {
        if (durationType == DurationType.HOURLY) {
            return true;
        }
        return durationHour == null;
    }

    @AssertTrue(message = "Operating end time must be strictly after operating start time and cannot wrap past midnight")
    public boolean isEndTimeAfterStartTime() {
        if (operatingStartTime == null || operatingEndTime == null) {
            return true;
        }
        return operatingEndTime.isAfter(operatingStartTime);
    }

    @AssertTrue(message = "Operating end time must align with start time in exact multiples of the selected duration (e.g. 10 AM + 2h -> 12, 2, 4, 6, 8, 10)")
    public boolean isEndTimeSyncedWithDuration() {
        if (durationType != DurationType.HOURLY) {
            return true;
        }
        if (operatingStartTime == null || operatingEndTime == null || durationHour == null || durationHour <= 0) {
            return true;
        }
        if (!operatingEndTime.isAfter(operatingStartTime)) {
            return true;
        }
        long totalMinutes = Duration.between(operatingStartTime, operatingEndTime).toMinutes();
        long durationMinutes = durationHour * 60L;
        return totalMinutes % durationMinutes == 0;
    }

    @AssertTrue(message = "Night start time must fall within operating hours (between operating start and end time)")
    public boolean isNightStartTimeWithinWindow() {
        if (nightStartTime == null || operatingStartTime == null || operatingEndTime == null) {
            return true;
        }
        if (!operatingEndTime.isAfter(operatingStartTime)) {
            return true;
        }
        return !nightStartTime.isBefore(operatingStartTime) && nightStartTime.isBefore(operatingEndTime);
    }

    @AssertTrue(message = "Night start time must align with operating start time in exact multiples of the selected duration (must fall exactly on a slot boundary)")
    public boolean isNightStartTimeSyncedWithDuration() {
        if (durationType != DurationType.HOURLY) {
            return true;
        }
        if (nightStartTime == null || operatingStartTime == null || durationHour == null || durationHour <= 0) {
            return true;
        }
        if (nightStartTime.isBefore(operatingStartTime)) {
            return true;
        }
        long minutesFromOpen = Duration.between(operatingStartTime, nightStartTime).toMinutes();
        long durationMinutes = durationHour * 60L;
        return minutesFromOpen % durationMinutes == 0;
    }

    @AssertTrue(message = "Night start time must leave room for at least one full slot duration before operating end time")
    public boolean isNightStartTimeLeavesRoomForOneSlot() {
        if (durationType != DurationType.HOURLY) {
            return true;
        }
        if (nightStartTime == null || operatingEndTime == null || durationHour == null || durationHour <= 0) {
            return true;
        }
        if (!operatingEndTime.isAfter(nightStartTime)) {
            return true;
        }
        long minutesToClose = Duration.between(nightStartTime, operatingEndTime).toMinutes();
        long durationMinutes = durationHour * 60L;
        return minutesToClose >= durationMinutes;
    }
}