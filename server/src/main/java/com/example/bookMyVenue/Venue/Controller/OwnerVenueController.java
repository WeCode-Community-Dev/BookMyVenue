package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Venue.DTO.VenueRequest;
import com.example.bookMyVenue.Venue.DTO.VenueResponse;
import com.example.bookMyVenue.Venue.Service.OwnerVenueService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner/venue")
@AllArgsConstructor
public class OwnerVenueController {
    private final OwnerVenueService ownerVenueService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VenueResponse> createVenue(@Valid @ModelAttribute VenueRequest venueRequest){
        VenueResponse venueResponse = ownerVenueService.createVenue(venueRequest);
        return ResponseEntity.ok().body(venueResponse);

    }
}
