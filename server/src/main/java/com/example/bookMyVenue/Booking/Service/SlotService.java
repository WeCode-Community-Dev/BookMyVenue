//package com.example.bookMyVenue.Booking.Service;
//
//import com.example.bookMyVenue.Booking.DTO.SlotRequest;
//import com.example.bookMyVenue.Booking.DTO.SlotResponse;
//import com.example.bookMyVenue.Booking.Model.VenueBooking;
//import com.example.bookMyVenue.Booking.Repository.VenueBookingRepo;
//import com.example.bookMyVenue.Enums.BookingStatus;
//import com.example.bookMyVenue.Enums.SlotStatus;
//import com.example.bookMyVenue.Enums.VenueExceptionType;
//import com.example.bookMyVenue.Venue.DTO.VenueExceptionRequest;
//import com.example.bookMyVenue.Venue.Model.Venue;
//import com.example.bookMyVenue.Venue.Model.VenueAvailabilityException;
//import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
//import com.example.bookMyVenue.Venue.Service.VenueAvailabilityExcepService;
//import com.example.bookMyVenue.Venue.Service.VenueAvailabilityRulesService;
//import com.example.bookMyVenue.Venue.Service.VenueService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//import java.time.DayOfWeek;
//import java.time.Duration;
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.*;
//
//@RequiredArgsConstructor
//@Service
//public class SlotService {
//
//    private final VenueAvailabilityRulesService venueAvailabilityRulesService;
//    private final VenueService venueService;
//    private final VenueAvailabilityExcepService venueAvailabilityExcepService;
//    private final VenueBookingRepo venueBookingRepo;
//
////    public List<SlotResponse> getSlots(Long venueId, LocalDate date) {
////        VenueAvailabilityRules rules = venueAvailabilityRulesService.getActiveRule(venueId);
////        if (rules == null) {
////            return Collections.emptyList();
////        }
////
////        DayOfWeek day = date.getDayOfWeek();
////        int dayVal = day.getValue();
////        int startVal = rules.getWeekStartDay().getValue();
////        int endVal = rules.getWeekEndDay().getValue();
////
////        boolean valid;
////        if (startVal <= endVal) {
////            valid = (dayVal >= startVal && dayVal <= endVal);
////        } else {
////            valid = (dayVal >= startVal || dayVal <= endVal);
////        }
////
////        if (valid) {
////            // Find exceptions for this date
////            VenueAvailabilityException exception = venueAvailabilityExcepService.getExceptionRulesByIdAndDate(venue, date);
////
////            // Find bookings for this date that are PENDING or CONFIRMED
////            List<VenueBooking> bookings = venueBookingRepo.findByVenueAndBookingDateAndBookingStatusIn(
////                    venue,
////                    date,
////                    List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
////            );
////
////            List<SlotResponse> slotList = new ArrayList<>();
////            LocalTime timeVariable = rules.getVenueOpeningTime();
////
////            long slotIndex = 1; // dummy ID for the slot
////
////            while (timeVariable.isBefore(rules.getVenueClosingTime())) {
////                LocalTime slotEndTime = timeVariable.plusHours(rules.getMinDuration());
////                if (slotEndTime.isAfter(rules.getVenueClosingTime())) {
////                    slotEndTime = rules.getVenueClosingTime();
////                }
////
////                if (!slotEndTime.isAfter(timeVariable)) {
////                    break;
////                }
////
////                // Determine slot status
////                SlotStatus status = SlotStatus.AVAILABLE;
////
////                // Check exception block
////                if (exception != null) {
////                    if (timeVariable.isBefore(exception.getEndTime()) && slotEndTime.isAfter(exception.getStartTime())) {
////                        status = SlotStatus.BLOCKED;
////                    }
////                }
////
////                // Check bookings block
////                if (status == SlotStatus.AVAILABLE) {
////                    for (VenueBooking booking : bookings) {
////                        if (timeVariable.isBefore(booking.getBookingEnd()) && slotEndTime.isAfter(booking.getBookingStart())) {
////                            status = SlotStatus.BOOKED;
////                            break;
////                        }
////                    }
////                }
////
////                // Calculate price
////                long minutes = Duration.between(timeVariable, slotEndTime).toMinutes();
////                double hours = minutes / 60.0;
////                BigDecimal price = BigDecimal.valueOf(venue.getPricePerHour() != null ? venue.getPricePerHour() * hours : 0.0);
////
////                SlotResponse slotResponse = SlotResponse.builder()
////                        .id(slotIndex++)
////                        .venueId(venueId)
////                        .slotDate(date)
////                        .startTime(timeVariable)
////                        .endTime(slotEndTime)
////                        .price(price)
////                        .status(status)
////                        .build();
////
////                slotList.add(slotResponse);
////                timeVariable = slotEndTime;
////            }
////            return slotList;
////        }
////        return Collections.emptyList();
////    }
//
////    public SlotResponse getSlot(Long venueId, Long slotId) {
////        // Since slots are generated dynamically, we reconstruct the slots for tomorrow and find by index/ID
////        LocalDate tomorrow = LocalDate.now().plusDays(1);
////        List<SlotResponse> slots = getSlots(venueId, tomorrow);
////        return slots.stream()
////                .filter(s -> s.getId().equals(slotId))
////                .findFirst()
////                .orElseThrow(() -> new NoSuchElementException("Slot not found with ID: " + slotId + " for date: " + tomorrow));
////    }
//
//    public SlotResponse createSlot(Long venueId, SlotRequest request) {
//        // Blocks a slot using VenueAvailabilityException
//        VenueExceptionRequest exceptionRequest = new VenueExceptionRequest();
//        exceptionRequest.setException_date(request.getSlotDate());
//        exceptionRequest.setStart_time(request.getStartTime());
//        exceptionRequest.setEnd_time(request.getEndTime());
//        exceptionRequest.setVenueExceptionType(VenueExceptionType.MAINTENANCE);
//        exceptionRequest.setReason("Manually Blocked Slot");
//
//        VenueAvailabilityException exception = venueAvailabilityExcepService.createNewException(venueId, exceptionRequest);
//
//        return SlotResponse.builder()
//                .id(exception.getId())
//                .venueId(venueId)
//                .slotDate(request.getSlotDate())
//                .startTime(request.getStartTime())
//                .endTime(request.getEndTime())
//                .price(request.getPrice())
//                .status(SlotStatus.BLOCKED)
//                .build();
//    }
//}
