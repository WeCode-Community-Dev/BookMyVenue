package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Venue.DTO.VenueRequest;
import com.example.bookMyVenue.Venue.Service.VenueService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/venue")
@AllArgsConstructor
public class VenueController {
    private final VenueService venueService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createVenue(@Valid @ModelAttribute VenueRequest venueRequest){
        venueService.createVenue(venueRequest);

    }
}
