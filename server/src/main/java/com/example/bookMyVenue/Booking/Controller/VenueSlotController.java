package com.example.bookMyVenue.Booking.Controller;

import com.example.bookMyVenue.Booking.DTO.VenueSlotsResponse;
import com.example.bookMyVenue.Booking.Service.VenueSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("api/venue/{venueId}/slots")
@RequiredArgsConstructor
public class VenueSlotController {

    private final VenueSlotService venueSlotService;

    @GetMapping
    public ResponseEntity<VenueSlotsResponse> getSlots(
            @PathVariable Long venueId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(venueSlotService.getSlots(venueId, date));
    }
}
